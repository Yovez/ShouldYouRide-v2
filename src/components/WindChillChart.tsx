import { calculateWindChill } from "@/lib/wind";

const SPEEDS = [25, 35, 45, 50, 55, 60, 70, 80, 90, 100, 120] as const;
const TEMPS = [30, 35, 40, 45, 50, 55, 60] as const;

export function WindChillChart() {
  return (
    <section className="rounded-2xl border border-red-900/40 bg-zinc-900/60 p-6">
      <h2 className="text-lg font-semibold text-zinc-100">Wind chill chart</h2>
      <p className="mt-1 text-sm text-zinc-400">
        Effective temperature at riding speed — useful when it&apos;s cold out
      </p>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[560px] text-left text-sm">
          <thead>
            <tr className="border-b border-zinc-800 text-xs uppercase tracking-wide text-zinc-500">
              <th className="px-3 py-2 font-medium">MPH</th>
              {TEMPS.map((temp) => (
                <th key={temp} className="px-3 py-2 font-medium">
                  {temp}°F
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {SPEEDS.map((speed) => (
              <tr
                key={speed}
                className="border-b border-zinc-800/60 text-zinc-300 last:border-0"
              >
                <td className="px-3 py-2.5 font-medium text-zinc-200">{speed}</td>
                {TEMPS.map((temp) => {
                  const chill = calculateWindChill(temp, speed);
                  return (
                    <td
                      key={`${speed}-${temp}`}
                      className="px-3 py-2.5 tabular-nums"
                    >
                      {chill}°F
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
