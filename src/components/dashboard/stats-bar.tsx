import { DashboardStats } from "@/lib/types";

export function StatsBar({ stats }: { stats: DashboardStats }) {
  return (
    <div className="flex items-center gap-6 px-6 py-3 border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-sm font-mono text-xs tabular-nums">
      <div className="flex items-center gap-2">
        <span className="text-zinc-500">Stories</span>
        <span className="text-zinc-100 font-medium">{stats.totalStories}</span>
      </div>
      <div className="w-px h-3 bg-zinc-800" />
      <div className="flex items-center gap-2">
        <span className="text-emerald-500/80">Funding</span>
        <span className="text-zinc-100 font-medium">{stats.fundingRounds}</span>
      </div>
      <div className="w-px h-3 bg-zinc-800" />
      <div className="flex items-center gap-2">
        <span className="text-amber-500/80">Launches</span>
        <span className="text-zinc-100 font-medium">{stats.majorLaunches}</span>
      </div>
      <div className="w-px h-3 bg-zinc-800" />
      <div className="flex items-center gap-2">
        <span className="text-purple-500/80">Papers</span>
        <span className="text-zinc-100 font-medium">{stats.researchPapers}</span>
      </div>
      <div className="ml-auto text-zinc-600">
        Updated {new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}
      </div>
    </div>
  );
}
