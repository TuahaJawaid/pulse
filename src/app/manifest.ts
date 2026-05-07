import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Pulse — AI News Intelligence",
    short_name: "Pulse",
    description:
      "Signal layer for AI news. Hacker News, Reddit, TechCrunch, The Verge, ArXiv — deduplicated and ranked.",
    start_url: "/",
    display: "standalone",
    background_color: "#fafafa",
    theme_color: "#bef264",
    orientation: "portrait",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
    ],
  };
}
