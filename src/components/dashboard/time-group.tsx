import { TimeGroup } from "@/lib/types";
import { TIME_GROUP_LABELS } from "@/lib/time-grouper";

export function TimeGroupHeader({ group }: { group: TimeGroup }) {
  return (
    <div className="flex items-center gap-3 py-3 px-1">
      <span className="text-[11px] font-mono font-semibold uppercase tracking-widest text-muted-foreground">
        {TIME_GROUP_LABELS[group]}
      </span>
      <div className="flex-1 h-px bg-border" />
    </div>
  );
}
