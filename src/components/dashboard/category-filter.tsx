"use client";

import { useState } from "react";
import { NewsCategory, NewsItem, TimeGroup } from "@/lib/types";
import { groupByTime, TIME_GROUP_LABELS } from "@/lib/time-grouper";
import { TimeGroupHeader } from "./time-group";
import { NewsCard } from "../feed/news-card";

const CATEGORIES: { value: NewsCategory | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "funding", label: "Funding & M&A" },
  { value: "product-launch", label: "Launches" },
  { value: "research", label: "Research" },
  { value: "policy", label: "Policy" },
  { value: "big-tech", label: "Big Tech" },
  { value: "open-source", label: "Open Source" },
];

export function CategoryFilter({ items }: { items: NewsItem[] }) {
  const [activeCategory, setActiveCategory] = useState<NewsCategory | "all">(
    "all"
  );

  const filtered =
    activeCategory === "all"
      ? items
      : items.filter((item) => item.category === activeCategory);

  const timeGroups = groupByTime(filtered);

  return (
    <div>
      {/* Category tabs */}
      <div className="flex items-center gap-2 mb-5 overflow-x-auto scrollbar-none pb-1">
        {CATEGORIES.map((cat) => {
          const isActive = activeCategory === cat.value;
          const count =
            cat.value === "all"
              ? items.length
              : items.filter((i) => i.category === cat.value).length;

          if (cat.value !== "all" && count === 0) return null;

          return (
            <button
              key={cat.value}
              onClick={() => setActiveCategory(cat.value)}
              className={`shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-colors ${
                isActive
                  ? "bg-foreground text-background"
                  : "bg-secondary text-muted-foreground hover:text-foreground hover:bg-accent"
              }`}
            >
              {cat.label}
              <span
                className={`font-mono text-xs ${
                  isActive ? "opacity-60" : "opacity-50"
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Grouped feed */}
      <div className="space-y-2">
        {Array.from(timeGroups.entries()).map(([group, groupItems]) => (
          <div key={group}>
            <TimeGroupHeader group={group as TimeGroup} />
            <div className="space-y-2">
              {groupItems.map((item) => (
                <NewsCard key={item.id} item={item} />
              ))}
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="flex items-center justify-center py-20 text-base text-muted-foreground rounded-2xl border border-border bg-card">
            No stories in this category right now.
          </div>
        )}
      </div>
    </div>
  );
}
