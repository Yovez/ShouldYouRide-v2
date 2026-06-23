"use client";

import { useState } from "react";
import { RideVerdict } from "@/components/RideVerdict";
import {
  createPreviewRideScore,
  DEV_SCORE_PRESETS,
} from "@/lib/ride-score-preview";
import type { RideScore, LocationDisplay } from "@/types/weather";
import { cn } from "@/lib/utils";

interface RideVerdictPanelProps {
  score: RideScore;
  location: LocationDisplay;
}

export function RideVerdictPanel({ score, location }: RideVerdictPanelProps) {
  const [previewScore, setPreviewScore] = useState<number | null>(null);
  const isDev = process.env.NODE_ENV === "development";

  const displayScore =
    previewScore !== null ? createPreviewRideScore(previewScore) : score;

  return (
    <div className="space-y-3">
      {isDev ? (
        <div className="rounded-2xl border border-dashed border-violet-400/30 bg-violet-500/5 px-4 py-3 backdrop-blur-sm">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-violet-300">
            Dev only — fake scores
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {DEV_SCORE_PRESETS.map((preset) => {
              const isActive =
                preset.value === null
                  ? previewScore === null
                  : previewScore === preset.value;

              return (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => setPreviewScore(preset.value)}
                  className={cn(
                    "rounded-full px-3.5 py-1.5 text-sm font-medium transition",
                    isActive
                      ? "bg-violet-500 text-white shadow-lg shadow-violet-500/25"
                      : "border border-white/5 bg-black/20 text-zinc-400 hover:text-white",
                  )}
                >
                  {preset.label}
                </button>
              );
            })}
          </div>
        </div>
      ) : null}

      <RideVerdict score={displayScore} location={location} />
    </div>
  );
}
