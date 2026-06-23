import {
  Cloud,
  CloudDrizzle,
  CloudFog,
  CloudRain,
  CloudSnow,
  Sun,
  Zap,
} from "lucide-react";
import type { RideScore, LocationDisplay } from "@/types/weather";
import { cn } from "@/lib/utils";

const verdictStyles: Record<
  RideScore["verdict"],
  { ring: string; bg: string; text: string; meter: string }
> = {
  excellent: {
    ring: "ring-emerald-500/40",
    bg: "from-emerald-500/20 to-emerald-900/10",
    text: "text-emerald-300",
    meter: "bg-emerald-400",
  },
  good: {
    ring: "ring-lime-500/40",
    bg: "from-lime-500/20 to-lime-900/10",
    text: "text-lime-300",
    meter: "bg-lime-400",
  },
  fair: {
    ring: "ring-amber-500/40",
    bg: "from-amber-500/20 to-amber-900/10",
    text: "text-amber-300",
    meter: "bg-amber-400",
  },
  poor: {
    ring: "ring-orange-500/40",
    bg: "from-orange-500/20 to-orange-900/10",
    text: "text-orange-300",
    meter: "bg-orange-400",
  },
  "stay-home": {
    ring: "ring-red-500/40",
    bg: "from-red-500/20 to-red-900/10",
    text: "text-red-300",
    meter: "bg-red-400",
  },
};

interface RideVerdictProps {
  score: RideScore;
  location: LocationDisplay;
}

export function RideVerdict({ score, location }: RideVerdictProps) {
  const styles = verdictStyles[score.verdict];
  const showCoordinates = location.place !== location.coordinates;

  return (
    <section
      className={cn(
        "rounded-2xl bg-gradient-to-br p-6 ring-1 sm:p-8",
        styles.bg,
        styles.ring,
      )}
    >
      <p className="text-sm font-medium tracking-wide text-zinc-400">
        {showCoordinates ? (
          <>
            <span className="text-zinc-200">{location.place}</span>
            <span className="text-zinc-500"> · {location.coordinates}</span>
          </>
        ) : (
          location.coordinates
        )}
      </p>
      <h1 className={cn("mt-2 text-3xl font-bold sm:text-4xl", styles.text)}>
        {score.headline}
      </h1>
      <p className="mt-3 max-w-2xl text-zinc-300">{score.summary}</p>

      <div className="mt-6">
        <div className="mb-2 flex items-end justify-between">
          <span className="text-sm text-zinc-400">Ride score</span>
          <span className={cn("text-3xl font-bold tabular-nums", styles.text)}>
            {score.score}
          </span>
        </div>
        <div className="h-3 overflow-hidden rounded-full bg-zinc-800">
          <div
            className={cn("h-full rounded-full transition-all", styles.meter)}
            style={{ width: `${score.score}%` }}
          />
        </div>
      </div>

      <ul className="mt-6 grid gap-3 sm:grid-cols-2">
        {score.factors.map((factor) => (
          <li
            key={factor.label}
            className="rounded-xl border border-zinc-800/80 bg-zinc-950/50 px-4 py-3"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-sm font-medium text-zinc-200">
                {factor.label}
              </span>
              <FactorBadge status={factor.status} />
            </div>
            <p className="mt-1 text-sm text-zinc-400">{factor.detail}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

function FactorBadge({ status }: { status: "good" | "caution" | "bad" }) {
  const label =
    status === "good" ? "Good" : status === "caution" ? "Caution" : "Risk";

  return (
    <span
      className={cn(
        "rounded-full px-2 py-0.5 text-xs font-semibold uppercase tracking-wide",
        status === "good" && "bg-emerald-500/15 text-emerald-300",
        status === "caution" && "bg-amber-500/15 text-amber-300",
        status === "bad" && "bg-red-500/15 text-red-300",
      )}
    >
      {label}
    </span>
  );
}

export function WeatherIcon({ code, className }: { code: number; className?: string }) {
  const props = { className: cn("h-8 w-8", className) };

  if (code === 0 || code === 1) return <Sun {...props} />;
  if (code === 2 || code === 3) return <Cloud {...props} />;
  if (code === 45 || code === 48) return <CloudFog {...props} />;
  if (code >= 71 && code <= 77) return <CloudSnow {...props} />;
  if (code >= 95) return <Zap {...props} />;
  if (code >= 51) return <CloudRain {...props} />;
  return <CloudDrizzle {...props} />;
}
