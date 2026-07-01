# ShouldYouRide v2

I got tired of checking four apps every morning. I ride whenever I can, and before I head out I want a straight answer on whether the weather is worth it. Not a full forecast. Not math in my head.

That's what this is. One page that asks **should you ride today?** Weather, the next 12 hours, wind chill at highway speed, traffic if you want it, and a ride score that rolls it together.

This is a rewrite of [the original ShouldYouRide](https://github.com/Yovez/ShouldYouRide-v1) (Node, Express, Pug). Same idea, cleaner build.

## What it does

- **Ride score:** temp, rain, wind, and feels-like in one verdict so you don't have to guess
- **Current weather:** what's happening right now where you are
- **12-hour forecast:** for when it looks fine at 9am but storms roll in by lunch
- **Wind chill chart:** 45° standing still is not 45° at 70 mph
- **Traffic map:** optional.
- **Random route:** pick a distance or ride time, get a loop or one-way route, open it in Google Maps
- **Your location:** tap once and check conditions at your spot

## Built with

- [Next.js](https://nextjs.org/) (App Router)
- [Tailwind CSS](https://tailwindcss.com/)
- [Open-Meteo](https://open-meteo.com/) for weather. Free, no key needed
- [Google Maps](https://visgl.github.io/react-google-maps/) for traffic and routes. Optional key

## Run it locally

```bash
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

### Google Maps (optional)

Most of the app works without this. You only need a key for the embedded traffic map or the random route planner.

1. Create a project in [Google Cloud](https://console.cloud.google.com/)
2. Enable **Maps JavaScript API** and **Directions API**
3. Copy `.env.example` to `.env.local` and add your key:

```env
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_key_here
```

No key? The ride page still links out to Google Maps for traffic. The embedded map only loads when you hit **Show traffic map**.

## Weather API

```
GET /api/weather?lat=40.7&lon=-74.0
```

Returns JSON with ride conditions for those coordinates.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Local dev server |
| `npm run build` | Production build |
| `npm start` | Run the production build |
| `npm run lint` | ESLint |

## License

Licensed under [Apache 2.0](LICENSE). Use it, fork it, whatever. Just keep the license notice if you redistribute it.
