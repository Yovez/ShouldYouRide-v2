import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { RideVerdictPanel } from "@/components/RideVerdictPanel";
import { WeatherCurrentCard } from "@/components/WeatherCurrentCard";
import { HourlyForecastTable } from "@/components/HourlyForecastTable";
import { WindChillChart } from "@/components/WindChillChart";
import { TrafficMap } from "@/components/TrafficMap";
import { LocationButton } from "@/components/LocationButton";
import { calculateRideScore } from "@/lib/ride-score";
import { fetchRideConditions } from "@/lib/weather";

interface RidePageProps {
  searchParams: Promise<{ lat?: string; lon?: string }>;
}

export default async function RidePage({ searchParams }: RidePageProps) {
  const params = await searchParams;
  const lat = Number(params.lat);
  const lon = Number(params.lon);

  if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
    return (
      <>
        <SiteHeader />
        <main className="mx-auto flex max-w-lg flex-1 flex-col items-start justify-center gap-6 px-4 py-20 sm:px-8">
          <p className="text-sm text-zinc-500">Need your location</p>
          <h1 className="font-display text-3xl font-bold text-white">
            Where are you?
          </h1>
          <p className="text-zinc-400">
            I need your location to pull weather for your area. Hit the button
            below and allow it when your browser asks.
          </p>
          <LocationButton />
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-zinc-500 transition hover:text-zinc-300"
          >
            <ArrowLeft className="h-4 w-4" />
            Back home
          </Link>
        </main>
      </>
    );
  }

  let conditions;
  try {
    conditions = await fetchRideConditions(lat, lon);
  } catch {
    return (
      <>
        <SiteHeader />
        <main className="mx-auto flex max-w-lg flex-1 flex-col items-start justify-center gap-4 px-4 py-20 sm:px-8">
          <p className="text-sm text-zinc-500">That didn&apos;t work</p>
          <h1 className="font-display text-3xl font-bold text-white">
            Couldn&apos;t load weather
          </h1>
          <p className="text-zinc-400">
            The weather service is down or timing out. Give it another shot in a
            few minutes.
          </p>
          <LocationButton />
        </main>
      </>
    );
  }

  const score = calculateRideScore(conditions);

  return (
    <>
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-8 px-4 py-8 sm:px-8 sm:py-10">
        <div className="flex items-center justify-between gap-4">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 rounded-full border border-white/5 bg-white/[0.03] px-4 py-2 text-sm text-zinc-400 transition hover:border-white/10 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Home
          </Link>
        </div>

        <RideVerdictPanel score={score} location={conditions.location} />

        <div className="grid gap-6 lg:grid-cols-2">
          <WeatherCurrentCard
            current={conditions.current}
            sunset={conditions.sunset}
          />
          <section className="glass-panel flex h-full flex-col rounded-3xl p-6 sm:p-7">
            <h2 className="font-display text-2xl font-bold text-white">
              Traffic
            </h2>
            <p className="mt-1 text-sm text-zinc-500">
              Tap below when you want to see how the roads look near you.
            </p>
            <div className="mt-5 flex-1">
              <TrafficMap lat={conditions.lat} lon={conditions.lon} />
            </div>
          </section>
        </div>

        <HourlyForecastTable hourly={conditions.hourly} />
        <WindChillChart />
      </main>
    </>
  );
}
