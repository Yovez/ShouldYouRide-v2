import {
  angularDifference,
  bearingFrom,
  destinationPoint,
  distanceMiles,
  jitterBearing,
  milesFromMinutes,
  normalizeAngle,
  randomBearing,
} from "@/lib/geo";
import { buildGoogleMapsDirectionsUrl } from "@/lib/google-maps-url";
import { geocodePlaceQuery } from "@/lib/geocode-search";
import type {
  GeocodedStop,
  LatLng,
  PlannedRoute,
  RoutePreferences,
} from "@/types/route";

function targetMilesFromPreferences(prefs: RoutePreferences): number {
  if (prefs.distanceMode === "time") {
    return milesFromMinutes(prefs.durationMinutes);
  }

  return prefs.distanceMiles;
}

interface OrderedStop {
  point: LatLng;
  label: string;
  bearing: number;
}

function estimateLoopDistance(origin: LatLng, stops: OrderedStop[]): number {
  if (stops.length === 0) return 0;

  let total = distanceMiles(origin, stops[0].point);
  for (let index = 1; index < stops.length; index += 1) {
    total += distanceMiles(stops[index - 1].point, stops[index].point);
  }
  total += distanceMiles(stops[stops.length - 1].point, origin);
  return total;
}

/** Visit stops clockwise or counter-clockwise, whichever looks shorter in a straight line. */
function pickLoopTraversal(origin: LatLng, stops: OrderedStop[]): OrderedStop[] {
  const clockwise = [...stops].sort((a, b) => a.bearing - b.bearing);
  const counterClockwise = [...clockwise].reverse();

  return estimateLoopDistance(origin, clockwise) <=
    estimateLoopDistance(origin, counterClockwise)
    ? clockwise
    : counterClockwise;
}

function loopRadiusMiles(
  origin: LatLng,
  targetMiles: number,
  stopCount: number,
  customStops: GeocodedStop[],
): number {
  const angleStep = 360 / Math.max(stopCount, 3);
  const halfAngleRad = ((angleStep / 2) * Math.PI) / 180;
  const ringRadius = Math.max(
    (targetMiles / (2 * stopCount * Math.sin(halfAngleRad))) * 1.1,
    4,
  );

  if (customStops.length === 0) {
    return ringRadius;
  }

  const avgCustomRadius =
    customStops.reduce(
      (sum, stop) =>
        sum + distanceMiles(origin, { lat: stop.lat, lng: stop.lng }),
      0,
    ) / customStops.length;

  return Math.max(ringRadius, avgCustomRadius);
}

function generateRingStops(
  origin: LatLng,
  count: number,
  radiusMiles: number,
  scenicStopCount: number,
): OrderedStop[] {
  const baseBearing = randomBearing();
  const angleStep = 360 / count;
  const jitter = scenicStopCount > 0 ? 4 : 0;

  return Array.from({ length: count }, (_, index) => {
    const bearing = normalizeAngle(
      baseBearing + angleStep * index + (jitter ? (Math.random() - 0.5) * jitter : 0),
    );

    return {
      point: destinationPoint(origin.lat, origin.lng, bearing, radiusMiles),
      label: `Around the loop ${index + 1}`,
      bearing,
    };
  });
}

