"use client";

import { useMemo, useState } from "react";
import { NewsItem } from "@/lib/types";
import { X } from "lucide-react";

export function CompanyWatchlist({
  items,
  activeCompany,
  onFilterChange,
}: {
  items: NewsItem[];
  activeCompany?: string | null;
  onFilterChange: (company: string | null) => void;
}) {
  const [internalCompany, setInternalCompany] = useState<string | null>(null);
  const selectedCompany =
    activeCompany === undefined ? internalCompany : activeCompany;

  const companyCounts = useMemo(() => {
    const counts = new Map<string, number>();

    for (const item of items) {
      for (const tag of item.companyTags) {
        counts.set(tag, (counts.get(tag) || 0) + 1);
      }
    }

    return Array.from(counts.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  }, [items]);

  const setCompany = (company: string | null) => {
    if (activeCompany === undefined) {
      setInternalCompany(company);
    }
    onFilterChange(company);
  };

  if (companyCounts.length === 0) return null;

  return (
    <div className="mb-4 flex items-center gap-1.5 overflow-x-auto rounded-xl border border-border bg-card px-4 py-3 scrollbar-none">
      <span className="mr-2 shrink-0 text-[10px] font-mono font-semibold uppercase tracking-widest text-muted-foreground">
        Trending Companies
      </span>
      {selectedCompany && (
        <button
          type="button"
          onClick={() => setCompany(null)}
          className="flex shrink-0 items-center gap-1 rounded-md border border-border bg-secondary px-2.5 py-1 text-[11px] font-mono text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
        >
          Clear
          <X className="h-3 w-3" />
        </button>
      )}
      {companyCounts.slice(0, 10).map((company) => {
        const isActive = selectedCompany === company.name;
        return (
          <button
            type="button"
            key={company.name}
            onClick={() => {
              const next = isActive ? null : company.name;
              setCompany(next);
            }}
            className={`flex shrink-0 items-center gap-1.5 rounded-md px-2.5 py-1 text-[11px] font-medium transition-colors ${
              isActive
                ? "bg-foreground text-background"
                : "bg-secondary text-muted-foreground hover:bg-accent hover:text-foreground"
            }`}
          >
            {company.name}
            <span className="font-mono text-[10px] opacity-60">
              {company.count}
            </span>
          </button>
        );
      })}
    </div>
  );
}
