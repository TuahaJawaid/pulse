"use client";

import { NewsItem } from "@/lib/types";
import { SOURCE_LABELS } from "@/lib/constants";

export function WireQuietLane({ items }: { items: NewsItem[] }) {
  if (items.length === 0) return null;

  return (
    <ol className="text-[12px] tabular-nums">
      {items.map((item) => (
        <li
          key={item.id}
          className="grid items-baseline gap-x-3 border-b py-2 px-1"
          style={{
            gridTemplateColumns: "auto minmax(0, 1fr) auto",
            borderColor: "var(--wire-rule)",
          }}
        >
          <span style={{ color: "var(--wire-mute)" }}>·</span>
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="min-w-0 truncate uppercase tracking-tight"
          >
            {item.title}
          </a>
          <span
            className="text-[10px] uppercase tracking-[0.14em]"
            style={{ color: "var(--wire-mute)" }}
          >
            {SOURCE_LABELS[item.source]} · {(item.signalScore ?? 0).toString().padStart(2, "0")}
          </span>
        </li>
      ))}
    </ol>
  );
}
