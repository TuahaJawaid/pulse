"use client";

import { NewsCategory, NewsSource } from "@/lib/types";

export type SortMode = "latest" | "signal" | "discussed" | "score";

export const CATEGORY_OPTIONS: { value: NewsCategory | "all"; label: string }[] = [
  { value: "all", label: "ALL" },
  { value: "product-launch", label: "MODELS" },
  { value: "funding", label: "CAPITAL" },
  { value: "research", label: "RSRCH" },
  { value: "policy", label: "POLICY" },
  { value: "big-tech", label: "BIGTECH" },
  { value: "open-source", label: "OPEN" },
];

export const SOURCE_OPTIONS: { value: NewsSource | "all"; label: string }[] = [
  { value: "all", label: "ALL" },
  { value: "hackernews", label: "HN" },
  { value: "reddit", label: "RDT" },
  { value: "rss", label: "RSS" },
  { value: "arxiv", label: "ARX" },
];

export const SORT_OPTIONS: { value: SortMode; label: string }[] = [
  { value: "latest", label: "TIME" },
  { value: "signal", label: "SIGNAL" },
  { value: "discussed", label: "TALK" },
  { value: "score", label: "SCORE" },
];

export function WirePrompt({
  query,
  onQueryChange,
  savedOnly,
  onSavedToggle,
  bookmarkCount,
  onClear,
  hasFilters,
  inputId,
}: {
  query: string;
  onQueryChange: (next: string) => void;
  savedOnly: boolean;
  onSavedToggle: () => void;
  bookmarkCount: number;
  onClear: () => void;
  hasFilters: boolean;
  inputId?: string;
}) {
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-[12px]">
      <span style={{ color: "var(--wire-signal)" }}>&gt;</span>
      <span
        className="text-[10px] uppercase tracking-[0.18em]"
        style={{ color: "var(--wire-mute)" }}
      >
        query:
      </span>
      <input
        id={inputId}
        type="text"
        value={query}
        onChange={(event) => onQueryChange(event.target.value)}
        placeholder="model, company, topic…"
        spellCheck={false}
        autoCorrect="off"
        autoCapitalize="off"
        className="min-w-[18ch] flex-1 border-b py-1"
        style={{
          borderColor: "var(--wire-rule)",
        }}
      />
      <span className="wire-cursor" style={{ color: "var(--wire-signal)" }}>
        █
      </span>
      <button
        type="button"
        onClick={onSavedToggle}
        aria-pressed={savedOnly}
        className="border px-2 py-1 text-[10px] uppercase tracking-[0.18em]"
        style={
          savedOnly
            ? { background: "var(--wire-fg)", color: "var(--wire-bg)" }
            : { color: "var(--wire-mute)" }
        }
      >
        [marked {bookmarkCount.toString().padStart(2, "0")}]
      </button>
      {hasFilters && (
        <button
          type="button"
          onClick={onClear}
          className="border px-2 py-1 text-[10px] uppercase tracking-[0.18em]"
          style={{ color: "var(--wire-mute)" }}
        >
          [reset]
        </button>
      )}
    </div>
  );
}

export function WireTabs<T extends string>({
  options,
  active,
  onChange,
  counts,
  ariaLabel,
}: {
  options: { value: T; label: string }[];
  active: T;
  onChange: (value: T) => void;
  counts?: Map<T, number>;
  ariaLabel: string;
}) {
  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      className="flex flex-wrap gap-x-1 gap-y-1 text-[10px] uppercase tracking-[0.18em]"
    >
      {options.map((opt) => {
        const isActive = active === opt.value;
        const count = counts?.get(opt.value);
        const showCount = count !== undefined && opt.value !== ("all" as T);
        return (
          <button
            key={opt.value}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(opt.value)}
            className="border px-2 py-1"
            style={
              isActive
                ? { background: "var(--wire-fg)", color: "var(--wire-bg)" }
                : { color: "var(--wire-mute)" }
            }
          >
            <span>[{opt.label}]</span>
            {showCount && (
              <span
                className="ml-2"
                style={{
                  color: isActive ? "var(--wire-bg)" : "var(--wire-cold)",
                  opacity: isActive ? 0.6 : 1,
                }}
              >
                {count!.toString().padStart(2, "0")}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
