import { aggregateNews } from "@/lib/aggregator";
import { StatsBar } from "@/components/dashboard/stats-bar";
import { FundingTicker } from "@/components/dashboard/funding-ticker";
import { ExecutiveSummary } from "@/components/dashboard/executive-summary";
import { CategoryFilter } from "@/components/dashboard/category-filter";

export const revalidate = 300; // ISR: revalidate every 5 minutes

export default async function Home() {
  const { items, stats, funding } = await aggregateNews();

  return (
    <div className="flex flex-col min-h-screen bg-zinc-950">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-zinc-800">
        <div className="flex items-center gap-3">
          <h1 className="text-lg font-medium tracking-tight text-zinc-100">
            Pulse
          </h1>
          <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-600 border border-zinc-800 rounded px-1.5 py-0.5">
            AI Intelligence
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-[11px] font-mono text-zinc-600">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </span>
        </div>
      </header>

      {/* Stats Bar */}
      <StatsBar stats={stats} />

      {/* Funding Ticker */}
      <FundingTicker rounds={funding} />

      {/* Main Content */}
      <main className="flex-1 max-w-[1400px] w-full mx-auto">
        {/* Executive Summary */}
        <ExecutiveSummary items={items} />

        {/* Feed with category filter */}
        <CategoryFilter items={items} />
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-800 px-6 py-3">
        <div className="flex items-center justify-between text-[10px] font-mono text-zinc-700">
          <span>Pulse — AI News Intelligence</span>
          <span>
            Sources: Hacker News, Reddit, RSS, ArXiv
          </span>
        </div>
      </footer>
    </div>
  );
}
