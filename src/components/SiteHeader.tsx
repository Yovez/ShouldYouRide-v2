import Link from "next/link";
import { BrandIcon } from "@/components/BrandIcon";

const GITHUB_URL = "https://github.com/Yovez/ShouldYouRide-v2";

export function SiteHeader() {
  return (
    <header className="border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <Link href="/" className="group flex items-center gap-3">
          <BrandIcon size={40} className="ring-1 ring-amber-500/30 rounded-xl" />
          <div>
            <p className="text-sm font-semibold tracking-wide text-amber-400">
              ShouldYouRide
            </p>
            <p className="text-xs text-zinc-500">Ride conditions</p>
          </div>
        </Link>
        <nav className="flex items-center gap-4 text-sm text-zinc-400">
          <Link href="/" className="transition hover:text-zinc-100">
            Home
          </Link>
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="transition hover:text-zinc-100"
          >
            GitHub
          </a>
        </nav>
      </div>
    </header>
  );
}
