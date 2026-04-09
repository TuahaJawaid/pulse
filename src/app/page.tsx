import { aggregateNews } from "@/lib/aggregator";
import { StatsBar } from "@/components/dashboard/stats-bar";
import { FundingTicker } from "@/components/dashboard/funding-ticker";
import { ExecutiveSummary } from "@/components/dashboard/executive-summary";
import { CategoryFilter } from "@/components/dashboard/category-filter";
import { ThemeToggle } from "@/components/theme-toggle";

export const revalidate = 300;

export default async function Home() {
  const { items, stats, funding } = await aggregateNews();

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur-lg">
        <div className="max-w-[1400px] mx-auto flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-lime text-lime-foreground font-bold text-sm">
              P
            </div>
            <h1 className="text-lg font-medium tracking-tight">Pulse</h1>
            <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground border border-border rounded-full px-2 py-0.5">
              AI Intelligence
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden sm:block text-[11px] font-mono text-muted-foreground">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </span>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Hero: Stats + Funding in bento grid */}
      <section className="max-w-[1400px] w-full mx-auto px-6 py-6">
        <StatsBar stats={stats} />
        <FundingTicker rounds={funding} />
      </section>

      {/* Main Content */}
      <main className="flex-1 max-w-[1400px] w-full mx-auto px-6 pb-8">
        <ExecutiveSummary items={items} />
        <CategoryFilter items={items} />
      </main>

      {/* Footer */}
      <footer className="border-t border-border">
        <div className="max-w-[1400px] mx-auto flex items-center justify-between px-6 py-4 text-[11px] font-mono text-muted-foreground">
          <span>Pulse — AI News Intelligence</span>
          <span>Sources: Hacker News, Reddit, RSS, ArXiv</span>
        </div>
      </footer>
    </div>
  );
}
