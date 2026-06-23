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
        detail: `${temp}°F — comfortable riding range`,
      },
    };
  }

  if (temp >= 50 && temp < 60) {
    return {
      delta: -8,
      factor: {
        label: "Temperature",
        status: "caution",
        detail: `${temp}°F — cool; layer up and watch for cold hands`,
      },
    };
  }

  if (temp > 85 && temp <= 95) {
    return {
      delta: -10,
      factor: {
        label: "Temperature",
        status: "caution",
        detail: `${temp}°F — warm; stay hydrated and take breaks`,
      },
    };
  }

  if (temp > 95) {
    return {
      delta: -25,
      factor: {
        label: "Temperature",
        status: "bad",
        detail: `${temp}°F — extreme heat increases fatigue risk`,
      },
    };
  }

  if (temp >= 40 && temp < 50) {
    return {
      delta: -15,
      factor: {
        label: "Temperature",
        status: "caution",
        detail: `${temp}°F — cold; full gear and shorter rides recommended`,
      },
    };
  }

  return {
    delta: -30,
    factor: {
      label: "Temperature",
      status: "bad",
      detail: `${temp}°F — too cold for most riders without serious gear`,
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
        detail: "Severe weather in the forecast — best to wait it out",
      },
    };
  }

  if (precip > 0 || isRainy(weatherCode)) {
    return {
      delta: -35,
      factor: {
        label: "Precipitation",
        status: "bad",
        detail: "Rain or active precipitation — traction and visibility suffer",
      },
    };
  }

  if (pop >= 60) {
    return {
      delta: -20,
      factor: {
        label: "Rain chance",
        status: "bad",
        detail: `${pop}% chance of rain in the next hour`,
      },
    };
  }

  if (pop >= 30) {
    return {
      delta: -10,
      factor: {
        label: "Rain chance",
        status: "caution",
        detail: `${pop}% chance of rain — pack rain gear`,
      },
    };
  }

  return {
    delta: 0,
    factor: {
      label: "Rain chance",
      status: "good",
      detail: `${pop}% chance of rain — skies look cooperative`,
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
        detail: `${speed} mph — manageable crosswinds`,
      },
    };
  }

  if (speed <= 25) {
    return {
      delta: -12,
      factor: {
        label: "Wind",
        status: "caution",
        detail: `${speed} mph — gusts can push you around; grip firm`,
      },
    };
  }

  return {
    delta: -25,
    factor: {
      label: "Wind",
      status: "bad",
      detail: `${speed} mph — high winds make riding risky`,
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
        detail: `${feelsLike}°F — close to actual temperature`,
      },
    };
  }

  if (feelsLike < 45) {
    return {
      delta: -10,
      factor: {
        label: "Feels like",
        status: "caution",
        detail: `${feelsLike}°F with wind chill — colder than the thermometer`,
      },
    };
  }

  if (feelsLike > 95) {
    return {
      delta: -8,
      factor: {
        label: "Feels like",
        status: "caution",
        detail: `${feelsLike}°F — heat index makes it feel worse`,
      },
    };
  }

  return {
    delta: -5,
    factor: {
      label: "Feels like",
      status: "caution",
      detail: `${feelsLike}°F — wind or humidity shifting comfort`,
    },
  };
}

function verdictFromScore(score: number): Pick<RideScore, "verdict" | "headline" | "summary"> {
  if (score >= 85) {
    return {
      verdict: "excellent",
      headline: "Hell yes — ride!",
      summary: "Conditions look great. Gear up, ride smart, and enjoy the road.",
    };
  }

  if (score >= 70) {
    return {
      verdict: "good",
      headline: "Yeah, you should ride",
      summary: "A solid day for two wheels. Keep an eye on the factors below.",
    };
  }

  if (score >= 50) {
    return {
      verdict: "fair",
      headline: "Maybe — ride with caution",
      summary: "Rideable, but not ideal. Short trips and full gear recommended.",
    };
  }

  if (score >= 30) {
    return {
      verdict: "poor",
      headline: "Probably not today",
      summary: "Conditions are working against you. Consider waiting or taking the cage.",
    };
  }

  return {
    verdict: "stay-home",
    headline: "Stay home, friend",
    summary: "Weather says keep the bike parked. There's always another day.",
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
