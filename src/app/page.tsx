import type { Metadata } from "next";
import { Clock3, CloudSun, MapPinned } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { LocationButton } from "@/components/LocationButton";
import { WindChillChart } from "@/components/WindChillChart";

export const metadata: Metadata = {
  title: "Should You Ride? | Motorcycle weather & traffic",
  description:
    "Weather, traffic, and a straight answer on whether today's a good day to ride.",
};

const FEATURES = [
  {
    icon: CloudSun,
    title: "Weather right now",
    description:
      "Temp, rain chance, wind, humidity, sunset. The stuff you actually check before grabbing your keys.",
  },
  {
    icon: Clock3,
    title: "Next 12 hours",
    description:
      "Hour by hour, so you can leave earlier or wait out that afternoon storm instead of finding out on the road.",
  },
  {
    icon: MapPinned,
    title: "Traffic map",
    description:
      "Tap to pull up a live traffic map when you want to check your route.",
  },
] as const;

export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <section className="relative overflow-hidden">
          <div className="pointer-events-none absolute -right-24 top-10 h-72 w-72 rounded-full bg-[#ff6b2c]/10 blur-3xl" />
          <div className="pointer-events-none absolute -left-16 bottom-0 h-56 w-56 rounded-full bg-blue-500/5 blur-3xl" />

          <div className="relative mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:py-24">
            <div>
              <p className="text-sm text-zinc-500">
                I got tired of checking four apps every morning.
              </p>
              <h1 className="font-display mt-4 text-5xl font-extrabold leading-[0.95] tracking-tight text-white sm:text-6xl lg:text-7xl">
                Should you
                <span className="block bg-gradient-to-r from-[#ff6b2c] via-[#ffb347] to-[#ff6b2c] bg-clip-text text-transparent">
                  ride today?
                </span>
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-zinc-400">
                This pulls weather, wind, rain, and traffic into one page and
                gives you an honest score. Not a forecast app. A &ldquo;should I
                take the bike or the car&rdquo; app.
              </p>
              <div className="mt-10">
                <LocationButton size="large" />
              </div>
            </div>

            <div className="glass-panel-strong relative overflow-hidden rounded-3xl p-8">
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#ff6b2c]/50 to-transparent" />
              <p className="font-display text-xl font-bold text-white">
                Stupid question. Usually yes.
              </p>
              <p className="mt-3 text-sm leading-relaxed text-zinc-400">
                That was the joke on the original version of this site, and
                it&apos;s still mostly true. But rain at the wrong hour, a nasty
                crosswind, or 38° with a 30 mph headwind? Worth knowing before
                you&apos;re already geared up in the driveway.
              </p>
              <div className="mt-6 rounded-2xl border border-white/5 bg-black/20 p-4 text-sm text-zinc-500">
                Uses your location. No account, no ads, no newsletter signup.
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 pb-12 sm:px-8">
          <div className="grid gap-4 md:grid-cols-3">
            {FEATURES.map(({ icon: Icon, title, description }) => (
              <article
                key={title}
                className="glass-panel group rounded-3xl p-6 transition hover:border-white/12 hover:bg-white/[0.04]"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#ff6b2c]/15 text-[#ff6b2c] ring-1 ring-[#ff6b2c]/20 transition group-hover:bg-[#ff6b2c]/25">
                  <Icon className="h-5 w-5" />
                </div>
                <h2 className="font-display mt-5 text-xl font-bold text-white">
                  {title}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                  {description}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-8">
          <WindChillChart />
        </section>
      </main>
    </>
  );
}
