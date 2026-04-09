"use client";

import { useState } from "react";
import { NewsItem } from "@/lib/types";

interface CompanyCount {
  name: string;
  count: number;
}

export function CompanyWatchlist({
  items,
  onFilterChange,
}: {
  items: NewsItem[];
  onFilterChange: (company: string | null) => void;
}) {
  const [activeCompany, setActiveCompany] = useState<string | null>(null);

  // Count mentions per company
  const companyCounts: CompanyCount[] = [];
  const seen = new Set<string>();

  for (const item of items) {
    for (const tag of item.companyTags) {
      if (!seen.has(tag)) {
        seen.add(tag);
        companyCounts.push({
          name: tag,
          count: items.filter((i) => i.companyTags.includes(tag)).length,
        });
      }
    }
  }

  companyCounts.sort((a, b) => b.count - a.count);

  if (companyCounts.length === 0) return null;

  return (
    <div className="flex items-center gap-1.5 px-6 py-3 border-b border-zinc-800 overflow-x-auto scrollbar-none">
      <span className="shrink-0 text-[10px] font-mono font-medium uppercase tracking-wider text-zinc-600 mr-2">
        Watchlist
      </span>
      {activeCompany && (
        <button
          onClick={() => {
            setActiveCompany(null);
            onFilterChange(null);
          }}
          className="shrink-0 flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-mono bg-zinc-800 text-zinc-300 hover:bg-zinc-700 transition-colors"
        >
          Clear
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
      {companyCounts.slice(0, 10).map((company) => {
        const isActive = activeCompany === company.name;
        return (
          <button
            key={company.name}
            onClick={() => {
              const next = isActive ? null : company.name;
              setActiveCompany(next);
              onFilterChange(next);
            }}
            className={`shrink-0 flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
              isActive
                ? "bg-zinc-700 text-zinc-100"
                : "bg-zinc-900 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800"
            }`}
          >
            {company.name}
            <span className="font-mono text-[10px] text-zinc-500">
              {company.count}
            </span>
          </button>
        );
      })}
    </div>
  );
}
