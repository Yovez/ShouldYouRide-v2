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
  {
    ring: string;
    glow: string;
    bg: string;
    text: string;
    meter: string;
    badge: string;
  }
> = {
  excellent: {
    ring: "ring-emerald-400/30",
    glow: "shadow-emerald-500/20",
    bg: "from-emerald-500/15 via-emerald-950/20 to-transparent",
    text: "text-emerald-300",
    meter: "stroke-emerald-400",
    badge: "bg-emerald-500/15 text-emerald-300 ring-emerald-500/25",
  },
  good: {
    ring: "ring-lime-400/30",
    glow: "shadow-lime-500/20",
    bg: "from-lime-500/15 via-lime-950/20 to-transparent",
    text: "text-lime-300",
    meter: "stroke-lime-400",
    badge: "bg-lime-500/15 text-lime-300 ring-lime-500/25",
  },
  fair: {
    ring: "ring-amber-400/30",
    glow: "shadow-amber-500/20",
    bg: "from-amber-500/15 via-amber-950/20 to-transparent",
    text: "text-amber-300",
    meter: "stroke-amber-400",
    badge: "bg-amber-500/15 text-amber-300 ring-amber-500/25",
  },
  poor: {
    ring: "ring-orange-400/30",
    glow: "shadow-orange-500/20",
    bg: "from-orange-500/15 via-orange-950/20 to-transparent",
    text: "text-orange-300",
    meter: "stroke-orange-400",
    badge: "bg-orange-500/15 text-orange-300 ring-orange-500/25",
  },
  "stay-home": {
    ring: "ring-red-400/30",
    glow: "shadow-red-500/20",
    bg: "from-red-500/15 via-red-950/20 to-transparent",
    text: "text-red-300",
    meter: "stroke-red-400",
    badge: "bg-red-500/15 text-red-300 ring-red-500/25",
  },
};

interface RideVerdictProps {
  score: RideScore;
  location: LocationDisplay;
}

function ScoreRing({
  score,
  className,
  strokeClass,
}: {
  score: number;
  className?: string;
  strokeClass: string;
}) {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <svg viewBox="0 0 128 128" className={cn("h-32 w-32 -rotate-90", className)}>
      <circle
        cx="64"
        cy="64"
        r={radius}
        fill="none"
        stroke="rgba(255,255,255,0.06)"
        strokeWidth="10"
      />
      <circle
        cx="64"
        cy="64"
        r={radius}
        fill="none"
        className={strokeClass}
        strokeWidth="10"
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        style={{ transition: "stroke-dashoffset 0.6s ease" }}
      />
    </svg>
  );
}

export function RideVerdict({ score, location }: RideVerdictProps) {
  const styles = verdictStyles[score.verdict];
  const showCoordinates = location.place !== location.coordinates;

  return (
    <section
      className={cn(
        "glass-panel-strong relative overflow-hidden rounded-3xl p-6 ring-1 sm:p-8 lg:p-10",
        "bg-gradient-to-br shadow-2xl",
        styles.bg,
        styles.ring,
        styles.glow,
      )}
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

      <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex-1">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/20 px-3 py-1.5 text-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-[#ff6b2c]" />
            {showCoordinates ? (
              <>
                <span className="font-medium text-zinc-200">{location.place}</span>
                <span className="text-zinc-600">·</span>
                <span className="font-mono text-xs text-zinc-500">
                  {location.coordinates}
                </span>
              </>
            ) : (
              <span className="font-mono text-xs text-zinc-400">
                {location.coordinates}
              </span>
            )}
          </div>

          <h1
            className={cn(
              "font-display mt-5 text-3xl font-extrabold leading-tight sm:text-4xl lg:text-5xl",
              styles.text,
            )}
          >
            {score.headline}
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-zinc-300">
            {score.summary}
          </p>
        </div>

        <div className="relative flex shrink-0 flex-col items-center self-center lg:self-start">
          <div className="relative">
            <ScoreRing score={score.score} strokeClass={styles.meter} />
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={cn("font-display text-4xl font-extrabold tabular-nums", styles.text)}>
                {score.score}
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-500">
                Score
              </span>
            </div>
          </div>
        </div>
      </div>

      <ul className="mt-8 grid gap-3 sm:grid-cols-2">
        {score.factors.map((factor) => (
          <li
            key={factor.label}
            className="rounded-2xl border border-white/5 bg-black/20 px-4 py-3.5 backdrop-blur-sm"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-sm font-semibold text-zinc-200">
                {factor.label}
              </span>
              <FactorBadge status={factor.status} />
            </div>
            <p className="mt-1.5 text-sm leading-relaxed text-zinc-400">
              {factor.detail}
            </p>
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
        "rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ring-1",
        status === "good" && "bg-emerald-500/15 text-emerald-300 ring-emerald-500/25",
        status === "caution" && "bg-amber-500/15 text-amber-300 ring-amber-500/25",
        status === "bad" && "bg-red-500/15 text-red-300 ring-red-500/25",
      )}
    >
      {label}
    </span>
  );
}

export function WeatherIcon({
  code,
  className,
}: {
  code: number;
  className?: string;
}) {
  const props = { className: cn("h-8 w-8", className) };

  if (code === 0 || code === 1) return <Sun {...props} />;
  if (code === 2 || code === 3) return <Cloud {...props} />;
  if (code === 45 || code === 48) return <CloudFog {...props} />;
  if (code >= 71 && code <= 77) return <CloudSnow {...props} />;
  if (code >= 95) return <Zap {...props} />;
  if (code >= 51) return <CloudRain {...props} />;
  return <CloudDrizzle {...props} />;
}
