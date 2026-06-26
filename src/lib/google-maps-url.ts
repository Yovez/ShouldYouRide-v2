import type { LatLng } from "@/types/route";

const COORD_EPSILON = 0.0001;

function formatCoord({ lat, lng }: LatLng): string {
  return `${lat.toFixed(6)},${lng.toFixed(6)}`;
}

function coordsEqual(a: LatLng, b: LatLng): boolean {
  return (
    Math.abs(a.lat - b.lat) < COORD_EPSILON &&
    Math.abs(a.lng - b.lng) < COORD_EPSILON
  );
}

export function buildGoogleMapsDirectionsUrl({
  origin,
  destination,
  waypoints,
}: {
  origin: LatLng;
  destination: LatLng;
  waypoints: LatLng[];
}): string {
  const isLoop = coordsEqual(origin, destination);
  const hasWaypoints = waypoints.length > 0;

  // Path format keeps loop routes intact in the Google Maps app.
  if (hasWaypoints || isLoop) {
    const points = [origin, ...waypoints, destination];
    return `https://www.google.com/maps/dir/${points.map(formatCoord).join("/")}`;
  }

  const url = new URL("https://www.google.com/maps/dir/?api=1");
  url.searchParams.set("origin", formatCoord(origin));
  url.searchParams.set("destination", formatCoord(destination));
  url.searchParams.set("travelmode", "driving");
  return url.toString();
}
