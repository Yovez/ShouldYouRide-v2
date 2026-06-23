import Link from "next/link";
import { Heart } from "lucide-react";

const AUTHOR_GITHUB = "https://github.com/Yovez";
const REPO_GITHUB = "https://github.com/Yovez/ShouldYouRide-v2";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-zinc-800 py-8">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-2 px-4 text-center text-sm text-zinc-500 sm:px-6">
        <p className="inline-flex flex-wrap items-center justify-center gap-1.5">
          Made with
          <Heart
            className="h-4 w-4 fill-red-500 text-red-500"
            aria-hidden="true"
          />
          by{" "}
          <a
            href={AUTHOR_GITHUB}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-amber-400 transition hover:underline"
          >
            Yovez
          </a>
        </p>
        <p>
          <Link
            href={REPO_GITHUB}
            target="_blank"
            rel="noopener noreferrer"
            className="text-zinc-500 transition hover:text-zinc-300"
          >
            View source on GitHub
          </Link>
        </p>
      </div>
    </footer>
  );
}
