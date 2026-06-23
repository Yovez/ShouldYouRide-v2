import type { HourlyForecast } from "@/types/weather";
import { cn } from "@/lib/utils";

interface HourlyForecastTableProps {
  hourly: HourlyForecast[];
}

export function HourlyForecastTable({ hourly }: HourlyForecastTableProps) {
  return (
    <section className="glass-panel rounded-3xl p-6 sm:p-7">
      <h2 className="font-display text-2xl font-bold text-white">
        Next 12 hours
      </h2>
      <p className="mt-1 text-sm text-zinc-500">
        The first card is right now.
      </p>

      <div className="mt-6 -mx-2 overflow-x-auto px-2 pb-2">
        <div className="flex min-w-max gap-3">
          {hourly.map((hour, index) => (
            <HourlyCard key={hour.time} hour={hour} isNow={index === 0} />
          ))}
        </div>
      </div>
    </section>
  );
}

function HourlyCard({ hour, isNow }: { hour: HourlyForecast; isNow: boolean }) {
  const rainHigh = hour.precipitationProbability >= 50;

  return (
    <article
      className={cn(
        "flex w-[7.5rem] shrink-0 flex-col rounded-2xl border px-4 py-4 text-center",
        isNow
          ? "border-[#ff6b2c]/30 bg-[#ff6b2c]/10 ring-1 ring-[#ff6b2c]/20"
          : "border-white/5 bg-black/20",
      )}
    >
      <p
        className={cn(
          "text-xs font-semibold uppercase tracking-wider",
          isNow ? "text-[#ff8f5c]" : "text-zinc-500",
        )}
      >
        {isNow ? "Now" : hour.label}
      </p>
      <p className="font-display mt-3 text-2xl font-bold tabular-nums text-white">
        {hour.temperature}°
      </p>
      <p
        className={cn(
          "mt-2 text-xs font-medium tabular-nums",
          rainHigh ? "text-sky-300" : "text-zinc-500",
        )}
      >
        {hour.precipitationProbability}% rain
      </p>
      <p className="mt-1 text-[11px] text-zinc-600">
        {hour.windSpeed} mph {hour.windDirectionCardinal}
      </p>
    </article>
  );
}
