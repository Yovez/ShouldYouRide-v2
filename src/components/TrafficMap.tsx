"use client";

import { useEffect, useState } from "react";
import { APIProvider, Map, useMap } from "@vis.gl/react-google-maps";
import { ExternalLink, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

interface TrafficMapProps {
  lat: number;
  lon: number;
}

function TrafficLayer() {
  const map = useMap();

  useEffect(() => {
    if (!map || typeof google === "undefined") return;

    const layer = new google.maps.TrafficLayer();
    layer.setMap(map);

    return () => {
      layer.setMap(null);
    };
  }, [map]);

  return null;
}

function TrafficMapInner({ lat, lon }: TrafficMapProps) {
  return (
    <Map
      defaultCenter={{ lat, lng: lon }}
      defaultZoom={13}
      gestureHandling="greedy"
      disableDefaultUI={false}
      className="h-full w-full"
    >
      <TrafficLayer />
    </Map>
  );
}

function ExternalTrafficLink({ lat, lon }: TrafficMapProps) {
  return (
    <a
      href={`https://www.google.com/maps/@${lat},${lon},13z/data=!5m1!1e1`}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 rounded-lg bg-zinc-800 px-4 py-2 text-sm font-medium text-zinc-200 transition hover:bg-zinc-700"
    >
      Open traffic in Google Maps
      <ExternalLink className="h-4 w-4" />
    </a>
  );
}

export function TrafficMap({ lat, lon }: TrafficMapProps) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  const [isVisible, setIsVisible] = useState(false);

  if (!apiKey) {
    return (
      <div className="flex min-h-[320px] flex-col items-center justify-center gap-4 rounded-xl border border-dashed border-zinc-700 bg-zinc-950/60 p-6 text-center">
        <p className="max-w-md text-sm text-zinc-400">
          Add a Google Maps API key to embed live traffic here. Set{" "}
          <code className="text-amber-300">NEXT_PUBLIC_GOOGLE_MAPS_API_KEY</code> in{" "}
          <code className="text-amber-300">.env.local</code>.
        </p>
        <ExternalTrafficLink lat={lat} lon={lon} />
      </div>
    );
  }

  if (!isVisible) {
    return (
      <div className="flex min-h-[320px] flex-col items-center justify-center gap-4 rounded-xl border border-dashed border-zinc-700 bg-zinc-950/60 p-6 text-center">
        <MapPin className="h-10 w-10 text-amber-400/80" />
        <div>
          <p className="font-medium text-zinc-200">Traffic map ready</p>
          <p className="mt-1 max-w-sm text-sm text-zinc-400">
            Load the map only when you want to check traffic — saves API usage.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setIsVisible(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-5 py-2.5 text-sm font-semibold text-zinc-950 transition hover:bg-amber-400"
        >
          <MapPin className="h-4 w-4" />
          Show traffic map
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-end">
        <button
          type="button"
          onClick={() => setIsVisible(false)}
          className={cn(
            "text-sm text-zinc-500 transition hover:text-zinc-300",
          )}
        >
          Hide map
        </button>
      </div>
      <APIProvider apiKey={apiKey}>
        <div className="h-[360px] overflow-hidden rounded-xl">
          <TrafficMapInner lat={lat} lon={lon} />
        </div>
      </APIProvider>
    </div>
  );
}
