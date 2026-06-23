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
      className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-medium text-zinc-200 transition hover:bg-white/10"
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
      <div className="flex min-h-[300px] flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-white/10 bg-black/20 p-6 text-center">
        <MapPin className="h-10 w-10 text-zinc-600" />
        <p className="max-w-md text-sm text-zinc-500">
          The live map isn&apos;t available here right now. You can still check
          traffic in Google Maps.
        </p>
        <ExternalTrafficLink lat={lat} lon={lon} />
      </div>
    );
  }

  if (!isVisible) {
    return (
      <div className="flex min-h-[300px] flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-white/10 bg-black/20 p-6 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#ff6b2c]/10 ring-1 ring-[#ff6b2c]/20">
          <MapPin className="h-7 w-7 text-[#ff8f5c]" />
        </div>
        <div>
          <p className="font-display text-lg font-bold text-white">
            Traffic map
          </p>
          <p className="mt-1 max-w-sm text-sm text-zinc-500">
            See how the roads look around you before you head out.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setIsVisible(true)}
          className="inline-flex items-center gap-2 rounded-full bg-[#ff6b2c] px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-[#ff6b2c]/20 transition hover:bg-[#ff7f47]"
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
        <div className="h-[320px] overflow-hidden rounded-2xl ring-1 ring-white/10">
          <TrafficMapInner lat={lat} lon={lon} />
        </div>
      </APIProvider>
    </div>
  );
}
