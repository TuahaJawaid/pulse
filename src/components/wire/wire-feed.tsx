"use client";

import { NewsItem } from "@/lib/types";
import { format } from "date-fns";
import { getSignalLabel } from "@/lib/signal-score";
import { readingTimeMinutes } from "@/lib/reading-time";
import { Bookmark, BookmarkCheck, X } from "lucide-react";

const SOURCE_TAG: Record<NewsItem["source"], string> = {
  hackernews: "HN ",
  reddit: "RDT",
  rss: "RSS",
  arxiv: "ARX",
  twitter: "TWX",
};

function sigGlyph(score: number) {
  if (score >= 80) return "███";
  if (score >= 60) return "██·";
  return "█··";
}

export function WireFeed({
  items,
  bookmarkedIds,
  onBookmarkToggle,
  newSinceLastVisit,
  onHide,
  focusedId,
  onRowRef,
}: {
  items: NewsItem[];
  bookmarkedIds: Set<string>;
  onBookmarkToggle: (id: string) => void;
  newSinceLastVisit: Set<string>;
  onHide?: (id: string) => void;
  focusedId?: string | null;
  onRowRef?: (id: string, el: HTMLLIElement | null) => void;
}) {
  if (items.length === 0) {
    return (
      <p className="py-6 text-[12px]" style={{ color: "var(--wire-mute)" }}>
        No traffic on the wire matching your filter.
      </p>
    );
  }

  return (
    <ol className="text-[12px] tabular-nums">
      {items.map((item) => {
        const score = item.signalScore ?? 0;
        const time = format(new Date(item.timestamp), "HH:mm");
        const date = format(new Date(item.timestamp), "MMdd").toUpperCase();
        const isBookmarked = bookmarkedIds.has(item.id);
        const isNew = newSinceLastVisit.has(item.id);
        const isFocused = focusedId === item.id;
        const sigColor =
          score >= 80
            ? "var(--wire-signal)"
            : score >= 60
            ? "var(--wire-fg)"
            : "var(--wire-mute)";
        const minutes = readingTimeMinutes(item);

        return (
          <li
            key={item.id}
            ref={onRowRef ? (el) => onRowRef(item.id, el) : undefined}
            data-story-id={item.id}
            className={`wire-row-hover grid items-baseline gap-x-3 border-b py-2 px-1 ${
              isFocused ? "wire-row-focused" : ""
            }`}
            style={{
              gridTemplateColumns:
                "5ch 4ch 4ch 4ch minmax(0, 1fr) auto auto auto auto",
              borderColor: "var(--wire-rule)",
            }}
          >
            <span
              className="text-[10px] uppercase tracking-[0.12em]"
              style={{ color: "var(--wire-mute)" }}
            >
              {date}
            </span>
            <span style={{ color: "var(--wire-mute)" }}>{time}</span>
            <span style={{ color: "var(--wire-mute)" }}>
              {SOURCE_TAG[item.source]}
            </span>
            <span
              style={{ color: sigColor }}
              title={`${getSignalLabel(score)} ${score}`}
              aria-label={`Signal ${getSignalLabel(score)} ${score}`}
            >
              {sigGlyph(score)}
            </span>
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="min-w-0 truncate uppercase tracking-tight flex items-baseline gap-2"
              title={item.title}
            >
              {isNew && (
                <span
                  className="shrink-0"
                  style={{ color: "var(--wire-signal)" }}
                  aria-label="new since last visit"
                >
                  ●
                </span>
              )}
              <span className="truncate">{item.title}</span>
              {item.relatedSources && item.relatedSources.length > 0 && (
                <span
                  className="shrink-0 text-[10px]"
                  style={{ color: "var(--wire-mute)" }}
                  title={`Also seen on: ${item.relatedSources
                    .map((r) => r.sourceDetail)
                    .join(", ")}`}
                >
                  +{item.relatedSources.length}
                </span>
              )}
            </a>
            <span
              className="text-[10px] uppercase tracking-[0.14em] hidden lg:inline"
              style={{ color: "var(--wire-mute)" }}
            >
              {item.companyTags[0]?.toUpperCase() ?? item.sourceDetail.toUpperCase()}
            </span>
            <span
              className="text-[10px] uppercase tracking-[0.14em] hidden md:inline"
              style={{ color: "var(--wire-cold)" }}
              title="Estimated reading time"
            >
              {minutes}M
            </span>
            <button
              type="button"
              onClick={() => onBookmarkToggle(item.id)}
              aria-label={
                isBookmarked ? "Unmark transmission" : "Mark transmission"
              }
              style={{
                color: isBookmarked ? "var(--wire-signal)" : "var(--wire-mute)",
              }}
              title={isBookmarked ? "Unmark" : "Mark"}
            >
              {isBookmarked ? (
                <BookmarkCheck className="h-3.5 w-3.5" />
              ) : (
                <Bookmark className="h-3.5 w-3.5" />
              )}
            </button>
            {onHide && (
              <button
                type="button"
                onClick={() => onHide(item.id)}
                aria-label="Hide transmission"
                title="Hide"
                style={{ color: "var(--wire-cold)" }}
                className="hover:text-(--wire-hot)!"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </li>
        );
      })}
    </ol>
  );
}
