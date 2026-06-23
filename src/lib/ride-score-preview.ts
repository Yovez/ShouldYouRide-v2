import type { RideFactor, RideScore } from "@/types/weather";

const PREVIEW_FACTORS: Record<RideScore["verdict"], RideFactor[]> = {
  excellent: [
    {
      label: "Temperature",
      status: "good",
      detail: "72°F — comfortable riding range",
    },
    {
      label: "Rain chance",
      status: "good",
      detail: "5% chance of rain — skies look cooperative",
    },
    {
      label: "Wind",
      status: "good",
      detail: "8 mph — manageable crosswinds",
    },
    {
      label: "Feels like",
      status: "good",
      detail: "71°F — close to actual temperature",
    },
  ],
  good: [
    {
      label: "Temperature",
      status: "good",
      detail: "68°F — comfortable riding range",
    },
    {
      label: "Rain chance",
      status: "caution",
      detail: "35% chance of rain — pack rain gear",
    },
    {
      label: "Wind",
      status: "good",
      detail: "12 mph — manageable crosswinds",
    },
    {
      label: "Feels like",
      status: "good",
      detail: "66°F — close to actual temperature",
    },
  ],
  fair: [
    {
      label: "Temperature",
      status: "caution",
      detail: "48°F — cool; layer up and watch for cold hands",
    },
    {
      label: "Rain chance",
      status: "caution",
      detail: "40% chance of rain — pack rain gear",
    },
    {
      label: "Wind",
      status: "caution",
      detail: "18 mph — gusts can push you around; grip firm",
    },
    {
      label: "Feels like",
      status: "caution",
      detail: "42°F with wind chill — colder than the thermometer",
    },
  ],
  poor: [
    {
      label: "Temperature",
      status: "caution",
      detail: "38°F — cold; full gear and shorter rides recommended",
    },
    {
      label: "Rain chance",
      status: "bad",
      detail: "70% chance of rain in the next hour",
    },
    {
      label: "Wind",
      status: "bad",
      detail: "28 mph — high winds make riding risky",
    },
    {
      label: "Feels like",
      status: "caution",
      detail: "32°F with wind chill — colder than the thermometer",
    },
  ],
  "stay-home": [
    {
      label: "Temperature",
      status: "bad",
      detail: "28°F — too cold for most riders without serious gear",
    },
    {
      label: "Precipitation",
      status: "bad",
      detail: "Rain or active precipitation — traction and visibility suffer",
    },
    {
      label: "Wind",
      status: "bad",
      detail: "32 mph — high winds make riding risky",
    },
    {
      label: "Precipitation",
      status: "bad",
      detail: "Severe weather in the forecast — best to wait it out",
    },
  ],
};

function verdictFromScore(
  score: number,
): Pick<RideScore, "verdict" | "headline" | "summary"> {
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
      summary:
        "Conditions are working against you. Consider waiting or taking the cage.",
    };
  }

  return {
    verdict: "stay-home",
    headline: "Stay home, friend",
    summary: "Weather says keep the bike parked. There's always another day.",
  };
}

export const DEV_SCORE_PRESETS = [
  { label: "Live", value: null },
  { label: "95", value: 95 },
  { label: "75", value: 75 },
  { label: "55", value: 55 },
  { label: "35", value: 35 },
  { label: "15", value: 15 },
] as const;

export function createPreviewRideScore(score: number): RideScore {
  const verdict = verdictFromScore(score);

  return {
    score,
    factors: PREVIEW_FACTORS[verdict.verdict],
    ...verdict,
  };
}
