"use client";

import { useMemo } from "react";
import { NewsItem } from "@/lib/types";

export function WireWatchlist({
  items,
  activeCompany,
  onSelect,
}: {
  items: NewsItem[];
  activeCompany: string | null;
  onSelect: (company: string | null) => void;
}) {
  const counts = useMemo(() => {
    const map = new Map<string, number>();
    for (const item of items) {
      for (const tag of item.companyTags) {
        map.set(tag, (map.get(tag) || 0) + 1);
      }
    }
    return Array.from(map.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 14);
  }, [items]);

  if (counts.length === 0) {
    return (
      <p className="text-[12px]" style={{ color: "var(--wire-mute)" }}>
        No watchlist activity this cycle.
      </p>
    );
  }

  return (
    <div className="flex flex-wrap gap-x-1 gap-y-1 text-[11px] uppercase tracking-[0.1em]">
      {activeCompany && (
        <button
          type="button"
          onClick={() => onSelect(null)}
          className="border px-2 py-1"
          style={{ color: "var(--wire-mute)" }}
        >
          [×] CLEAR
        </button>
      )}
      {counts.map((c) => {
        const active = activeCompany === c.name;
        return (
          <button
            type="button"
            key={c.name}
            onClick={() => onSelect(active ? null : c.name)}
            aria-pressed={active}
            className="border px-2 py-1"
            style={
              active
                ? { background: "var(--wire-fg)", color: "var(--wire-bg)" }
                : undefined
            }
          >
            <span>{c.name.toUpperCase()}</span>
            <span
              className="ml-2 text-[10px]"
              style={{
                color: active ? "var(--wire-bg)" : "var(--wire-mute)",
                opacity: active ? 0.6 : 1,
              }}
            >
              {c.count.toString().padStart(2, "0")}
            </span>
          </button>
        );
      })}
    </div>
  );
}
