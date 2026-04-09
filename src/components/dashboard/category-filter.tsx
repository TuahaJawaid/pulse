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
  const [activeCategory, setActiveCategory] = useState<
    NewsCategory | "all"
  >("all");

  const filtered =
    activeCategory === "all"
      ? items
      : items.filter((item) => item.category === activeCategory);

  const timeGroups = groupByTime(filtered);

  return (
    <div>
      {/* Category tabs */}
      <div className="sticky top-0 z-20 flex items-center gap-1 px-6 py-3 bg-zinc-950/95 backdrop-blur-sm border-b border-zinc-800 overflow-x-auto scrollbar-none">
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
              className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                isActive
                  ? "bg-zinc-800 text-zinc-100"
                  : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900"
              }`}
            >
              {cat.label}
              <span
                className={`font-mono text-[10px] ${
                  isActive ? "text-zinc-400" : "text-zinc-600"
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Grouped feed */}
      <div>
        {Array.from(timeGroups.entries()).map(([group, groupItems]) => (
          <div key={group}>
            <TimeGroupHeader group={group as TimeGroup} />
            {groupItems.map((item) => (
              <NewsCard key={item.id} item={item} />
            ))}
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="flex items-center justify-center py-20 text-sm text-zinc-600">
            No stories in this category right now.
          </div>
        )}
      </div>
    </div>
  );
}
