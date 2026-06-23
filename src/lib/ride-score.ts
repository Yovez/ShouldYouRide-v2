import { isRainy, isSevereWeather } from "@/lib/weather-codes";
import type { RideConditions, RideFactor, RideScore } from "@/types/weather";

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function scoreTemperature(temp: number): { delta: number; factor: RideFactor } {
  if (temp >= 60 && temp <= 85) {
    return {
      delta: 0,
      factor: {
        label: "Temperature",
        status: "good",
        detail: `${temp}°F. Right in the sweet spot.`,
      },
    };
  }

  if (temp >= 50 && temp < 60) {
    return {
      delta: -8,
      factor: {
        label: "Temperature",
        status: "caution",
        detail: `${temp}°F. A bit cool. Layer up.`,
      },
    };
  }

  if (temp > 85 && temp <= 95) {
    return {
      delta: -10,
      factor: {
        label: "Temperature",
        status: "caution",
        detail: `${temp}°F. Hot. Drink water, take breaks.`,
      },
    };
  }

  if (temp > 95) {
    return {
      delta: -25,
      factor: {
        label: "Temperature",
        status: "bad",
        detail: `${temp}°F. Too hot to be comfortable for long.`,
      },
    };
  }

  if (temp >= 40 && temp < 50) {
    return {
      delta: -15,
      factor: {
        label: "Temperature",
        status: "caution",
        detail: `${temp}°F. Cold. Good gear, shorter ride.`,
      },
    };
  }

  return {
    delta: -30,
    factor: {
      label: "Temperature",
      status: "bad",
      detail: `${temp}°F. Too cold unless you're geared for it.`,
    },
  };
}

function scoreRain(
  pop: number,
  precip: number,
  weatherCode: number,
): { delta: number; factor: RideFactor } {
  if (isSevereWeather(weatherCode)) {
    return {
      delta: -40,
      factor: {
        label: "Precipitation",
        status: "bad",
        detail: "Nasty weather in the area. I'd wait.",
      },
    };
  }

  if (precip > 0 || isRainy(weatherCode)) {
    return {
      delta: -35,
      factor: {
        label: "Precipitation",
        status: "bad",
        detail: "Raining now. Traction gets sketchy fast.",
      },
    };
  }

  if (pop >= 60) {
    return {
      delta: -20,
      factor: {
        label: "Rain chance",
        status: "bad",
        detail: `${pop}% chance of rain in the next hour. Risky.`,
      },
    };
  }

  if (pop >= 30) {
    return {
      delta: -10,
      factor: {
        label: "Rain chance",
        status: "caution",
        detail: `${pop}% chance of rain. Bring rain gear.`,
      },
    };
  }

  return {
    delta: 0,
    factor: {
      label: "Rain chance",
      status: "good",
      detail: `${pop}% chance of rain. Looks mostly dry.`,
    },
  };
}

function scoreWind(speed: number): { delta: number; factor: RideFactor } {
  if (speed <= 15) {
    return {
      delta: 0,
      factor: {
        label: "Wind",
        status: "good",
        detail: `${speed} mph. Shouldn't be a problem.`,
      },
    };
  }

  if (speed <= 25) {
    return {
      delta: -12,
      factor: {
        label: "Wind",
        status: "caution",
        detail: `${speed} mph. Gusts will push you around.`,
      },
    };
  }

  return {
    delta: -25,
    factor: {
      label: "Wind",
      status: "bad",
      detail: `${speed} mph. That's a lot of wind on a bike.`,
    },
  };
}

function scoreFeelsLike(feelsLike: number, temp: number): { delta: number; factor: RideFactor } {
  const gap = Math.abs(feelsLike - temp);

  if (gap <= 5) {
    return {
      delta: 0,
      factor: {
        label: "Feels like",
        status: "good",
        detail: `${feelsLike}°F. About what you'd expect.`,
      },
    };
  }

  if (feelsLike < 45) {
    return {
      delta: -10,
      factor: {
        label: "Feels like",
        status: "caution",
        detail: `${feelsLike}°F with wind chill. Colder than it looks.`,
      },
    };
  }

  if (feelsLike > 95) {
    return {
      delta: -8,
      factor: {
        label: "Feels like",
        status: "caution",
        detail: `${feelsLike}°F. Heat index is rough today.`,
      },
    };
  }

  return {
    delta: -5,
    factor: {
      label: "Feels like",
      status: "caution",
      detail: `${feelsLike}°F. Wind or humidity making it feel different.`,
    },
  };
}

function verdictFromScore(score: number): Pick<RideScore, "verdict" | "headline" | "summary"> {
  if (score >= 85) {
    return {
      verdict: "excellent",
      headline: "Yeah, go ride",
      summary: "Conditions look solid. Gear up and have fun.",
    };
  }

  if (score >= 70) {
    return {
      verdict: "good",
      headline: "Good day for it",
      summary: "Nothing scary in the numbers. Still worth a glance at the details below.",
    };
  }

  if (score >= 50) {
    return {
      verdict: "fair",
      headline: "Eh, maybe",
      summary: "You could ride, but keep it short and don't skip the gear you'd regret leaving home.",
    };
  }

  if (score >= 30) {
    return {
      verdict: "poor",
      headline: "I'd skip it",
      summary: "A few things are working against you today. The car might be the smarter call.",
    };
  }

  return {
    verdict: "stay-home",
    headline: "Stay home",
    summary: "Weather's not on your side. There's always another weekend.",
  };
}

export function calculateRideScore(conditions: RideConditions): RideScore {
  const { current, hourly } = conditions;
  const nextHour = hourly[0];

  let score = 100;
  const factors: RideFactor[] = [];

  const tempResult = scoreTemperature(current.temperature);
  score += tempResult.delta;
  factors.push(tempResult.factor);

  const rainResult = scoreRain(
    nextHour?.precipitationProbability ?? 0,
    current.precipitation,
    current.weatherCode,
  );
  score += rainResult.delta;
  factors.push(rainResult.factor);

  const windResult = scoreWind(current.windSpeed);
  score += windResult.delta;
  factors.push(windResult.factor);

  const feelsResult = scoreFeelsLike(current.feelsLike, current.temperature);
  score += feelsResult.delta;
  factors.push(feelsResult.factor);

  const finalScore = clamp(Math.round(score), 0, 100);
  const verdict = verdictFromScore(finalScore);

  return {
    score: finalScore,
    factors,
    ...verdict,
  };
}
