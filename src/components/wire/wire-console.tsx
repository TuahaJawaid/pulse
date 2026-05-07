"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { NewsCategory, NewsItem, NewsSource } from "@/lib/types";
import { getSignalLabel } from "@/lib/signal-score";
import { useBookmarks } from "@/lib/use-bookmarks";
import { useLastSeen } from "@/lib/use-last-seen";
import { useCustomWatchlist } from "@/lib/use-custom-watchlist";
import { useHiddenStories } from "@/lib/use-hidden-stories";
import { useViewMode } from "@/lib/use-view-mode";
import { useKeyboardShortcuts, ShortcutHandler } from "@/lib/use-keyboard-shortcuts";
import { trendingKeywords } from "@/lib/trending-keywords";
import { WireSection } from "./wire-section";
import { WireTable, WireColumn } from "./wire-table";
import { WireFeed } from "./wire-feed";
import { WireWatchlist } from "./wire-watchlist";
import { WireCustomBanner } from "./wire-custom-banner";
import { WireQuietLane } from "./wire-quiet-lane";
import { WireForward } from "./wire-forward";
import { WireKeywords } from "./wire-keywords";
import { WireShortcutsHelp } from "./wire-shortcuts-help";
import {
  WirePrompt,
  WireTabs,
  CATEGORY_OPTIONS,
  SOURCE_OPTIONS,
  SORT_OPTIONS,
  SortMode,
} from "./wire-filters";

const SOURCE_TAG: Record<NewsItem["source"], string> = {
  hackernews: "HN",
  reddit: "RDT",
  rss: "RSS",
  arxiv: "ARX",
  twitter: "TWX",
};

const SEARCH_INPUT_ID = "wire-search-input";

function abbreviateAgo(date: Date): string {
  return formatDistanceToNow(date, { addSuffix: false })
    .replace("about ", "")
    .replace("less than ", "<")
    .replace(" minutes", "m")
    .replace(" minute", "m")
    .replace(" hours", "h")
    .replace(" hour", "h")
    .replace(" days", "d")
    .replace(" day", "d")
    .replace(" months", "mo")
    .replace(" month", "mo");
}

function matchesCustomWatchlist(item: NewsItem, tokens: string[]): boolean {
  if (tokens.length === 0) return true;
  const hay = `${item.title} ${item.summary ?? ""} ${item.companyTags.join(
    " "
  )}`.toLowerCase();
  return tokens.some((tok) => hay.includes(tok));
}

function matchesKeyword(item: NewsItem, term: string): boolean {
  const hay = `${item.title} ${item.summary ?? ""}`.toLowerCase();
  return hay.includes(term.toLowerCase());
}

function quietSignals(items: NewsItem[]): NewsItem[] {
  const candidates = items.filter((i) => {
    const eng = (i.engagement.score ?? 0) + (i.engagement.comments ?? 0);
    return (i.signalScore ?? 0) >= 60 && eng < 50;
  });
  return [...candidates]
    .sort((a, b) => (b.signalScore ?? 0) - (a.signalScore ?? 0))
    .slice(0, 4);
}

