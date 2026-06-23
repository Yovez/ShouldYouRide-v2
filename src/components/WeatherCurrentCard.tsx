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
    <section className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6">
      <h2 className="text-lg font-semibold text-zinc-100">Current conditions</h2>

      <div className="mt-4 flex items-start gap-4">
        <WeatherIcon code={current.weatherCode} className="h-12 w-12 text-amber-300" />
        <div>
          <p className="text-xl capitalize text-zinc-200">
            {current.weatherDescription}
          </p>
          <p className={cn("mt-1 text-4xl font-bold tabular-nums", tempTone(current.temperature))}>
            {current.temperature}°F
          </p>
          <p className="text-sm text-zinc-400">
            Feels like {current.feelsLike}°F
          </p>
        </div>
      </div>

      <dl className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
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
    <div className="rounded-xl border border-zinc-800/80 bg-zinc-950/40 px-3 py-3">
      <dt className="flex items-center gap-1.5 text-xs uppercase tracking-wide text-zinc-500">
        {icon}
        {label}
      </dt>
      <dd className="mt-1 text-sm font-medium text-zinc-200">{value}</dd>
    </div>
  );
}
