const CARDINALS = [
  "N",
  "NNE",
  "NE",
  "ENE",
  "E",
  "ESE",
  "SE",
  "SSE",
  "S",
  "SSW",
  "SW",
  "WSW",
  "W",
  "WNW",
  "NW",
  "NNW",
] as const;

export function degreesToCardinal(degrees: number): string {
  const normalized = ((degrees % 360) + 360) % 360;
  const index = Math.round(normalized / 22.5) % 16;
  return CARDINALS[index];
}

/** NWS wind chill formula (°F, mph). */
export function calculateWindChill(temperatureF: number, speedMph: number): number {
  if (temperatureF > 50 || speedMph < 3) {
    return temperatureF;
  }

  return Math.round(
    35.74 +
      0.6215 * temperatureF -
      35.75 * Math.pow(speedMph, 0.16) +
      0.4275 * temperatureF * Math.pow(speedMph, 0.16),
  );
}