export function WireConsole({ items }: { items: NewsItem[] }) {
  const [activeCategory, setActiveCategory] = useState<NewsCategory | "all">(
    "all"
  );
  const [activeSource, setActiveSource] = useState<NewsSource | "all">("all");
  const [activeSort, setActiveSort] = useState<SortMode>("latest");
  const [activeCompany, setActiveCompany] = useState<string | null>(null);
  const [activeKeyword, setActiveKeyword] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [savedOnly, setSavedOnly] = useState(false);
  const [showHidden, setShowHidden] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [focusedId, setFocusedId] = useState<string | null>(null);

  const {
    ids: bookmarks,
    toggle: toggleBookmark,
    count: bookmarkCount,
  } = useBookmarks();
  const { previous: lastSeen } = useLastSeen();
  const customWatchlist = useCustomWatchlist();
  const { ids: hiddenIds, hide, clear: clearHidden, count: hiddenCount } =
    useHiddenStories();
  const [viewMode, setViewMode] = useViewMode();

  const customMatched = useMemo(
    () => items.filter((item) => matchesCustomWatchlist(item, customWatchlist)),
    [items, customWatchlist]
  );

  const visibleAfterHide = useMemo(
    () =>
      showHidden
        ? customMatched
        : customMatched.filter((i) => !hiddenIds.has(i.id)),
    [customMatched, hiddenIds, showHidden]
  );

  const newSinceLastVisit = useMemo(() => {
    if (!lastSeen) return new Set<string>();
    const cutoff = lastSeen.getTime();
    return new Set(
      items
        .filter((i) => new Date(i.timestamp).getTime() > cutoff)
        .map((i) => i.id)
    );
  }, [items, lastSeen]);

  const categoryCounts = useMemo(() => {
    const map = new Map<NewsCategory | "all", number>([
      ["all", visibleAfterHide.length],
    ]);
    for (const item of visibleAfterHide) {
      map.set(item.category, (map.get(item.category) || 0) + 1);
    }
    return map;
  }, [visibleAfterHide]);

  const sourceCounts = useMemo(() => {
    const map = new Map<NewsSource | "all", number>([
      ["all", visibleAfterHide.length],
    ]);
    for (const item of visibleAfterHide) {
      map.set(item.source, (map.get(item.source) || 0) + 1);
    }
    return map;
  }, [visibleAfterHide]);

  const keywords = useMemo(
    () => trendingKeywords(visibleAfterHide),
    [visibleAfterHide]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const base = visibleAfterHide.filter((item) => {
      if (savedOnly && !bookmarks.has(item.id)) return false;
      if (activeCategory !== "all" && item.category !== activeCategory)
        return false;
      if (activeSource !== "all" && item.source !== activeSource) return false;
      if (activeCompany && !item.companyTags.includes(activeCompany))
        return false;
      if (activeKeyword && !matchesKeyword(item, activeKeyword)) return false;
      if (q) {
        const hay = `${item.title} ${item.summary ?? ""} ${item.companyTags.join(
          " "
        )}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });

    return [...base].sort((a, b) => {
      if (activeSort === "signal")
        return (b.signalScore ?? 0) - (a.signalScore ?? 0);
      if (activeSort === "discussed")
        return (b.engagement.comments ?? 0) - (a.engagement.comments ?? 0);
      if (activeSort === "score")
        return (b.engagement.score ?? 0) - (a.engagement.score ?? 0);
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    });
  }, [
    visibleAfterHide,
    savedOnly,
    bookmarks,
    activeCategory,
    activeSource,
    activeCompany,
    activeKeyword,
    query,
    activeSort,
  ]);

  const quiet = useMemo(() => quietSignals(visibleAfterHide), [visibleAfterHide]);

  const launches = filtered
    .filter((i) => i.category === "product-launch")
    .slice(0, 8);
  const capital = filtered.filter((i) => i.category === "funding").slice(0, 12);
  const research = filtered
    .filter((i) => i.category === "research" || i.source === "arxiv")
    .slice(0, 8);

  const launchesColumns: WireColumn[] = [
    { key: "tag", label: "src", width: "5ch", mute: true },
    { key: "co", label: "actor", width: "minmax(10ch, 18ch)" },
    { key: "title", label: "transmission", width: "minmax(0, 1fr)" },
    { key: "sig", label: "sig", width: "10ch", align: "right" },
    { key: "ago", label: "when", width: "8ch", align: "right", mute: true },
  ];

  const launchesRows = launches.map((item) => {
    const score = item.signalScore ?? 0;
    return {
      id: item.id,
      href: item.url,
      cells: [
        SOURCE_TAG[item.source],
        (item.companyTags[0] || item.sourceDetail).toUpperCase(),
        <span key="t" className="uppercase tracking-tight">
          {item.title}
        </span>,
        <span
          key="s"
          style={{
            color:
              score >= 80
                ? "var(--wire-signal)"
                : score >= 60
                ? "var(--wire-fg)"
                : "var(--wire-mute)",
          }}
        >
          {getSignalLabel(score).toUpperCase()} {score.toString().padStart(2, "0")}
        </span>,
        abbreviateAgo(new Date(item.timestamp)),
      ],
    };
  });

  const capitalColumns: WireColumn[] = [
    { key: "co", label: "company", width: "minmax(12ch, 1fr)" },
    { key: "title", label: "headline", width: "minmax(0, 1.4fr)", mute: true },
    { key: "src", label: "src", width: "5ch", mute: true },
    { key: "when", label: "when", width: "8ch", align: "right", mute: true },
  ];

  const capitalRows = capital.map((item) => ({
    id: item.id,
    href: item.url,
    cells: [
      <span key="c" className="uppercase">
        {(item.companyTags[0] || item.sourceDetail).toUpperCase()}
      </span>,
      <span key="t" className="uppercase tracking-tight">
        {item.title}
      </span>,
      SOURCE_TAG[item.source],
      abbreviateAgo(new Date(item.timestamp)),
    ],
  }));

  const researchColumns: WireColumn[] = [
    { key: "src", label: "src", width: "5ch", mute: true },
    { key: "title", label: "paper", width: "minmax(0, 1fr)" },
    { key: "tags", label: "tags", width: "minmax(10ch, 18ch)", mute: true },
    { key: "when", label: "when", width: "8ch", align: "right", mute: true },
  ];

  const researchRows = research.map((item) => ({
    id: item.id,
    href: item.url,
    cells: [
      SOURCE_TAG[item.source],
      <span key="t" className="uppercase tracking-tight">
        {item.title}
      </span>,
      item.companyTags
        .slice(0, 2)
        .map((t) => t.toUpperCase())
        .join(", ") || item.sourceDetail,
      abbreviateAgo(new Date(item.timestamp)),
    ],
  }));

  const hasFilters =
    !!query ||
    activeCategory !== "all" ||
    activeSource !== "all" ||
    activeSort !== "latest" ||
    !!activeCompany ||
    !!activeKeyword ||
    savedOnly;

  const reset = useCallback(() => {
    setActiveCategory("all");
    setActiveSource("all");
    setActiveSort("latest");
    setActiveCompany(null);
    setActiveKeyword(null);
    setSavedOnly(false);
    setQuery("");
  }, []);

  // ---------- Keyboard navigation ----------
  const rowRefs = useRef(new Map<string, HTMLLIElement>());
  const onRowRef = useCallback((id: string, el: HTMLLIElement | null) => {
    if (el) rowRefs.current.set(id, el);
    else rowRefs.current.delete(id);
  }, []);

  const moveFocus = useCallback(
    (delta: 1 | -1) => {
      if (filtered.length === 0) return;
      const ids = filtered.map((i) => i.id);
      const idx = focusedId ? ids.indexOf(focusedId) : -1;
      const nextIdx =
        idx === -1
          ? delta === 1
            ? 0
            : ids.length - 1
          : Math.max(0, Math.min(ids.length - 1, idx + delta));
      const nextId = ids[nextIdx];
      setFocusedId(nextId);
      const el = rowRefs.current.get(nextId);
      el?.scrollIntoView({ block: "nearest", behavior: "smooth" });
    },
    [filtered, focusedId]
  );

  const focusedItem = useMemo(
    () => filtered.find((i) => i.id === focusedId) ?? null,
    [filtered, focusedId]
  );

  const handlers: ShortcutHandler[] = useMemo(() => {
    const seq: ShortcutHandler[] = [
      {
        key: "/",
        description: "focus search",
        run: (e) => {
          e.preventDefault();
          document.getElementById(SEARCH_INPUT_ID)?.focus();
        },
      },
      {
        key: "j",
        description: "next",
        run: (e) => {
          e.preventDefault();
          moveFocus(1);
        },
      },
      {
        key: "k",
        description: "previous",
        run: (e) => {
          e.preventDefault();
          moveFocus(-1);
        },
      },
      {
        key: "Enter",
        description: "open focused",
        run: () => {
          if (focusedItem) {
            window.open(focusedItem.url, "_blank", "noopener,noreferrer");
          }
        },
      },
      {
        key: "b",
        description: "bookmark",
        run: () => {
          if (focusedItem) toggleBookmark(focusedItem.id);
        },
      },
      {
        key: "x",
        description: "hide",
        run: () => {
          if (focusedItem) {
            hide(focusedItem.id);
            // Move focus forward so the next item gets selected
            const ids = filtered.map((i) => i.id);
            const idx = ids.indexOf(focusedItem.id);
            const next = ids[idx + 1] ?? ids[idx - 1] ?? null;
            setFocusedId(next);
          }
        },
      },
      {
        key: "s",
        description: "saved-only",
        run: () => setSavedOnly((v) => !v),
      },
      {
        key: "v",
        description: "toggle view",
        run: () => setViewMode(viewMode === "tape" ? "section" : "tape"),
      },
      {
        key: "?",
        description: "help",
        run: () => setHelpOpen(true),
      },
      {
        key: "Escape",
        description: "clear",
        run: () => {
          if (helpOpen) setHelpOpen(false);
          else if (hasFilters) reset();
          else if (focusedId) setFocusedId(null);
        },
      },
    ];
    return seq;
  }, [
    moveFocus,
    focusedItem,
    toggleBookmark,
    hide,
    filtered,
    viewMode,
    setViewMode,
    helpOpen,
    hasFilters,
    reset,
    focusedId,
  ]);

  useKeyboardShortcuts(handlers, !helpOpen);

  return (
    <div className="space-y-8">
      <WireCustomBanner
        tokens={customWatchlist}
        matched={customMatched.length}
        total={items.length}
      />

      <div
        className="space-y-4 border-y py-4"
        style={{ borderColor: "var(--wire-rule)" }}
      >
        <WirePrompt
          query={query}
          onQueryChange={setQuery}
          savedOnly={savedOnly}
          onSavedToggle={() => setSavedOnly((v) => !v)}
          bookmarkCount={bookmarkCount}
          onClear={reset}
          hasFilters={hasFilters}
          inputId={SEARCH_INPUT_ID}
        />
        <div className="flex items-baseline gap-3 flex-wrap">
          <span
            className="text-[10px] uppercase tracking-[0.18em] w-[6ch]"
            style={{ color: "var(--wire-mute)" }}
          >
            chan:
          </span>
          <WireTabs
            ariaLabel="Channel filter"
            options={CATEGORY_OPTIONS}
            active={activeCategory}
            onChange={setActiveCategory}
            counts={categoryCounts}
          />
        </div>
        <div className="flex items-baseline gap-3 flex-wrap">
          <span
            className="text-[10px] uppercase tracking-[0.18em] w-[6ch]"
            style={{ color: "var(--wire-mute)" }}
          >
            src:
          </span>
          <WireTabs
            ariaLabel="Source filter"
            options={SOURCE_OPTIONS}
            active={activeSource}
            onChange={setActiveSource}
            counts={sourceCounts}
          />
        </div>
        <div className="flex items-baseline gap-3 flex-wrap">
          <span
            className="text-[10px] uppercase tracking-[0.18em] w-[6ch]"
            style={{ color: "var(--wire-mute)" }}
          >
            sort:
          </span>
          <WireTabs
            ariaLabel="Sort mode"
            options={SORT_OPTIONS}
            active={activeSort}
            onChange={setActiveSort}
          />
          <span className="ml-auto flex items-baseline gap-2">
            <button
              type="button"
              onClick={() =>
                setViewMode(viewMode === "tape" ? "section" : "tape")
              }
              aria-pressed={viewMode === "tape"}
              className="border px-2 py-1 text-[10px] uppercase tracking-[0.18em]"
              style={{
                borderColor: "var(--wire-rule)",
                color: viewMode === "tape" ? "var(--wire-bg)" : "var(--wire-fg)",
                background:
                  viewMode === "tape" ? "var(--wire-fg)" : "transparent",
              }}
              title="Toggle tape / section view (V)"
            >
              [{viewMode === "tape" ? "TAPE" : "SECTIONS"}]
            </button>
            {hiddenCount > 0 && (
              <button
                type="button"
                onClick={() => setShowHidden((v) => !v)}
                aria-pressed={showHidden}
                className="border px-2 py-1 text-[10px] uppercase tracking-[0.18em]"
                style={{
                  borderColor: "var(--wire-rule)",
                  color: showHidden ? "var(--wire-bg)" : "var(--wire-mute)",
                  background: showHidden ? "var(--wire-fg)" : "transparent",
                }}
                title="Show/hide muted transmissions"
              >
                [hidden {hiddenCount.toString().padStart(2, "0")}]
              </button>
            )}
            {hiddenCount > 0 && showHidden && (
              <button
                type="button"
                onClick={clearHidden}
                className="border px-2 py-1 text-[10px] uppercase tracking-[0.18em]"
                style={{
                  borderColor: "var(--wire-rule)",
                  color: "var(--wire-mute)",
                }}
                title="Unhide all"
              >
                [unhide all]
              </button>
            )}
            <button
              type="button"
              onClick={() => setHelpOpen(true)}
              className="border px-2 py-1 text-[10px] uppercase tracking-[0.18em]"
              style={{
                borderColor: "var(--wire-rule)",
                color: "var(--wire-mute)",
              }}
              title="Keyboard shortcuts (?)"
            >
              [?]
            </button>
            <WireForward items={visibleAfterHide} />
          </span>
        </div>
      </div>

      <WireSection
        label="watchlist · companies"
        meta={
          activeCompany ? `filter: ${activeCompany.toUpperCase()}` : "all actors"
        }
      >
        <WireWatchlist
          items={visibleAfterHide}
          activeCompany={activeCompany}
          onSelect={setActiveCompany}
        />
      </WireSection>

      <WireSection
        label="trending · concepts"
        meta={
          activeKeyword
            ? `filter: ${activeKeyword.toUpperCase()}`
            : "tech terms · models · paradigms"
        }
      >
        <WireKeywords
          keywords={keywords}
          activeTerm={activeKeyword}
          onSelect={setActiveKeyword}
        />
      </WireSection>

      {!hasFilters && quiet.length > 0 && (
        <WireSection
          label="quiet signal"
          meta="low engagement · high relevance"
        >
          <WireQuietLane items={quiet} />
        </WireSection>
      )}

      {viewMode === "section" ? (
        <>
          <WireSection
            label="models · launches"
            meta={`top ${launches.length} of ${
              visibleAfterHide.filter((i) => i.category === "product-launch")
                .length
            }`}
          >
            <WireTable
              columns={launchesColumns}
              rows={launchesRows}
              empty="No model releases this cycle."
            />
          </WireSection>

          <WireSection
            label="capital · funding"
            meta={`${capital.length} round${capital.length === 1 ? "" : "s"}`}
          >
            <WireTable
              columns={capitalColumns}
              rows={capitalRows}
              empty="No capital movement on the wire."
            />
          </WireSection>

          <WireSection label="research · arxiv" meta={`top ${research.length}`}>
            <WireTable
              columns={researchColumns}
              rows={researchRows}
              empty="No fresh research traffic."
            />
          </WireSection>
        </>
      ) : null}

      <WireSection
        label="wire · full feed"
        meta={`${filtered.length} entries · sort: ${activeSort.toUpperCase()}`}
      >
        <WireFeed
          items={filtered}
          bookmarkedIds={bookmarks}
          onBookmarkToggle={toggleBookmark}
          newSinceLastVisit={newSinceLastVisit}
          onHide={hide}
          focusedId={focusedId}
          onRowRef={onRowRef}
        />
      </WireSection>

      <WireShortcutsHelp open={helpOpen} onClose={() => setHelpOpen(false)} />
    </div>
  );
}
