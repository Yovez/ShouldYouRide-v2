"use client";

import { useEffect } from "react";
import { Map, useMap } from "@vis.gl/react-google-maps";

interface RouteDirectionsOverlayProps {
  directions: google.maps.DirectionsResult | null;
}

function RouteDirectionsOverlay({ directions }: RouteDirectionsOverlayProps) {
  const map = useMap();

  useEffect(() => {
    if (!map || !directions || typeof google === "undefined") return;

    const renderer = new google.maps.DirectionsRenderer({
      map,
      suppressMarkers: false,
      preserveViewport: false,
      polylineOptions: {
        strokeColor: "#ff6b2c",
        strokeWeight: 5,
        strokeOpacity: 0.9,
      },
    });

    renderer.setDirections(directions);

    return () => {
      renderer.setMap(null);
    };
  }, [map, directions]);

  return null;
}

interface RouteMapProps {
  center: { lat: number; lng: number };
  directions: google.maps.DirectionsResult | null;
}

function RouteMapInner({ center, directions }: RouteMapProps) {
  return (
    <Map
      defaultCenter={center}
      defaultZoom={11}
      gestureHandling="greedy"
      disableDefaultUI={false}
      className="h-full w-full"
    >
      <RouteDirectionsOverlay directions={directions} />
    </Map>
  );
}

export function RouteMap({ center, directions }: RouteMapProps) {
  return (
    <div className="h-[420px] overflow-hidden rounded-2xl ring-1 ring-white/10">
      <RouteMapInner center={center} directions={directions} />
    </div>
  );
}
