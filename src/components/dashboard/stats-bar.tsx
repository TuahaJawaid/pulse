import { DashboardStats } from "@/lib/types";

export function StatsBar({ stats }: { stats: DashboardStats }) {
  const items = [
    { label: "Stories", value: stats.totalStories, accent: false },
    { label: "Funding Rounds", value: stats.fundingRounds, accent: true },
    { label: "Launches", value: stats.majorLaunches, accent: false },
    { label: "Research Papers", value: stats.researchPapers, accent: false },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
      {items.map((item) => (
        <div
          key={item.label}
          className={`rounded-2xl border p-6 transition-colors ${
            item.accent
              ? "bg-lime text-lime-foreground border-transparent"
              : "bg-card border-border"
          }`}
        >
          <div
            className={`text-4xl font-semibold tracking-tight font-mono tabular-nums ${
              item.accent ? "" : "text-foreground"
            }`}
          >
            {item.value}
          </div>
          <div
            className={`text-sm font-medium mt-2 ${
              item.accent ? "text-lime-foreground/70" : "text-muted-foreground"
            }`}
          >
            {item.label}
          </div>
        </div>
      ))}
    </div>
  );
}
