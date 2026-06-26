import Link from "next/link";
import { BrandIcon } from "@/components/BrandIcon";

const GITHUB_URL = "https://github.com/Yovez/ShouldYouRide-v2";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-[#080a0f]/75 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-8">
        <Link href="/" className="group flex items-center gap-3">
          <div className="relative">
            <div className="absolute -inset-1 rounded-2xl bg-[#ff6b2c]/20 opacity-0 blur transition group-hover:opacity-100" />
            <BrandIcon size={42} className="relative rounded-2xl ring-1 ring-white/10" />
          </div>
          <div>
            <p className="font-display text-base font-bold tracking-tight text-white">
              ShouldYouRide
            </p>
            <p className="text-[11px] font-medium text-zinc-500">
              for people who ride
            </p>
          </div>
        </Link>
        <nav className="flex items-center gap-1 text-sm">
          <Link
            href="/"
            className="rounded-full px-4 py-2 text-zinc-400 transition hover:bg-white/5 hover:text-white"
          >
            Home
          </Link>
          <Link
            href="/route"
            className="rounded-full px-4 py-2 text-zinc-400 transition hover:bg-white/5 hover:text-white"
          >
            Random route
          </Link>
          <Link
            href="/about"
            className="rounded-full px-4 py-2 text-zinc-400 transition hover:bg-white/5 hover:text-white"
          >
            About
          </Link>
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full px-4 py-2 text-zinc-400 transition hover:bg-white/5 hover:text-white"
          >
            GitHub
          </a>
        </nav>
      </div>
    </header>
  );
}
