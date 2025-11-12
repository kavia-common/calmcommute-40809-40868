import type { Metadata } from "next";
import "./globals.css";
import { NavBar } from "@/components/NavBar";

export const metadata: Metadata = {
  title: "CalmCommute",
  description:
    "Reduce stress during daily commutes with mood check-ins, calming audio suggestions, and commute-aware analytics.",
  applicationName: "CalmCommute",
  keywords: [
    "commute",
    "calm",
    "breathing",
    "music",
    "podcasts",
    "stress",
    "mindfulness",
    "traffic",
  ],
  icons: [{ rel: "icon", url: "/favicon.ico" }],
  metadataBase:
    typeof process !== "undefined" && process.env.NEXT_PUBLIC_FRONTEND_URL
      ? new URL(process.env.NEXT_PUBLIC_FRONTEND_URL)
      : undefined,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-ocean-bg text-ocean-text antialiased">
        <div className="relative min-h-screen">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-blue-500/10 via-transparent to-transparent" />
          <NavBar />
          <main className="container mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-12">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
