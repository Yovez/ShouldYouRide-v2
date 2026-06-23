"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowRight, Loader2, MapPin } from "lucide-react";
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
            setErrorMessage("Location's blocked. You'll need to allow it in your browser settings.");
            break;
          case error.POSITION_UNAVAILABLE:
            setErrorMessage("Couldn't get a location fix. Try again.");
            break;
          case error.TIMEOUT:
            setErrorMessage("Timed out. Try again.");
            break;
          default:
            setErrorMessage("Could not determine your location.");
        }
      },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  }

  return (
    <div className={cn("flex flex-col items-start gap-3", className)}>
      <button
        type="button"
        onClick={handleClick}
        disabled={status === "loading"}
        className={cn(
          "group relative inline-flex items-center justify-center gap-2.5 overflow-hidden rounded-full bg-[#ff6b2c] font-semibold text-white shadow-lg shadow-[#ff6b2c]/25 transition hover:bg-[#ff7f47] hover:shadow-[#ff6b2c]/40 disabled:cursor-not-allowed disabled:opacity-70",
          size === "large" ? "px-8 py-4 text-lg" : "px-6 py-3 text-base",
        )}
      >
        <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 opacity-0 transition group-hover:opacity-100" />
        {status === "loading" ? (
          <Loader2 className="relative h-5 w-5 animate-spin" />
        ) : (
          <MapPin className="relative h-5 w-5" />
        )}
        <span className="relative">
          {status === "loading" ? "Hang on..." : "What's it like near me?"}
        </span>
        {status !== "loading" ? (
          <ArrowRight className="relative h-4 w-4 transition group-hover:translate-x-0.5" />
        ) : null}
      </button>
      {errorMessage ? (
        <p className="max-w-md rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-2 text-sm text-red-300">
          {errorMessage}
        </p>
      ) : null}
    </div>
  );
}
