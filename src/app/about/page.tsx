import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Bike,
  CloudRain,
  Gauge,
  History,
  MapPin,
  Shield,
  Wind,
} from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { LocationButton } from "@/components/LocationButton";

export const metadata: Metadata = {
  title: "About",
  description:
    "Why I built ShouldYouRide, a small weather app for motorcycle riders.",
};

const USE_CASES = [
  {
    icon: CloudRain,
    title: "The morning check",
    description:
      "Coffee in hand, wondering if today is a bike day or a car day. That's literally what this is for.",
  },
  {
    icon: Wind,
    title: "Cold or windy days",
    description:
      "Thermometer says 45° but you're doing 70 on the highway. The wind chill chart is there for exactly that.",
  },
  {
    icon: Gauge,
    title: "Timing the ride",
    description:
      "Looks fine now, but rain at 3pm? The hourly view helps you leave at 11 instead of getting soaked.",
  },
  {
    icon: MapPin,
    title: "Traffic sanity check",
    description:
      "Sometimes the weather is perfect and the interstate is a parking lot. Peek at traffic before you commit.",
  },
] as const;

const TIMELINE = [
  {
    year: "Years ago",
    title: "Started as a learning project",
    description:
      "I was teaching myself web dev and wanted something real to build. I ride whenever I can, and I kept opening three different apps before every ride. So I made one page that had the stuff I actually cared about.",
  },
  {
    year: "v1",
    title: "Node, Express, Pug",
    description:
      "The first version lived on GitHub for a long time. Weather, 12-hour forecast, a traffic map, wind chill table. Clunky by today's standards, but it worked, and I used it.",
  },
  {
    year: "Now",
    title: "Rewrote the whole thing",
    description:
      "This is v2. Same idea, rebuilt cleaner, with a ride score and a traffic map you open when you need it.",
  },
] as const;

export default function AboutPage() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <section className="relative overflow-hidden border-b border-white/5">
          <div className="pointer-events-none absolute -right-20 top-0 h-64 w-64 rounded-full bg-[#ff6b2c]/10 blur-3xl" />
          <div className="relative mx-auto max-w-3xl px-4 py-16 sm:px-8 sm:py-20">
            <p className="text-sm text-zinc-500">About this site</p>
            <h1 className="font-display mt-4 text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
              I ride. I also write code. This is both.
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-zinc-400">
              ShouldYouRide isn&apos;t a startup pitch. It&apos;s a tool I
              wanted for myself, then kept improving because other riders kept
              asking about it.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-3xl px-4 py-14 sm:px-8">
          <div className="glass-panel rounded-3xl p-8">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#ff6b2c]/15 text-[#ff6b2c] ring-1 ring-[#ff6b2c]/20">
                <Bike className="h-6 w-6" />
              </div>
              <div>
                <h2 className="font-display text-2xl font-bold text-white">
                  Why I made it
                </h2>
                <div className="mt-4 space-y-4 leading-relaxed text-zinc-400">
                  <p>
                    On a car, bad weather is annoying. On a bike, it changes
                    whether you stay upright, whether your hands go numb, whether
                    you enjoy the ride at all.
                  </p>
                  <p>
                    I don&apos;t need a 10-day forecast with pollen counts. I
                    need to know: is it going to rain in the next few hours, how
                    hard is the wind blowing, and is it cold enough that I&apos;ll
                    regret leaving in just a hoodie.
                  </p>
                  <p>
                    So I built a single page that answers that. The ride score is
                    my best guess at weighting the factors that actually matter
                    on two wheels. It&apos;s not gospel. Use your own judgment.
                    But it beats doing the math in your head while half asleep.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-4 py-4 sm:px-8">
          <h2 className="font-display text-2xl font-bold text-white">
            When I open it
          </h2>
          <p className="mt-2 text-sm text-zinc-500">
            A few real situations, not marketing bullets.
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {USE_CASES.map(({ icon: Icon, title, description }) => (
              <article key={title} className="glass-panel rounded-3xl p-6">
                <Icon className="h-5 w-5 text-[#ff8f5c]" />
                <h3 className="font-display mt-4 text-lg font-bold text-white">
                  {title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                  {description}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-3xl px-4 py-14 sm:px-8">
          <h2 className="font-display text-2xl font-bold text-white">
            What&apos;s on the ride page
          </h2>
          <div className="mt-6 space-y-4">
            <HelpCard
              icon={<Shield className="h-5 w-5" />}
              title="Ride score"
              description="0 to 100, based on temp, rain, wind, and feels-like. Sunny doesn't always mean good. I've had 75° days score badly because of gusting wind."
            />
            <HelpCard
              icon={<History className="h-5 w-5" />}
              title="Hourly forecast"
              description="The next 12 hours in a row you can actually scan. Helpful when the morning looks fine and the afternoon doesn't."
            />
            <HelpCard
              icon={<Wind className="h-5 w-5" />}
              title="Wind chill chart"
              description="Copied from v1 because people kept asking for it. Shows what speed does to cold air when you're not behind a windshield."
            />
          </div>
        </section>

        <section className="mx-auto max-w-3xl px-4 py-4 sm:px-8">
          <h2 className="font-display text-2xl font-bold text-white">
            How it got here
          </h2>
          <div className="mt-6 space-y-6">
            {TIMELINE.map((item) => (
              <article
                key={item.year}
                className="relative border-l border-white/10 pl-6"
              >
                <span className="absolute -left-1.5 top-1.5 h-3 w-3 rounded-full bg-[#ff6b2c] ring-4 ring-[#080a0f]" />
                <p className="text-xs font-semibold text-[#ff8f5c]">
                  {item.year}
                </p>
                <h3 className="font-display mt-1 text-xl font-bold text-white">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                  {item.description}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-3xl px-4 py-16 sm:px-8">
          <div className="glass-panel-strong rounded-3xl p-8 text-center">
            <h2 className="font-display text-2xl font-bold text-white">
              See what it looks like near you
            </h2>
            <p className="mx-auto mt-3 max-w-md text-sm text-zinc-400">
              Tap below and allow location. Takes a few seconds.
            </p>
            <div className="mt-6 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <LocationButton />
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 text-sm text-zinc-500 transition hover:text-zinc-300"
              >
                Back home
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

function HelpCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="glass-panel flex gap-4 rounded-2xl p-5">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/5 text-[#ff8f5c]">
        {icon}
      </div>
      <div>
        <h3 className="font-display font-bold text-white">{title}</h3>
        <p className="mt-1 text-sm leading-relaxed text-zinc-400">{description}</p>
      </div>
    </div>
  );
}
