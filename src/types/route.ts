export type RouteShape = "loop" | "one-way";

export type DistanceMode = "miles" | "time";

export interface LatLng {
  lat: number;
  lng: number;
}

export interface GeocodedStop {
  lat: number;
  lng: number;
  label: string;
}

export interface RoutePreferences {
  distanceMode: DistanceMode;
  distanceMiles: number;
  durationMinutes: number;
  shape: RouteShape;
  scenicStopCount: number;
  customStops: string[];
  avoidHighways: boolean;
}

export interface PlannedRoute {
  origin: LatLng;
  destination: LatLng;
  waypoints: LatLng[];
  waypointLabels: string[];
  isLoop: boolean;
  targetMiles: number;
  googleMapsUrl: string;
}

export interface RouteResult {
  plan: PlannedRoute;
  distanceMiles: number;
  durationMinutes: number;
  directions: google.maps.DirectionsResult;
}
