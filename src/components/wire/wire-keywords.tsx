"use client";

import { TrendingKeyword } from "@/lib/trending-keywords";

export function WireKeywords({
  keywords,
  activeTerm,
  onSelect,
}: {
  keywords: TrendingKeyword[];
  activeTerm: string | null;
  onSelect: (term: string | null) => void;
}) {
  if (keywords.length === 0) {
    return (
      <p className="text-[12px]" style={{ color: "var(--wire-mute)" }}>
        No trending tech terms detected this cycle.
      </p>
    );
  }

  return (
    <div className="flex flex-wrap gap-x-1 gap-y-1 text-[11px] uppercase tracking-[0.1em]">
      {activeTerm && (
        <button
          type="button"
          onClick={() => onSelect(null)}
          className="border px-2 py-1"
          style={{
            color: "var(--wire-mute)",
            borderColor: "var(--wire-rule)",
          }}
        >
          [×] CLEAR
        </button>
      )}
      {keywords.map((k) => {
        const active = activeTerm === k.term;
        return (
          <button
            type="button"
            key={k.term}
            onClick={() => onSelect(active ? null : k.term)}
            aria-pressed={active}
            className="border px-2 py-1"
            style={{
              borderColor: "var(--wire-rule)",
              color: active ? "var(--wire-bg)" : "var(--wire-fg)",
              background: active ? "var(--wire-fg)" : "transparent",
            }}
          >
            <span>{k.term.toUpperCase()}</span>
            <span
              className="ml-2 text-[10px]"
              style={{
                color: active ? "var(--wire-bg)" : "var(--wire-mute)",
                opacity: active ? 0.75 : 1,
              }}
            >
              {k.count.toString().padStart(2, "0")}
            </span>
          </button>
        );
      })}
    </div>
  );
}
