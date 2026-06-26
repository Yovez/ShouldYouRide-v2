"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { APIProvider } from "@vis.gl/react-google-maps";
import {
  ArrowLeft,
  Copy,
  ExternalLink,
  Loader2,
  MapPin,
  RefreshCw,
  Route,
} from "lucide-react";
import { RouteMap } from "@/components/RouteMap";
import { cn } from "@/lib/utils";
import {
  directionsToMapsUrl,
  fetchGoogleDirections,
  planRandomRoute,
  summarizeDirections,
} from "@/lib/random-route";
import type {
  DistanceMode,
  LatLng,
  RoutePreferences,
  RouteResult,
  RouteShape,
} from "@/types/route";

interface RandomRoutePlannerProps {
  initialLocation?: LatLng;
}

const MILE_PRESETS = [15, 30, 50, 75, 100] as const;
const TIME_PRESETS = [30, 60, 90, 120] as const;

export function RandomRoutePlanner({ initialLocation }: RandomRoutePlannerProps) {
  const [location, setLocation] = useState<LatLng | null>(initialLocation ?? null);
  const [locating, setLocating] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  const [distanceMode, setDistanceMode] = useState<DistanceMode>("miles");
  const [distanceMiles, setDistanceMiles] = useState(30);
  const [durationMinutes, setDurationMinutes] = useState(60);
  const [shape, setShape] = useState<RouteShape>("loop");
  const [scenicStopCount, setScenicStopCount] = useState(2);
  const [avoidHighways, setAvoidHighways] = useState(true);
  const [customStops, setCustomStops] = useState(["", ""]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<RouteResult | null>(null);
  const [copied, setCopied] = useState(false);

  const hasMapsKey = Boolean(process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY);
  const mapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "";

  const preferences = useMemo<RoutePreferences>(
    () => ({
      distanceMode,
      distanceMiles,
      durationMinutes,
      shape,
      scenicStopCount,
      customStops: customStops.filter((stop) => stop.trim().length > 0),
      avoidHighways,
    }),
    [
      distanceMode,
      distanceMiles,
      durationMinutes,
      shape,
      scenicStopCount,
      customStops,
      avoidHighways,
    ],
  );

  function requestLocation() {
    if (!navigator.geolocation) {
      setLocationError("Your browser doesn't support location.");
      return;
    }

    setLocating(true);
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setLocating(false);
      },
      () => {
        setLocationError("Couldn't get your location. Allow it and try again.");
        setLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  }

  async function generateRoute() {
    if (!location) {
      setError("Set your starting point first.");
      return;
    }

    if (!hasMapsKey) {
      setError("Route planning needs Google Maps to be enabled on this site.");
      return;
    }

    if (typeof google === "undefined") {
      setError("Google Maps is still loading. Try again in a second.");
      return;
    }

    setLoading(true);
    setError(null);
    setCopied(false);

    try {
      const plan = await planRandomRoute(location, preferences);
      const directions = await fetchGoogleDirections(plan, avoidHighways);
      const summary = summarizeDirections(directions);
      const googleMapsUrl = directionsToMapsUrl(plan, directions);

      setResult({
        plan: { ...plan, googleMapsUrl },
        distanceMiles: summary.distanceMiles,
        durationMinutes: summary.durationMinutes,
        directions,
      });
    } catch {
      setError(
        "Couldn't build a route from here. Try fewer stops, a shorter distance, or hit shuffle again.",
      );
      setResult(null);
    } finally {
      setLoading(false);
    }
  }

  async function copyLink() {
    if (!result?.plan.googleMapsUrl) return;

    try {
      await navigator.clipboard.writeText(result.plan.googleMapsUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  function updateCustomStop(index: number, value: string) {
    setCustomStops((current) =>
      current.map((stop, stopIndex) => (stopIndex === index ? value : stop)),
    );
  }

  function addCustomStopField() {
    setCustomStops((current) =>
      current.length < 4 ? [...current, ""] : current,
    );
  }

  const planner = (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,380px)_1fr]">
      <aside className="glass-panel h-fit rounded-3xl p-6 sm:p-7">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#ff6b2c]/15 text-[#ff6b2c]">
            <Route className="h-5 w-5" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold text-white">
              Random route
            </h1>
            <p className="text-sm text-zinc-500">
              Pick your prefs, get a ride suggestion.
            </p>
          </div>
        </div>

        <div className="mt-6 space-y-6">
          <Field label="Starting point">
            {location ? (
              <p className="rounded-xl border border-white/5 bg-black/20 px-3 py-2 text-sm text-zinc-300">
                {location.lat.toFixed(4)}°, {location.lng.toFixed(4)}°
              </p>
            ) : (
              <p className="text-sm text-zinc-500">No location yet.</p>
            )}
            <button
              type="button"
              onClick={requestLocation}
              disabled={locating}
              className="mt-2 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-zinc-200 transition hover:bg-white/10 disabled:opacity-60"
            >
              {locating ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <MapPin className="h-4 w-4" />
              )}
              Use my location
            </button>
            {locationError ? (
              <p className="mt-2 text-sm text-red-300">{locationError}</p>
            ) : null}
          </Field>

          <Field label="How long do you want to ride?">
            <div className="flex gap-2">
              <ModeButton
                active={distanceMode === "miles"}
                onClick={() => setDistanceMode("miles")}
              >
                Miles
              </ModeButton>
              <ModeButton
                active={distanceMode === "time"}
                onClick={() => setDistanceMode("time")}
              >
                Time
              </ModeButton>
            </div>
            {distanceMode === "miles" ? (
              <div className="mt-3 flex flex-wrap gap-2">
                {MILE_PRESETS.map((miles) => (
                  <PresetButton
                    key={miles}
                    active={distanceMiles === miles}
                    onClick={() => setDistanceMiles(miles)}
                  >
                    {miles} mi
                  </PresetButton>
                ))}
              </div>
            ) : (
              <div className="mt-3 flex flex-wrap gap-2">
                {TIME_PRESETS.map((minutes) => (
                  <PresetButton
                    key={minutes}
                    active={durationMinutes === minutes}
                    onClick={() => setDurationMinutes(minutes)}
                  >
                    {minutes >= 60 ? `${minutes / 60} hr` : `${minutes} min`}
                  </PresetButton>
                ))}
              </div>
            )}
          </Field>

          <Field label="Route shape">
            <div className="flex gap-2">
              <ModeButton active={shape === "loop"} onClick={() => setShape("loop")}>
                Loop back home
              </ModeButton>
              <ModeButton
                active={shape === "one-way"}
                onClick={() => setShape("one-way")}
              >
                One way
              </ModeButton>
            </div>
          </Field>

          <Field label="Scenic detours">
            <input
              type="range"
              min={0}
              max={4}
              value={scenicStopCount}
              onChange={(event) => setScenicStopCount(Number(event.target.value))}
              className="w-full accent-[#ff6b2c]"
            />
            <p className="mt-1 text-sm text-zinc-500">
              {shape === "loop" && scenicStopCount === 0
                ? "Loops always use at least 3 stops around you so it's a real round trip, not out-and-back."
                : scenicStopCount === 0
                  ? "No extra detours on a one-way ride."
                  : `${scenicStopCount} extra stop${scenicStopCount === 1 ? "" : "s"} along the way.`}
            </p>
          </Field>

          <Field label="Stops you want to hit">
            <p className="mb-2 text-xs text-zinc-500">
              Town names or places, e.g. &ldquo;Greenville, NC&rdquo; or &ldquo;Main St Diner&rdquo;
            </p>
            <div className="space-y-2">
              {customStops.map((stop, index) => (
                <input
                  key={`stop-${index}`}
                  type="text"
                  value={stop}
                  onChange={(event) => updateCustomStop(index, event.target.value)}
                  placeholder={index === 0 ? "Optional stop" : "Another stop"}
                  className="w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm text-zinc-200 placeholder:text-zinc-600 outline-none focus:border-[#ff6b2c]/40"
                />
              ))}
            </div>
            {customStops.length < 4 ? (
              <button
                type="button"
                onClick={addCustomStopField}
                className="mt-2 text-sm text-[#ff8f5c] hover:underline"
              >
                + Add another stop
              </button>
            ) : null}
          </Field>

          <label className="flex cursor-pointer items-start gap-3 text-sm text-zinc-300">
            <input
              type="checkbox"
              checked={avoidHighways}
              onChange={(event) => setAvoidHighways(event.target.checked)}
              className="mt-1 accent-[#ff6b2c]"
            />
            <span>
              Prefer back roads over highways when Google can find them.
            </span>
          </label>

          <button
            type="button"
            onClick={generateRoute}
            disabled={loading || !location}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-[#ff6b2c] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-[#ff6b2c]/20 transition hover:bg-[#ff7f47] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
            {loading ? "Planning route..." : result ? "Shuffle another route" : "Suggest a route"}
          </button>

          {error ? (
            <p className="rounded-xl border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-300">
              {error}
            </p>
          ) : null}
        </div>
      </aside>

      <section className="space-y-4">
        {result ? (
          <>
            <div className="glass-panel rounded-3xl p-5 sm:p-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-sm text-zinc-500">Your route</p>
                  <p className="font-display mt-1 text-2xl font-bold text-white">
                    ~{result.distanceMiles} mi · ~{result.durationMinutes} min
                  </p>
                  <p className="mt-1 text-sm text-zinc-400">
                    {result.plan.isLoop
                      ? "Loop back to where you started."
                      : "One-way ride from your location."}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <a
                    href={result.plan.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full bg-[#ff6b2c] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#ff7f47]"
                  >
                    Open in Google Maps
                    <ExternalLink className="h-4 w-4" />
                  </a>
                  <button
                    type="button"
                    onClick={copyLink}
                    className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-zinc-200 transition hover:bg-white/10"
                  >
                    <Copy className="h-4 w-4" />
                    {copied ? "Copied" : "Copy link"}
                  </button>
                </div>
              </div>

              {result.plan.waypointLabels.length > 0 ? (
                <ul className="mt-4 flex flex-wrap gap-2">
                  {result.plan.waypointLabels.map((label) => (
                    <li
                      key={label}
                      className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-xs text-zinc-300"
                    >
                      {label}
                    </li>
                  ))}
                </ul>
              ) : null}

              <p className="mt-4 text-xs text-zinc-500">
                Open the link on your phone to send directions to the Google Maps app.
              </p>
            </div>

            <RouteMap center={location!} directions={result.directions} />
          </>
        ) : (
          <div className="glass-panel flex min-h-[420px] flex-col items-center justify-center rounded-3xl p-8 text-center">
            <Route className="h-12 w-12 text-zinc-600" />
            <p className="font-display mt-4 text-xl font-bold text-white">
              No route yet
            </p>
            <p className="mt-2 max-w-sm text-sm text-zinc-500">
              Set your location, pick how far you want to ride, and hit suggest.
              You can shuffle until you get something that looks fun.
            </p>
          </div>
        )}

        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-zinc-500 transition hover:text-zinc-300"
        >
          <ArrowLeft className="h-4 w-4" />
          Back home
        </Link>
      </section>
    </div>
  );

  if (!hasMapsKey) {
    return planner;
  }

  return <APIProvider apiKey={mapsApiKey}>{planner}</APIProvider>;
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="text-sm font-medium text-zinc-200">{label}</p>
      <div className="mt-2">{children}</div>
    </div>
  );
}

function ModeButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex-1 rounded-xl border px-3 py-2 text-sm font-medium transition",
        active
          ? "border-[#ff6b2c]/40 bg-[#ff6b2c]/15 text-[#ff8f5c]"
          : "border-white/10 bg-black/20 text-zinc-400 hover:text-zinc-200",
      )}
    >
      {children}
    </button>
  );
}

function PresetButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full px-3 py-1.5 text-sm transition",
        active
          ? "bg-[#ff6b2c] text-white"
          : "border border-white/10 bg-black/20 text-zinc-400 hover:text-zinc-200",
      )}
    >
      {children}
    </button>
  );
}
