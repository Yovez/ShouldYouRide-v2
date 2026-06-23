import { NextResponse } from "next/server";
import { fetchRideConditions } from "@/lib/weather";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lat = Number(searchParams.get("lat"));
  const lon = Number(searchParams.get("lon"));

  if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
    return NextResponse.json(
      { error: "Valid lat and lon query parameters are required." },
      { status: 400 },
    );
  }

  if (lat < -90 || lat > 90 || lon < -180 || lon > 180) {
    return NextResponse.json(
      { error: "Coordinates are out of range." },
      { status: 400 },
    );
  }

  try {
    const conditions = await fetchRideConditions(lat, lon);
    return NextResponse.json(conditions);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch weather data." },
      { status: 502 },
    );
  }
}
