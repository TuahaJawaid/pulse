"use client";

import { FundingRound } from "@/lib/types";

export function FundingTicker({ rounds }: { rounds: FundingRound[] }) {
  if (rounds.length === 0) return null;

  const items = [...rounds, ...rounds];

  return (
    <div className="relative overflow-hidden rounded-2xl border border-border bg-card mb-6">
      <div className="flex items-center">
        <div className="shrink-0 px-4 py-3 border-r border-border bg-lime/10">
          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-lime-foreground dark:text-lime">
            Funding
          </span>
        </div>
        <div className="overflow-hidden flex-1">
          <div className="flex animate-marquee hover:[animation-play-state:paused]">
            {items.map((round, i) => (
              <a
                key={`${round.company}-${i}`}
                href={round.url}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 flex items-center gap-3 px-5 py-3.5 text-sm hover:bg-accent transition-colors"
              >
                <span className="font-medium text-foreground">
                  {round.company}
                </span>
                <span className="font-mono font-semibold text-lime-foreground dark:text-lime">
                  {round.amount}
                </span>
                <span className="text-muted-foreground">
                  {round.investors.slice(0, 2).join(", ")}
                </span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
