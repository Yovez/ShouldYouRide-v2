import Link from "next/link";
import { Heart } from "lucide-react";

const AUTHOR_GITHUB = "https://github.com/Yovez";
const REPO_GITHUB = "https://github.com/Yovez/ShouldYouRide-v2";

export function SiteFooter() {
  return (
    <footer className="relative z-10 mt-auto border-t border-white/5 bg-[#080a0f]/60 py-10 backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-3 px-4 text-center text-sm text-zinc-500 sm:px-8">
        <div className="accent-line mx-auto" />
        <p className="inline-flex flex-wrap items-center justify-center gap-1.5">
          Made with
          <Heart
            className="h-4 w-4 fill-[#ff6b2c] text-[#ff6b2c]"
            aria-hidden="true"
          />
          by{" "}
          <a
            href={AUTHOR_GITHUB}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-[#ff6b2c] transition hover:text-[#ff8f5c]"
          >
            Yovez
          </a>
        </p>
        <Link
          href={REPO_GITHUB}
          target="_blank"
          rel="noopener noreferrer"
          className="text-zinc-600 transition hover:text-zinc-400"
        >
          View the code on GitHub
        </Link>
      </div>
    </footer>
  );
}
