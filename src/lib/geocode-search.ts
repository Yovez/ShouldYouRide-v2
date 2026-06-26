import type { GeocodedStop } from "@/types/route";

interface OpenMeteoSearchResponse {
  results?: Array<{
    name: string;
    latitude: number;
    longitude: number;
    admin1?: string;
    country?: string;
  }>;
}

export async function geocodePlaceQuery(query: string): Promise<GeocodedStop | null> {
  const trimmed = query.trim();
  if (!trimmed) return null;

  const url = new URL("https://geocoding-api.open-meteo.com/v1/search");
  url.searchParams.set("name", trimmed);
  url.searchParams.set("count", "1");
  url.searchParams.set("language", "en");
  url.searchParams.set("format", "json");

  const response = await fetch(url);
  if (!response.ok) return null;

  const data = (await response.json()) as OpenMeteoSearchResponse;
  const place = data.results?.[0];
  if (!place) return null;

  const parts = [place.name, place.admin1, place.country].filter(Boolean);

  return {
    lat: place.latitude,
    lng: place.longitude,
    label: parts.join(", "),
  };
}
