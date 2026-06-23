import { calculateWindChill } from "@/lib/wind";
import { cn } from "@/lib/utils";

const SPEEDS = [25, 35, 45, 50, 55, 60, 70, 80, 90, 100, 120] as const;
const TEMPS = [30, 35, 40, 45, 50, 55, 60] as const;

function chillTone(chill: number, baseTemp: number): string {
  if (chill >= baseTemp - 2) return "text-zinc-400";
  if (chill <= 20) return "chill-cold";
  if (chill <= 32) return "chill-cool";
  if (chill <= 45) return "chill-mild";
  return "chill-warm";
}

export function WindChillChart() {
  return (
    <section className="glass-panel rounded-3xl p-6 sm:p-7">
      <h2 className="font-display text-2xl font-bold text-white">
        Wind chill chart
      </h2>
      <p className="mt-1 text-sm text-zinc-500">
        How cold it really feels at speed. I still use this on chilly mornings.
      </p>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-white/5">
        <table className="data-table w-full min-w-[560px] text-left text-sm">
          <thead>
            <tr className="border-b border-white/5 bg-black/20 text-[10px] uppercase tracking-wider text-zinc-500">
              <th className="px-4 py-3 font-semibold">MPH</th>
              {TEMPS.map((temp) => (
                <th key={temp} className="px-3 py-3 font-semibold">
                  {temp}°F
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {SPEEDS.map((speed) => (
              <tr
                key={speed}
                className="border-b border-white/5 last:border-0"
              >
                <td className="px-4 py-3 font-semibold text-zinc-300">{speed}</td>
                {TEMPS.map((temp) => {
                  const chill = calculateWindChill(temp, speed);
                  return (
                    <td
                      key={`${speed}-${temp}`}
                      className={cn(
                        "px-3 py-3 tabular-nums font-medium",
                        chillTone(chill, temp),
                      )}
                    >
                      {chill}°
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
