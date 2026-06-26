import type { Metadata } from "next";
import { SiteHeader } from "@/components/SiteHeader";
import { RandomRoutePlanner } from "@/components/RandomRoutePlanner";

export const metadata: Metadata = {
  title: "Random route",
  description: "Get a random motorcycle route near you with a shareable Google Maps link.",
};

interface RoutePageProps {
  searchParams: Promise<{ lat?: string; lon?: string }>;
}

export default async function RoutePage({ searchParams }: RoutePageProps) {
  const params = await searchParams;
  const lat = Number(params.lat);
  const lon = Number(params.lon);

  const initialLocation =
    Number.isFinite(lat) && Number.isFinite(lon) ? { lat, lng: lon } : undefined;

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-7xl flex-1 px-4 py-8 sm:px-8 sm:py-10">
        <RandomRoutePlanner initialLocation={initialLocation} />
      </main>
    </>
  );
}
