import type { Metadata } from "next";
import { DM_Sans, Outfit } from "next/font/google";
import { Geist_Mono } from "next/font/google";
import { SiteFooter } from "@/components/SiteFooter";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Should You Ride?",
    template: "%s | Should You Ride",
  },
  description:
    "A small site that tells you if today's worth riding your motorcycle.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${dmSans.variable} ${outfit.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="page-backdrop relative min-h-full flex flex-col text-zinc-100">
        <div className="relative z-10 flex min-h-full flex-col">{children}</div>
        <SiteFooter />
      </body>
    </html>
  );
}
