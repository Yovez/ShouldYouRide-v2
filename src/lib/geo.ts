import type { LatLng } from "@/types/route";

const EARTH_RADIUS_MILES = 3958.8;

export function destinationPoint(
  lat: number,
  lng: number,
  bearingDegrees: number,
  distanceMiles: number,
): LatLng {
  const bearing = (bearingDegrees * Math.PI) / 180;
  const angularDistance = distanceMiles / EARTH_RADIUS_MILES;
  const latRad = (lat * Math.PI) / 180;
  const lngRad = (lng * Math.PI) / 180;

  const destLatRad = Math.asin(
    Math.sin(latRad) * Math.cos(angularDistance) +
      Math.cos(latRad) * Math.sin(angularDistance) * Math.cos(bearing),
  );

  const destLngRad =
    lngRad +
    Math.atan2(
      Math.sin(bearing) * Math.sin(angularDistance) * Math.cos(latRad),
      Math.cos(angularDistance) - Math.sin(latRad) * Math.sin(destLatRad),
    );

  return {
    lat: (destLatRad * 180) / Math.PI,
    lng: (((destLngRad * 180) / Math.PI + 540) % 360) - 180,
  };
}

export function milesFromMinutes(minutes: number, avgMph = 35): number {
  return Math.round((minutes / 60) * avgMph);
}

export function randomBearing(): number {
  return Math.random() * 360;
}

export function jitterBearing(bearing: number, spread = 35): number {
  return (bearing + (Math.random() - 0.5) * spread * 2 + 360) % 360;
}

export function normalizeAngle(degrees: number): number {
  return ((degrees % 360) + 360) % 360;
}

/** Clockwise bearing in degrees from origin to point (0 = north). */
export function bearingFrom(origin: LatLng, point: LatLng): number {
  const lat1 = (origin.lat * Math.PI) / 180;
  const lat2 = (point.lat * Math.PI) / 180;
  const deltaLng = ((point.lng - origin.lng) * Math.PI) / 180;
  const y = Math.sin(deltaLng) * Math.cos(lat2);
  const x =
    Math.cos(lat1) * Math.sin(lat2) -
    Math.sin(lat1) * Math.cos(lat2) * Math.cos(deltaLng);
  return normalizeAngle((Math.atan2(y, x) * 180) / Math.PI);
}

/** Smallest positive clockwise sweep from one bearing to another. */
export function angularDifference(from: number, to: number): number {
  return normalizeAngle(to - from);
}

export function distanceMiles(a: LatLng, b: LatLng): number {
  const lat1 = (a.lat * Math.PI) / 180;
  const lat2 = (b.lat * Math.PI) / 180;
  const dLat = lat2 - lat1;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * EARTH_RADIUS_MILES * Math.asin(Math.sqrt(h));
}
