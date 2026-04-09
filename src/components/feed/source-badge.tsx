import { NewsSource } from "@/lib/types";
import { SOURCE_COLORS, SOURCE_LABELS } from "@/lib/constants";

export function SourceBadge({ source }: { source: NewsSource }) {
  const colors = SOURCE_COLORS[source] || SOURCE_COLORS.rss;
  const label = SOURCE_LABELS[source] || source;

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-medium tracking-wide uppercase ${colors.bg} ${colors.text}`}
    >
      {label}
    </span>
  );
}
