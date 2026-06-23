import {
  Droplets,
  Sunset,
  Thermometer,
  Wind,
} from "lucide-react";
import type { WeatherCurrent } from "@/types/weather";
import { WeatherIcon } from "@/components/RideVerdict";
import { cn } from "@/lib/utils";

function tempTone(temp: number): string {
  if (temp <= 36) return "text-sky-300";
  if (temp <= 50) return "text-cyan-300";
  if (temp <= 60) return "text-blue-200";
  if (temp <= 80) return "text-emerald-300";
  if (temp <= 95) return "text-amber-300";
  return "text-red-300";
}

interface WeatherCurrentCardProps {
  current: WeatherCurrent;
  sunset: string;
}

export function WeatherCurrentCard({ current, sunset }: WeatherCurrentCardProps) {
  return (
    <section className="glass-panel h-full rounded-3xl p-6 sm:p-7">
      <p className="text-sm text-zinc-500">Out there right now</p>
      <h2 className="font-display mt-1 text-2xl font-bold text-white">
        Current weather
      </h2>

      <div className="mt-6 flex items-start gap-5">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[#ff6b2c]/10 ring-1 ring-[#ff6b2c]/20">
          <WeatherIcon code={current.weatherCode} className="h-9 w-9 text-[#ff8f5c]" />
        </div>
        <div>
          <p className="text-lg capitalize text-zinc-300">
            {current.weatherDescription}
          </p>
          <p
            className={cn(
              "font-display mt-1 text-5xl font-extrabold tabular-nums tracking-tight",
              tempTone(current.temperature),
            )}
          >
            {current.temperature}°
            <span className="text-2xl font-bold text-zinc-500">F</span>
          </p>
          <p className="mt-1 text-sm text-zinc-500">
            Feels like {current.feelsLike}°F
          </p>
        </div>
      </div>

      <dl className="mt-8 grid grid-cols-2 gap-3">
        <Stat
          icon={<Droplets className="h-4 w-4" />}
          label="Humidity"
          value={`${current.humidity}%`}
        />
        <Stat
          icon={<Wind className="h-4 w-4" />}
          label="Wind"
          value={`${current.windSpeed} mph ${current.windDirectionCardinal}`}
        />
        <Stat
          icon={<Thermometer className="h-4 w-4" />}
          label="Precipitation"
          value={current.precipitation > 0 ? `${current.precipitation}"` : "None"}
        />
        <Stat
          icon={<Sunset className="h-4 w-4" />}
          label="Sunset"
          value={sunset}
        />
      </dl>
    </section>
  );
}

function Stat({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-white/5 bg-black/20 px-4 py-3.5">
      <dt className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
        {icon}
        {label}
      </dt>
      <dd className="mt-1.5 text-sm font-semibold text-zinc-200">{value}</dd>
    </div>
  );
}
