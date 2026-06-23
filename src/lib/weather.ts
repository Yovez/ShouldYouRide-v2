import { degreesToCardinal } from "@/lib/wind";
import { resolveLocationDisplay, formatCoordinates } from "@/lib/location";
import { describeWeatherCode } from "@/lib/weather-codes";
import type { HourlyForecast, RideConditions } from "@/types/weather";

interface OpenMeteoResponse {
  latitude: number;
  longitude: number;
  timezone: string;
  current: {
    time: string;
    temperature_2m: number;
    relative_humidity_2m: number;
    apparent_temperature: number;
    precipitation: number;
    weather_code: number;
    wind_speed_10m: number;
    wind_direction_10m: number;
  };
  hourly: {
    time: string[];
    temperature_2m: number[];
    precipitation_probability: number[];
    precipitation: number[];
    wind_speed_10m: number[];
    wind_direction_10m: number[];
    relative_humidity_2m: number[];
    weather_code: number[];
  };
  daily: {
    sunset: string[];
  };
}

function formatHourLabel(isoTime: string, timezone: string): string {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    hour: "numeric",
    hour12: true,
  }).format(new Date(isoTime));
}

function formatSunset(isoTime: string, timezone: string): string {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(new Date(isoTime));
}

export async function fetchRideConditions(
  lat: number,
  lon: number,
): Promise<RideConditions> {
  const url = new URL("https://api.open-meteo.com/v1/forecast");
  url.searchParams.set("latitude", lat.toString());
  url.searchParams.set("longitude", lon.toString());
  url.searchParams.set(
    "current",
    [
      "temperature_2m",
      "relative_humidity_2m",
      "apparent_temperature",
      "precipitation",
      "weather_code",
      "wind_speed_10m",
      "wind_direction_10m",
    ].join(","),
  );
  url.searchParams.set(
    "hourly",
    [
      "temperature_2m",
      "precipitation_probability",
      "precipitation",
      "wind_speed_10m",
      "wind_direction_10m",
      "relative_humidity_2m",
      "weather_code",
    ].join(","),
  );
  url.searchParams.set("daily", "sunset");
  url.searchParams.set("temperature_unit", "fahrenheit");
  url.searchParams.set("wind_speed_unit", "mph");
  url.searchParams.set("precipitation_unit", "inch");
  url.searchParams.set("timezone", "auto");
  url.searchParams.set("forecast_days", "2");

  const [weatherResponse, location] = await Promise.all([
    fetch(url, { next: { revalidate: 600 } }),
    resolveLocationDisplay(lat, lon),
  ]);

  if (!weatherResponse.ok) {
    throw new Error("Unable to load weather data right now.");
  }

  const data = (await weatherResponse.json()) as OpenMeteoResponse;
  const windDirection = data.current.wind_direction_10m;

  const hourly: HourlyForecast[] = data.hourly.time
    .slice(0, 12)
    .map((time, index) => ({
      time,
      label: formatHourLabel(time, data.timezone),
      temperature: Math.round(data.hourly.temperature_2m[index]),
      precipitationProbability: data.hourly.precipitation_probability[index],
      precipitation: data.hourly.precipitation[index],
      windSpeed: Math.round(data.hourly.wind_speed_10m[index]),
      windDirectionCardinal: degreesToCardinal(
        data.hourly.wind_direction_10m[index],
      ),
      humidity: data.hourly.relative_humidity_2m[index],
      weatherCode: data.hourly.weather_code[index],
    }));

  return {
    lat: data.latitude,
    lon: data.longitude,
    location: {
      ...location,
      coordinates: formatCoordinates(data.latitude, data.longitude),
    },
    timezone: data.timezone,
    sunset: formatSunset(data.daily.sunset[0], data.timezone),
    current: {
      temperature: Math.round(data.current.temperature_2m),
      feelsLike: Math.round(data.current.apparent_temperature),
      humidity: data.current.relative_humidity_2m,
      precipitation: data.current.precipitation,
      weatherCode: data.current.weather_code,
      weatherDescription: describeWeatherCode(data.current.weather_code),
      windSpeed: Math.round(data.current.wind_speed_10m),
      windDirection,
      windDirectionCardinal: degreesToCardinal(windDirection),
    },
    hourly,
  };
}
