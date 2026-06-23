export interface WeatherCurrent {
  temperature: number;
  feelsLike: number;
  humidity: number;
  precipitation: number;
  weatherCode: number;
  weatherDescription: string;
  windSpeed: number;
  windDirection: number;
  windDirectionCardinal: string;
}

export interface HourlyForecast {
  time: string;
  label: string;
  temperature: number;
  precipitationProbability: number;
  precipitation: number;
  windSpeed: number;
  windDirectionCardinal: string;
  humidity: number;
  weatherCode: number;
}

export interface RideConditions {
  lat: number;
  lon: number;
  location: LocationDisplay;
  timezone: string;
  sunset: string;
  current: WeatherCurrent;
  hourly: HourlyForecast[];
}

export interface RideScore {
  score: number;
  verdict: "excellent" | "good" | "fair" | "poor" | "stay-home";
  headline: string;
  summary: string;
  factors: RideFactor[];
}

export interface RideFactor {
  label: string;
  status: "good" | "caution" | "bad";
  detail: string;
}

export interface LocationDisplay {
  place: string;
  coordinates: string;
}