function generateStopsInAngularGaps(
  origin: LatLng,
  customAnchors: OrderedStop[],
  count: number,
  radiusMiles: number,
): OrderedStop[] {
  const sorted = [...customAnchors].sort((a, b) => a.bearing - b.bearing);
  const gaps = sorted.map((stop, index) => {
    const next = sorted[(index + 1) % sorted.length];
    return {
      startBearing: stop.bearing,
      size: angularDifference(stop.bearing, next.bearing),
    };
  });

  const pointsPerGap = new Array(gaps.length).fill(0);
  const gapOrder = gaps
    .map((gap, index) => ({ index, size: gap.size }))
    .sort((a, b) => b.size - a.size);

  for (let index = 0; index < count; index += 1) {
    pointsPerGap[gapOrder[index % gaps.length].index] += 1;
  }

  const generated: OrderedStop[] = [];
  let labelIndex = 1;

  for (let gapIndex = 0; gapIndex < gaps.length; gapIndex += 1) {
    const placements = pointsPerGap[gapIndex];
    if (placements === 0) continue;

    const { startBearing, size } = gaps[gapIndex];
    for (let placement = 1; placement <= placements; placement += 1) {
      const bearing = normalizeAngle(
        startBearing + (size * placement) / (placements + 1),
      );
      generated.push({
        point: destinationPoint(origin.lat, origin.lng, bearing, radiusMiles),
        label: `Around the loop ${labelIndex}`,
        bearing,
      });
      labelIndex += 1;
    }
  }

  return generated;
}

function buildLoopStops(
  origin: LatLng,
  targetMiles: number,
  scenicStopCount: number,
  customStops: GeocodedStop[],
): { waypoints: LatLng[]; waypointLabels: string[] } {
  const customAnchors: OrderedStop[] = customStops.map((stop) => ({
    point: { lat: stop.lat, lng: stop.lng },
    label: stop.label,
    bearing: bearingFrom(origin, { lat: stop.lat, lng: stop.lng }),
  }));

  const generatedNeeded = Math.max(
    3 - customAnchors.length,
    scenicStopCount,
    0,
  );
  const totalStops = customAnchors.length + generatedNeeded;
  const radiusMiles = loopRadiusMiles(
    origin,
    targetMiles,
    totalStops,
    customStops,
  );

  const generated =
    generatedNeeded === 0
      ? []
      : customAnchors.length === 0
        ? generateRingStops(
            origin,
            generatedNeeded,
            radiusMiles,
            scenicStopCount,
          )
        : generateStopsInAngularGaps(
            origin,
            customAnchors,
            generatedNeeded,
            radiusMiles,
          );

  const ordered = pickLoopTraversal(origin, [...customAnchors, ...generated]);

  return {
    waypoints: ordered.map((stop) => stop.point),
    waypointLabels: ordered.map((stop) => stop.label),
  };
}

function generateOneWayScenicPoints(
  origin: LatLng,
  count: number,
  targetMiles: number,
): LatLng[] {
  if (count <= 0) return [];

  const points: LatLng[] = [];
  const baseBearing = randomBearing();
  let current = origin;
  let remaining = targetMiles;
  const legMiles = Math.max(targetMiles / Math.max(count + 1, 2), 5);
  let bearing = baseBearing;

  for (let index = 0; index < count; index += 1) {
    const stepMiles = Math.min(
      legMiles * (0.85 + Math.random() * 0.35),
      Math.max(remaining - 3, 4),
    );
    bearing = jitterBearing(bearing, 40);
    current = destinationPoint(current.lat, current.lng, bearing, stepMiles);
    points.push(current);
    remaining -= stepMiles;
  }

  return points;
}

function orderStopsByBearing(
  origin: LatLng,
  stops: GeocodedStop[],
): GeocodedStop[] {
  return [...stops].sort(
    (a, b) =>
      bearingFrom(origin, a) - bearingFrom(origin, b),
  );
}

