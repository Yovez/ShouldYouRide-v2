import type { RideFactor, RideScore } from "@/types/weather";

const PREVIEW_FACTORS: Record<RideScore["verdict"], RideFactor[]> = {
  excellent: [
    { label: "Temperature", status: "good", detail: "72°F. Right in the sweet spot." },
    { label: "Rain chance", status: "good", detail: "5% chance of rain. Looks mostly dry." },
    { label: "Wind", status: "good", detail: "8 mph. Shouldn't be a problem." },
    { label: "Feels like", status: "good", detail: "71°F. About what you'd expect." },
  ],
  good: [
    { label: "Temperature", status: "good", detail: "68°F. Right in the sweet spot." },
    { label: "Rain chance", status: "caution", detail: "35% chance of rain. Bring rain gear." },
    { label: "Wind", status: "good", detail: "12 mph. Shouldn't be a problem." },
    { label: "Feels like", status: "good", detail: "66°F. About what you'd expect." },
  ],
  fair: [
    { label: "Temperature", status: "caution", detail: "48°F. A bit cool. Layer up." },
    { label: "Rain chance", status: "caution", detail: "40% chance of rain. Bring rain gear." },
    { label: "Wind", status: "caution", detail: "18 mph. Gusts will push you around." },
    { label: "Feels like", status: "caution", detail: "42°F with wind chill. Colder than it looks." },
  ],
  poor: [
    { label: "Temperature", status: "caution", detail: "38°F. Cold. Good gear, shorter ride." },
    { label: "Rain chance", status: "bad", detail: "70% chance of rain in the next hour. Risky." },
    { label: "Wind", status: "bad", detail: "28 mph. That's a lot of wind on a bike." },
    { label: "Feels like", status: "caution", detail: "32°F with wind chill. Colder than it looks." },
  ],
  "stay-home": [
    { label: "Temperature", status: "bad", detail: "28°F. Too cold unless you're geared for it." },
    { label: "Precipitation", status: "bad", detail: "Raining now. Traction gets sketchy fast." },
    { label: "Wind", status: "bad", detail: "32 mph. That's a lot of wind on a bike." },
    { label: "Feels like", status: "bad", detail: "Nasty weather in the area. I'd wait." },
  ],
};

function verdictFromScore(
  score: number,
): Pick<RideScore, "verdict" | "headline" | "summary"> {
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
