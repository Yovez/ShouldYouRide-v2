import type { LocationDisplay } from "@/types/weather";

const US_STATE_ABBREVIATIONS: Record<string, string> = {
  Alabama: "AL",
  Alaska: "AK",
  Arizona: "AZ",
  Arkansas: "AR",
  California: "CA",
  Colorado: "CO",
  Connecticut: "CT",
  Delaware: "DE",
  "District of Columbia": "DC",
  Florida: "FL",
  Georgia: "GA",
  Hawaii: "HI",
  Idaho: "ID",
  Illinois: "IL",
  Indiana: "IN",
  Iowa: "IA",
  Kansas: "KS",
  Kentucky: "KY",
  Louisiana: "LA",
  Maine: "ME",
  Maryland: "MD",
  Massachusetts: "MA",
  Michigan: "MI",
  Minnesota: "MN",
  Mississippi: "MS",
  Missouri: "MO",
  Montana: "MT",
  Nebraska: "NE",
  Nevada: "NV",
  "New Hampshire": "NH",
  "New Jersey": "NJ",
  "New Mexico": "NM",
  "New York": "NY",
  "North Carolina": "NC",
  "North Dakota": "ND",
  Ohio: "OH",
  Oklahoma: "OK",
  Oregon: "OR",
  Pennsylvania: "PA",
  "Rhode Island": "RI",
  "South Carolina": "SC",
  "South Dakota": "SD",
  Tennessee: "TN",
  Texas: "TX",
  Utah: "UT",
  Vermont: "VT",
  Virginia: "VA",
  Washington: "WA",
  "West Virginia": "WV",
  Wisconsin: "WI",
  Wyoming: "WY",
};

interface NominatimAddress {
  city?: string;
  town?: string;
  village?: string;
  hamlet?: string;
  county?: string;
  state?: string;
  country?: string;
  country_code?: string;
  "ISO3166-2-lvl4"?: string;
}

interface NominatimResponse {
  address?: NominatimAddress;
}


export function formatCoordinates(lat: number, lon: number): string {
  return `${lat.toFixed(2)}°, ${lon.toFixed(2)}°`;
}

function regionAbbreviation(address: NominatimAddress): string | undefined {
  const isoRegion = address["ISO3166-2-lvl4"];
  if (isoRegion?.includes("-")) {
    return isoRegion.split("-").pop();
  }

  if (address.state) {
    return US_STATE_ABBREVIATIONS[address.state] ?? address.state;
  }

  return undefined;
}

function localityName(address: NominatimAddress): string | undefined {
  return (
    address.city ??
    address.town ??
    address.village ??
    address.hamlet ??
    address.county
  );
}

function formatPlaceLabel(address: NominatimAddress): string | undefined {
  const locality = localityName(address);
  if (!locality) return undefined;

  const region = regionAbbreviation(address);

  if (region) {
    return `${locality}, ${region}`;
  }

  if (address.country && address.country_code !== "us") {
    return `${locality}, ${address.country}`;
  }

  return locality;
}

async function reverseGeocodeWithNominatim(
  lat: number,
  lon: number,
): Promise<string | undefined> {
  const url = new URL("https://nominatim.openstreetmap.org/reverse");
  url.searchParams.set("lat", lat.toString());
  url.searchParams.set("lon", lon.toString());
  url.searchParams.set("format", "json");
  url.searchParams.set("addressdetails", "1");
  url.searchParams.set("zoom", "10");

  const response = await fetch(url, {
    headers: {
      "User-Agent": "ShouldYouRide/2.0 (https://github.com/Yovez/ShouldYouRide-v2)",
    },
    next: { revalidate: 3600 },
  });

  if (!response.ok) return undefined;

  const data = (await response.json()) as NominatimResponse;
  if (!data.address) return undefined;

  return formatPlaceLabel(data.address);
}

async function reverseGeocodeWithOpenMeteo(
  lat: number,
  lon: number,
): Promise<string | undefined> {
  const url = new URL("https://geocoding-api.open-meteo.com/v1/reverse");
  url.searchParams.set("latitude", lat.toString());
  url.searchParams.set("longitude", lon.toString());
  url.searchParams.set("language", "en");
  url.searchParams.set("format", "json");

  const response = await fetch(url, { next: { revalidate: 3600 } });
  if (!response.ok) return undefined;

  const data = (await response.json()) as {
    results?: Array<{ name: string; admin1?: string; country_code?: string }>;
  };

  const place = data.results?.[0];
  if (!place) return undefined;

  const region = place.admin1
    ? US_STATE_ABBREVIATIONS[place.admin1] ?? place.admin1
    : undefined;

  if (region) {
    return `${place.name}, ${region}`;
  }

  return place.name;
}

export async function resolveLocationDisplay(
  lat: number,
  lon: number,
): Promise<LocationDisplay> {
  const coordinates = formatCoordinates(lat, lon);

  const place =
    (await reverseGeocodeWithNominatim(lat, lon)) ??
    (await reverseGeocodeWithOpenMeteo(lat, lon));

  return {
    place: place ?? coordinates,
    coordinates,
  };
}
