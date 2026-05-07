import { NewsItem } from "@/lib/types";
import { format } from "date-fns";

const SOURCE_TAG: Record<NewsItem["source"], string> = {
  hackernews: "HN",
  reddit: "RDT",
  rss: "RSS",
  arxiv: "ARX",
  twitter: "TWX",
};

export function WireTape({ items }: { items: NewsItem[] }) {
  const hot = items
    .filter((i) => (i.signalScore ?? 0) >= 75)
    .slice(0, 16);
  if (hot.length === 0) return null;

  // Duplicate so the marquee can loop seamlessly via translateX(-50%).
  const tape = [...hot, ...hot];

  return (
    <div
      className="relative -mx-6 sm:-mx-8 overflow-hidden border-y wire-tape"
      style={{ borderColor: "var(--wire-rule)" }}
      aria-label="Hot signal ticker"
    >
      <div className="flex">
        <span
          className="shrink-0 px-3 py-1.5 text-[10px] uppercase tracking-[0.18em] border-r"
          style={{
            color: "var(--wire-bg)",
            background: "var(--wire-signal)",
            borderColor: "var(--wire-rule)",
          }}
        >
          ● HOT TAPE
        </span>
        <div className="overflow-hidden flex-1">
          <div className="flex animate-wire-marquee hover:[animation-play-state:paused]">
            {tape.map((item, i) => (
              <a
                key={`${item.id}-${i}`}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 flex items-baseline gap-3 px-5 py-1.5 text-[12px] tabular-nums"
                title={item.title}
              >
                <span
                  className="text-[10px] uppercase tracking-[0.14em]"
                  style={{ color: "var(--wire-mute)" }}
                >
                  {format(new Date(item.timestamp), "HH:mm")}
                </span>
                <span
                  className="text-[10px] uppercase tracking-[0.14em]"
                  style={{ color: "var(--wire-mute)" }}
                >
                  {SOURCE_TAG[item.source]}
                </span>
                <span
                  className="text-[10px] uppercase tracking-[0.14em]"
                  style={{ color: "var(--wire-signal)" }}
                >
                  SIG {(item.signalScore ?? 0).toString().padStart(2, "0")}
                </span>
                <span className="uppercase tracking-tight max-w-[60ch] truncate">
                  {item.title}
                </span>
                <span aria-hidden style={{ color: "var(--wire-rule)" }}>
                  ·
                </span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
