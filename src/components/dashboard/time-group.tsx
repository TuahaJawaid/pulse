import { TimeGroup } from "@/lib/types";
import { TIME_GROUP_LABELS } from "@/lib/time-grouper";

export function TimeGroupHeader({ group }: { group: TimeGroup }) {
  return (
    <div className="sticky top-0 z-10 flex items-center gap-3 px-6 py-2 bg-zinc-950/95 backdrop-blur-sm border-b border-zinc-800/50">
      <span className="text-[11px] font-mono font-medium uppercase tracking-widest text-zinc-500">
        {TIME_GROUP_LABELS[group]}
      </span>
      <div className="flex-1 h-px bg-zinc-800/50" />
    </div>
  );
}
