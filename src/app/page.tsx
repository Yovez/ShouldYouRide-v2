import type { Metadata } from "next";
import { SiteHeader } from "@/components/SiteHeader";
import { LocationButton } from "@/components/LocationButton";
import { WindChillChart } from "@/components/WindChillChart";

export const metadata: Metadata = {
  title: "Should You Ride? | Motorcycle weather & traffic",
  description:
    "Check weather, traffic, and riding conditions in one place before you take the bike out.",
};

export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <div className="relative overflow-hidden">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(245,158,11,0.12),_transparent_55%)]" />
          <div className="relative mx-auto max-w-4xl px-4 py-16 sm:px-6 sm:py-24">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-400">
              Motorcycle weather dashboard
            </p>
            <h1 className="mt-4 text-5xl font-bold tracking-tight text-zinc-50 sm:text-6xl">
              Should you ride today?
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-zinc-400">
              One tap to see weather, hourly forecast, wind chill, traffic, and a
              ride score built for two wheels.
            </p>

            <div className="mt-10">
              <LocationButton size="large" />
            </div>

            <div className="mt-16 grid gap-4 sm:grid-cols-3">
              <FeatureCard
                title="Weather"
                description="Current temp, rain chance, wind, humidity, and sunset for your location."
              />
              <FeatureCard
                title="12-hour outlook"
                description="Plan around the next half-day of conditions before you gear up."
              />
              <FeatureCard
                title="Traffic map"
                description="Live traffic overlay when you add a free Google Maps key."
              />
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
          <WindChillChart />
        </div>
      </main>
    </>
  );
}

function FeatureCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5">
      <h2 className="font-semibold text-zinc-100">{title}</h2>
      <p className="mt-2 text-sm leading-relaxed text-zinc-400">{description}</p>
    </div>
  );
}
