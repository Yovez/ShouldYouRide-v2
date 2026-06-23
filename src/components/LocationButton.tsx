"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

interface LocationButtonProps {
  className?: string;
  size?: "default" | "large";
}

export function LocationButton({ className, size = "default" }: LocationButtonProps) {
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  function handleClick() {
    if (!navigator.geolocation) {
      setStatus("error");
      setErrorMessage("Your browser does not support geolocation.");
      return;
    }

    setStatus("loading");
    setErrorMessage(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        router.push(`/ride?lat=${latitude}&lon=${longitude}`);
      },
      (error) => {
        setStatus("error");
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setErrorMessage("Location permission denied. Enable it to check your local conditions.");
            break;
          case error.POSITION_UNAVAILABLE:
            setErrorMessage("Location unavailable. Try again in a moment.");
            break;
          case error.TIMEOUT:
            setErrorMessage("Location request timed out. Try again.");
            break;
          default:
            setErrorMessage("Could not determine your location.");
        }
      },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  }

  return (
    <div className={cn("flex flex-col items-start gap-2", className)}>
      <button
        type="button"
        onClick={handleClick}
        disabled={status === "loading"}
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-xl bg-amber-500 font-semibold text-zinc-950 transition hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-70",
          size === "large" ? "px-8 py-4 text-lg" : "px-5 py-3 text-base",
        )}
      >
        {status === "loading" ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          <MapPin className="h-5 w-5" />
        )}
        {status === "loading" ? "Finding you..." : "Check my ride conditions"}
      </button>
      {errorMessage ? (
        <p className="max-w-md text-sm text-red-400">{errorMessage}</p>
      ) : null}
    </div>
  );
}