export async function planRandomRoute(
  origin: LatLng,
  prefs: RoutePreferences,
): Promise<PlannedRoute> {
  const targetMiles = targetMilesFromPreferences(prefs);

  const customStopResults = (
    await Promise.all(prefs.customStops.map((stop) => geocodePlaceQuery(stop)))
  ).filter((stop): stop is GeocodedStop => stop !== null);

  if (prefs.shape === "loop") {
    const { waypoints, waypointLabels } = buildLoopStops(
      origin,
      targetMiles,
      prefs.scenicStopCount,
      customStopResults,
    );

    return {
      origin,
      destination: origin,
      waypoints,
      waypointLabels,
      isLoop: true,
      targetMiles,
      googleMapsUrl: buildGoogleMapsDirectionsUrl({
        origin,
        destination: origin,
        waypoints,
      }),
    };
  }

  const orderedCustomStops = orderStopsByBearing(origin, customStopResults);
  const customPoints = orderedCustomStops.map((stop) => ({
    lat: stop.lat,
    lng: stop.lng,
  }));

  const scenicPoints = generateOneWayScenicPoints(
    origin,
    prefs.scenicStopCount,
    targetMiles,
  );

  const waypointLabels = [
    ...orderedCustomStops.map((stop) => stop.label),
    ...scenicPoints.map((_, index) => `Scenic stop ${index + 1}`),
  ];

  const intermediate = [...customPoints, ...scenicPoints];

  if (intermediate.length === 0) {
    const destination = destinationPoint(
      origin.lat,
      origin.lng,
      randomBearing(),
      targetMiles * 0.85,
    );

    return {
      origin,
      destination,
      waypoints: [],
      waypointLabels,
      isLoop: false,
      targetMiles,
      googleMapsUrl: buildGoogleMapsDirectionsUrl({
        origin,
        destination,
        waypoints: [],
      }),
    };
  }

  const lastStop = intermediate[intermediate.length - 1];
  const destination = destinationPoint(
    lastStop.lat,
    lastStop.lng,
    randomBearing(),
    Math.max(targetMiles * 0.12, 4),
  );

  return {
    origin,
    destination,
    waypoints: intermediate,
    waypointLabels,
    isLoop: false,
    targetMiles,
    googleMapsUrl: buildGoogleMapsDirectionsUrl({
      origin,
      destination,
      waypoints: intermediate,
    }),
  };
}

export async function fetchGoogleDirections(
  plan: PlannedRoute,
  avoidHighways: boolean,
): Promise<google.maps.DirectionsResult> {
  const service = new google.maps.DirectionsService();

  return new Promise((resolve, reject) => {
    service.route(
      {
        origin: plan.origin,
        destination: plan.destination,
        waypoints: plan.waypoints.map((point) => ({
          location: point,
          stopover: true,
        })),
        travelMode: google.maps.TravelMode.DRIVING,
        avoidHighways,
        optimizeWaypoints: false,
      },
      (result, status) => {
        if (status === google.maps.DirectionsStatus.OK && result) {
          resolve(result);
          return;
        }

        reject(new Error(status));
      },
    );
  });
}

export function summarizeDirections(
  directions: google.maps.DirectionsResult,
): { distanceMiles: number; durationMinutes: number } {
  const route = directions.routes[0];
  if (!route) {
    return { distanceMiles: 0, durationMinutes: 0 };
  }

  const totals = route.legs.reduce(
    (acc, leg) => {
      acc.distanceMeters += leg.distance?.value ?? 0;
      acc.durationSeconds += leg.duration?.value ?? 0;
      return acc;
    },
    { distanceMeters: 0, durationSeconds: 0 },
  );

  return {
    distanceMiles: Math.round((totals.distanceMeters / 1609.34) * 10) / 10,
    durationMinutes: Math.round(totals.durationSeconds / 60),
  };
}

export function directionsToMapsUrl(
  plan: PlannedRoute,
  directions: google.maps.DirectionsResult,
): string {
  const route = directions.routes[0];
  if (!route) {
    return plan.googleMapsUrl;
  }

  const start = route.legs[0]?.start_location;
  const end = route.legs[route.legs.length - 1]?.end_location;
  if (!start || !end) {
    return plan.googleMapsUrl;
  }

  const waypoints: LatLng[] = [];
  route.legs.forEach((leg, index) => {
    if (index === route.legs.length - 1) return;
    const location = leg.end_location;
    waypoints.push({ lat: location.lat(), lng: location.lng() });
  });

  return buildGoogleMapsDirectionsUrl({
    origin: { lat: start.lat(), lng: start.lng() },
    destination: { lat: end.lat(), lng: end.lng() },
    waypoints,
  });
}
