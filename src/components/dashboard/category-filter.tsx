"use client";

import { useMemo, useSyncExternalStore } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Bookmark, RotateCcw, Search } from "lucide-react";
import { NewsCategory, NewsItem, NewsSource, TimeGroup } from "@/lib/types";
import { SOURCE_LABELS } from "@/lib/constants";
import { groupByTime } from "@/lib/time-grouper";
import { getSignalScore } from "@/lib/signal-score";
import { CompanyWatchlist } from "@/components/watchlist/company-watchlist";
import { TimeGroupHeader } from "./time-group";
import { NewsCard } from "../feed/news-card";

const BOOKMARK_STORAGE_KEY = "pulse.savedStories";
const BOOKMARK_EVENT = "pulse-bookmarks";

const CATEGORIES: { value: NewsCategory | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "funding", label: "Funding & M&A" },
  { value: "product-launch", label: "Launches" },
  { value: "research", label: "Research" },
  { value: "policy", label: "Policy" },
  { value: "big-tech", label: "Big Tech" },
  { value: "open-source", label: "Open Source" },
];

const SOURCES: { value: NewsSource | "all"; label: string }[] = [
  { value: "all", label: "All Sources" },
  { value: "hackernews", label: SOURCE_LABELS.hackernews },
  { value: "reddit", label: SOURCE_LABELS.reddit },
  { value: "rss", label: SOURCE_LABELS.rss },
  { value: "arxiv", label: SOURCE_LABELS.arxiv },
];

const SORTS = [
  { value: "latest", label: "Latest" },
  { value: "signal", label: "Signal" },
  { value: "discussed", label: "Most Discussed" },
  { value: "score", label: "Top Score" },
] as const;

type SortMode = (typeof SORTS)[number]["value"];

function subscribeBookmarks(onStoreChange: () => void) {
  if (typeof window === "undefined") return () => {};

  const handler = () => onStoreChange();
  window.addEventListener("storage", handler);
  window.addEventListener(BOOKMARK_EVENT, handler);

  return () => {
    window.removeEventListener("storage", handler);
    window.removeEventListener(BOOKMARK_EVENT, handler);
  };
}

function getBookmarkSnapshot() {
  if (typeof window === "undefined") return "[]";
  return window.localStorage.getItem(BOOKMARK_STORAGE_KEY) || "[]";
}

function parseBookmarkSnapshot(snapshot: string): string[] {
  try {
    const value = JSON.parse(snapshot);
    return Array.isArray(value)
      ? value.filter((item): item is string => typeof item === "string")
      : [];
  } catch {
    return [];
  }
}

function isCategory(value: string | null): value is NewsCategory | "all" {
  return CATEGORIES.some((category) => category.value === value);
}

function isSource(value: string | null): value is NewsSource | "all" {
  return SOURCES.some((source) => source.value === value);
}

function isSortMode(value: string | null): value is SortMode {
  return SORTS.some((sort) => sort.value === value);
}

