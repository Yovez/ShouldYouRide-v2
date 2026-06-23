# ShouldYouRide v2

A motorcycle-focused dashboard that answers one question: **should you ride today?**

[github.com/Yovez/ShouldYouRide-v2](https://github.com/Yovez/ShouldYouRide-v2)

Weather, hourly forecast, wind chill, traffic, and a ride score — all in one place.

## Features

- **Ride score** — weighted verdict from temperature, rain, wind, and feels-like
- **Current weather** — conditions, humidity, wind, precipitation, sunset
- **12-hour forecast** — hourly outlook for planning your ride window
- **Wind chill chart** — NWS formula at common riding speeds
- **Traffic map** — Google Maps traffic layer on demand (optional API key)
- **Geolocation** — one tap to check conditions where you are

## Stack

- [Next.js](https://nextjs.org/) (App Router, React 19)
- [Tailwind CSS](https://tailwindcss.com/)
- [Open-Meteo](https://open-meteo.com/) — free weather, no API key required
- [@vis.gl/react-google-maps](https://visgl.github.io/react-google-maps/) — traffic overlay (optional)

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Traffic map (optional)

1. Create a [Google Cloud](https://console.cloud.google.com/) project
2. Enable **Maps JavaScript API**
3. Copy `.env.example` to `.env.local` and set `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`

Without a key, the ride page links out to Google Maps traffic instead. The embedded map loads only when you click **Show traffic map**, which helps keep API usage down.

## API

`GET /api/weather?lat=40.7&lon=-74.0` — JSON ride conditions for coordinates.

## Scripts

| Command       | Description          |
| ------------- | -------------------- |
| `npm run dev` | Development server   |
| `npm run build` | Production build   |
| `npm start`   | Run production build |
| `npm run lint` | ESLint              |

## License

Private project.
