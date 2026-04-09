"use client";

import { FundingRound } from "@/lib/types";

export function FundingTicker({ rounds }: { rounds: FundingRound[] }) {
  if (rounds.length === 0) return null;

  // Double the items for seamless loop
  const items = [...rounds, ...rounds];

  return (
    <div className="relative overflow-hidden border-b border-zinc-800 bg-zinc-950">
      <div className="flex items-center">
        <div className="shrink-0 px-3 py-2 bg-emerald-500/10 border-r border-zinc-800">
          <span className="text-[10px] font-mono font-medium uppercase tracking-wider text-emerald-400">
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
                className="shrink-0 flex items-center gap-2 px-4 py-2 text-xs hover:bg-zinc-900/50 transition-colors"
              >
                <span className="font-medium text-zinc-200">
                  {round.company}
                </span>
                <span className="font-mono text-emerald-400">
                  {round.amount}
                </span>
                <span className="text-zinc-600">
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
