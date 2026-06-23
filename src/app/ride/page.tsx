import Link from "next/link";
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
        <main className="mx-auto flex max-w-lg flex-1 flex-col items-start justify-center gap-6 px-4 py-16">
          <h1 className="text-2xl font-bold text-zinc-100">Location needed</h1>
          <p className="text-zinc-400">
            Allow location access or share coordinates to see riding conditions.
          </p>
          <LocationButton />
          <Link href="/" className="text-sm text-amber-400 hover:underline">
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
        <main className="mx-auto flex max-w-lg flex-1 flex-col items-start justify-center gap-4 px-4 py-16">
          <h1 className="text-2xl font-bold text-zinc-100">
            Could not load weather
          </h1>
          <p className="text-zinc-400">
            The weather service is unavailable. Try again in a few minutes.
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
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-4 py-8 sm:px-6 sm:py-10">
        <RideVerdictPanel score={score} location={conditions.location} />

        <div className="grid gap-6 lg:grid-cols-2">
          <WeatherCurrentCard
            current={conditions.current}
            sunset={conditions.sunset}
          />
          <section className="rounded-2xl border border-red-900/40 bg-zinc-900/60 p-6">
            <h2 className="text-lg font-semibold text-zinc-100">
              Traffic conditions
            </h2>
            <p className="mt-1 text-sm text-zinc-400">
              Live traffic heat map — loads on demand
            </p>
            <div className="mt-4">
              <TrafficMap lat={conditions.lat} lon={conditions.lon} />
            </div>
          </section>
        </div>

        <HourlyForecastTable hourly={conditions.hourly} />
        <WindChillChart />

        <div className="pt-2">
          <Link href="/" className="text-sm text-zinc-500 hover:text-zinc-300">
            ← Back home
          </Link>
        </div>
      </main>
    </>
  );
}