function storyText(item: NewsItem): string {
  return [
    item.title,
    item.summary,
    item.sourceDetail,
    item.category,
    ...item.companyTags,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

function compareByDate(a: NewsItem, b: NewsItem) {
  return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
}

export function CategoryFilter({ items }: { items: NewsItem[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const bookmarkSnapshot = useSyncExternalStore(
    subscribeBookmarks,
    getBookmarkSnapshot,
    () => "[]"
  );

  const bookmarkedIds = useMemo(
    () => new Set(parseBookmarkSnapshot(bookmarkSnapshot)),
    [bookmarkSnapshot]
  );

  const activeCategory = isCategory(searchParams.get("category"))
    ? searchParams.get("category")!
    : "all";
  const activeSource = isSource(searchParams.get("source"))
    ? searchParams.get("source")!
    : "all";
  const activeSort = isSortMode(searchParams.get("sort"))
    ? searchParams.get("sort")!
    : "latest";
  const activeCompany = searchParams.get("company") || null;
  const query = searchParams.get("q") || "";
  const savedOnly = searchParams.get("saved") === "1";

  const signalScores = useMemo(() => {
    return new Map(items.map((item) => [item.id, getSignalScore(item)]));
  }, [items]);

  const updateParam = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    const queryString = params.toString();
    router.replace(queryString ? `${pathname}?${queryString}` : pathname, {
      scroll: false,
    });
  };

  const clearFilters = () => {
    router.replace(pathname, { scroll: false });
  };

  const toggleBookmark = (id: string) => {
    const next = new Set(bookmarkedIds);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }

    window.localStorage.setItem(
      BOOKMARK_STORAGE_KEY,
      JSON.stringify(Array.from(next))
    );
    window.dispatchEvent(new Event(BOOKMARK_EVENT));
  };

  const queryItems = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return items;

    return items.filter((item) => storyText(item).includes(normalizedQuery));
  }, [items, query]);

  const sourceScopeItems = useMemo(() => {
    let scoped = queryItems;

    if (activeCompany) {
      scoped = scoped.filter((item) => item.companyTags.includes(activeCompany));
    }

    if (savedOnly) {
      scoped = scoped.filter((item) => bookmarkedIds.has(item.id));
    }

    return scoped;
  }, [activeCompany, bookmarkedIds, queryItems, savedOnly]);

  const sourceItems = useMemo(() => {
    return activeSource === "all"
      ? queryItems
      : queryItems.filter((item) => item.source === activeSource);
  }, [activeSource, queryItems]);

  const companyItems = useMemo(() => {
    return activeCompany
      ? sourceItems.filter((item) => item.companyTags.includes(activeCompany))
      : sourceItems;
  }, [activeCompany, sourceItems]);

  const savedItems = useMemo(() => {
    return savedOnly
      ? companyItems.filter((item) => bookmarkedIds.has(item.id))
      : companyItems;
  }, [bookmarkedIds, companyItems, savedOnly]);

  const categoryCounts = useMemo(() => {
    const counts = new Map<NewsCategory | "all", number>([
      ["all", savedItems.length],
    ]);

    for (const item of savedItems) {
      counts.set(item.category, (counts.get(item.category) || 0) + 1);
    }

    return counts;
  }, [savedItems]);

  const sourceCounts = useMemo(() => {
    const counts = new Map<NewsSource | "all", number>([
      ["all", sourceScopeItems.length],
    ]);

    for (const item of sourceScopeItems) {
      counts.set(item.source, (counts.get(item.source) || 0) + 1);
    }

    return counts;
  }, [sourceScopeItems]);

  const filtered = useMemo(() => {
    const categorized =
      activeCategory === "all"
        ? savedItems
        : savedItems.filter((item) => item.category === activeCategory);

    return [...categorized].sort((a, b) => {
      if (activeSort === "signal") {
        return (signalScores.get(b.id) || 0) - (signalScores.get(a.id) || 0);
      }

      if (activeSort === "discussed") {
        return (b.engagement.comments || 0) - (a.engagement.comments || 0);
      }

      if (activeSort === "score") {
        return (b.engagement.score || 0) - (a.engagement.score || 0);
      }

      return compareByDate(a, b);
    });
  }, [activeCategory, activeSort, savedItems, signalScores]);

  const timeGroups = groupByTime(filtered);

  return (
    <div>
      <div className="mb-4 rounded-xl border border-border bg-card p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <label className="relative flex min-w-0 flex-1 items-center">
            <Search className="pointer-events-none absolute left-3 h-4 w-4 text-muted-foreground" />
            <input
              value={query}
              onChange={(event) => updateParam("q", event.target.value)}
              placeholder="Search stories, companies, topics"
              className="h-10 w-full rounded-lg border border-border bg-background pl-9 pr-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-foreground/40"
            />
          </label>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={activeSort}
              onChange={(event) => updateParam("sort", event.target.value)}
              className="h-10 rounded-lg border border-border bg-background px-3 text-sm font-medium text-foreground outline-none transition-colors focus:border-foreground/40"
              aria-label="Sort stories"
            >
              {SORTS.map((sort) => (
                <option key={sort.value} value={sort.value}>
                  {sort.label}
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={() => updateParam("saved", savedOnly ? null : "1")}
              className={`inline-flex h-10 items-center gap-2 rounded-lg border px-3 text-sm font-medium transition-colors ${
                savedOnly
                  ? "border-transparent bg-foreground text-background"
                  : "border-border bg-background text-muted-foreground hover:bg-accent hover:text-foreground"
              }`}
            >
              <Bookmark className="h-4 w-4" />
              Saved
              {bookmarkedIds.size > 0 && (
                <span className="font-mono text-xs opacity-60">
                  {bookmarkedIds.size}
                </span>
              )}
            </button>

            {(query ||
              activeCategory !== "all" ||
              activeSource !== "all" ||
              activeSort !== "latest" ||
              activeCompany ||
              savedOnly) && (
              <button
                type="button"
                onClick={clearFilters}
                className="inline-flex h-10 items-center justify-center rounded-lg border border-border bg-background px-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        <div className="mt-4 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat.value;
            const count = categoryCounts.get(cat.value) || 0;

            if (cat.value !== "all" && count === 0) return null;

            return (
              <button
                type="button"
                key={cat.value}
                onClick={() =>
                  updateParam(
                    "category",
                    cat.value === "all" ? null : cat.value
                  )
                }
                className={`flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-foreground text-background"
                    : "bg-secondary text-muted-foreground hover:bg-accent hover:text-foreground"
                }`}
              >
                {cat.label}
                <span className="font-mono text-xs opacity-60">{count}</span>
              </button>
            );
          })}
        </div>

        <div className="mt-3 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {SOURCES.map((source) => {
            const isActive = activeSource === source.value;
            const count = sourceCounts.get(source.value) || 0;

            if (source.value !== "all" && count === 0) return null;

            return (
              <button
                type="button"
                key={source.value}
                onClick={() =>
                  updateParam(
                    "source",
                    source.value === "all" ? null : source.value
                  )
                }
                className={`flex shrink-0 items-center gap-2 rounded-md px-3 py-1.5 text-xs font-semibold uppercase tracking-wide transition-colors ${
                  isActive
                    ? "bg-lime text-lime-foreground"
                    : "bg-secondary text-muted-foreground hover:bg-accent hover:text-foreground"
                }`}
              >
                {source.label}
                <span className="font-mono opacity-60">{count}</span>
              </button>
            );
          })}
        </div>
      </div>

      <CompanyWatchlist
        items={sourceItems}
        activeCompany={activeCompany}
        onFilterChange={(company) => updateParam("company", company)}
      />

      <div className="mb-3 flex items-center justify-between px-1 text-xs font-mono uppercase tracking-widest text-muted-foreground">
        <span>{filtered.length.toLocaleString()} Stories</span>
        <span>{activeSort}</span>
      </div>

      <div className="space-y-2">
        {Array.from(timeGroups.entries()).map(([group, groupItems]) => (
          <div key={group}>
            <TimeGroupHeader group={group as TimeGroup} />
            <div className="space-y-2">
              {groupItems.map((item) => (
                <NewsCard
                  key={item.id}
                  item={item}
                  signalScore={signalScores.get(item.id)}
                  isBookmarked={bookmarkedIds.has(item.id)}
                  onBookmarkToggle={toggleBookmark}
                />
              ))}
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="flex items-center justify-center rounded-xl border border-border bg-card px-6 py-20 text-center text-base text-muted-foreground">
            No stories match the current filters.
          </div>
        )}
      </div>
    </div>
  );
}
