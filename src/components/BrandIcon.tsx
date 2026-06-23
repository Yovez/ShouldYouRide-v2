import { cn } from "@/lib/utils";

interface BrandIconProps {
  className?: string;
  size?: number;
}

export function BrandIcon({ className, size = 40 }: BrandIconProps) {
  return (
    <svg
      viewBox="0 0 32 32"
      width={size}
      height={size}
      aria-hidden="true"
      className={cn("shrink-0", className)}
    >
      <rect width="32" height="32" rx="8" fill="#11141c" />
      <circle cx="24" cy="8" r="3.25" fill="#ffb347" />
      <circle cx="24" cy="8" r="5.5" fill="none" stroke="#ffb347" strokeWidth="1" opacity="0.45" />
      <path
        d="M7 21.5c0-1.1.9-2 2-2h1.2l1.8-3.2 2.4-1.1 1.6 2.1h3.4l1.2-2.1 2.2-.4 1.4 2.6h2.2c1.1 0 2 .9 2 2"
        fill="none"
        stroke="#ff6b2c"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="10.5" cy="21.5" r="2.6" fill="none" stroke="#ff6b2c" strokeWidth="1.6" />
      <circle cx="21.5" cy="21.5" r="2.6" fill="none" stroke="#ff6b2c" strokeWidth="1.6" />
      <path
        d="M11.5 14.2h3.8l1.4 2.2"
        fill="none"
        stroke="#ff6b2c"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
