import { NewsSource } from "@/lib/types";
import { SOURCE_LABELS } from "@/lib/constants";

const BADGE_STYLES: Record<string, string> = {
  hackernews: "bg-orange-100 text-orange-700 dark:bg-orange-500/15 dark:text-orange-400",
  reddit: "bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-400",
  rss: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400",
  arxiv: "bg-purple-100 text-purple-700 dark:bg-purple-500/15 dark:text-purple-400",
  twitter: "bg-neutral-100 text-neutral-700 dark:bg-neutral-500/15 dark:text-neutral-400",
};

export function SourceBadge({ source }: { source: NewsSource }) {
  const style = BADGE_STYLES[source] || BADGE_STYLES.rss;
  const label = SOURCE_LABELS[source] || source;

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-mono font-semibold tracking-wide uppercase ${style}`}
    >
      {label}
    </span>
  );
}
