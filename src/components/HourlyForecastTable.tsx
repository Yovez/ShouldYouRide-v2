import type { HourlyForecast } from "@/types/weather";

interface HourlyForecastTableProps {
  hourly: HourlyForecast[];
}

export function HourlyForecastTable({ hourly }: HourlyForecastTableProps) {
  return (
    <section className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6">
      <h2 className="text-lg font-semibold text-zinc-100">Next 12 hours</h2>
      <p className="mt-1 text-sm text-zinc-400">
        Hourly forecast to plan your ride window
      </p>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr className="border-b border-zinc-800 text-xs uppercase tracking-wide text-zinc-500">
              <th className="px-3 py-2 font-medium">Time</th>
              <th className="px-3 py-2 font-medium">Temp</th>
              <th className="px-3 py-2 font-medium">Rain</th>
              <th className="px-3 py-2 font-medium">Wind</th>
              <th className="px-3 py-2 font-medium">Humidity</th>
            </tr>
          </thead>
          <tbody>
            {hourly.map((hour) => (
              <tr
                key={hour.time}
                className="border-b border-zinc-800/60 text-zinc-300 last:border-0"
              >
                <td className="px-3 py-2.5 font-medium text-zinc-200">
                  {hour.label}
                </td>
                <td className="px-3 py-2.5 tabular-nums">{hour.temperature}°F</td>
                <td className="px-3 py-2.5 tabular-nums">
                  {hour.precipitationProbability}%
                </td>
                <td className="px-3 py-2.5">
                  {hour.windSpeed} mph {hour.windDirectionCardinal}
                </td>
                <td className="px-3 py-2.5 tabular-nums">{hour.humidity}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
