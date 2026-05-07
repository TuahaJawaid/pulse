import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { GeistMono } from "geist/font/mono";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ??
      (process.env.VERCEL_PROJECT_PRODUCTION_URL
        ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
        : "http://localhost:3000")
  ),
  title: {
    default: "Pulse — AI News Intelligence",
    template: "%s · Pulse",
  },
  description:
    "Signal layer for AI news. Hacker News, Reddit, TechCrunch, The Verge, ArXiv — deduplicated, ranked, refreshed every 5 minutes.",
  applicationName: "Pulse",
  keywords: [
    "AI news",
    "AI dashboard",
    "AI intelligence",
    "machine learning",
    "LLM news",
    "AI signal",
    "AI funding",
    "AI research",
  ],
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    apple: [{ url: "/icon.svg" }],
  },
  openGraph: {
    type: "website",
    title: "Pulse — AI News Intelligence",
    description:
      "Signal layer for AI news. Deduplicated, ranked, refreshed every 5 minutes.",
    siteName: "Pulse",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pulse — AI News Intelligence",
    description:
      "Signal layer for AI news. Deduplicated, ranked, refreshed every 5 minutes.",
  },
};

export const viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fafafa" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${jakarta.variable} ${GeistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-background text-foreground font-sans">
        <ThemeProvider>
          <TooltipProvider>{children}</TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
