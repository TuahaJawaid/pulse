import { NewsItem } from "@/lib/types";
import { SourceBadge } from "./source-badge";
import { formatDistanceToNow } from "date-fns";

function EngagementMetrics({
  score,
  comments,
}: {
  score: number | null;
  comments: number | null;
}) {
  if (score === null && comments === null) return null;

  return (
    <div className="flex items-center gap-3 font-mono text-[11px] text-zinc-500">
      {score !== null && (
        <span className="flex items-center gap-1">
          <svg
            className="w-3 h-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 15l7-7 7 7"
            />
          </svg>
          {score.toLocaleString()}
        </span>
      )}
      {comments !== null && (
        <span className="flex items-center gap-1">
          <svg
            className="w-3 h-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
          {comments.toLocaleString()}
        </span>
      )}
    </div>
  );
}

export function NewsCard({ item }: { item: NewsItem }) {
  const timeAgo = formatDistanceToNow(new Date(item.timestamp), {
    addSuffix: true,
  });

  return (
    <article className="group flex gap-3 px-6 py-4 border-b border-zinc-800/50 hover:bg-zinc-900/50 transition-colors">
      <div className="flex-shrink-0 pt-0.5">
        <SourceBadge source={item.source} />
      </div>

      <div className="flex-1 min-w-0 space-y-1.5">
        <div className="flex items-start justify-between gap-4">
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-zinc-100 leading-snug hover:text-white group-hover:underline underline-offset-2 decoration-zinc-700"
          >
            {item.title}
          </a>
        </div>

        {item.summary && (
          <p className="text-xs text-zinc-500 leading-relaxed line-clamp-2">
            {item.summary}
          </p>
        )}

        {item.whyThisMatters && (
          <div className="flex items-start gap-1.5 mt-1">
            <span className="text-amber-500/70 text-[10px] font-mono font-medium uppercase tracking-wider shrink-0 pt-px">
              Signal
            </span>
            <p className="text-xs text-amber-200/60 italic leading-relaxed">
              {item.whyThisMatters}
            </p>
          </div>
        )}

        <div className="flex items-center gap-3 pt-0.5">
          <span className="text-[11px] text-zinc-600 font-mono">
            {item.sourceDetail}
          </span>
          <span className="text-zinc-800">·</span>
          <span className="text-[11px] text-zinc-600 font-mono">{timeAgo}</span>

          {item.companyTags.length > 0 && (
            <>
              <span className="text-zinc-800">·</span>
              <div className="flex items-center gap-1.5">
                {item.companyTags.map((tag) => (
                  <span
                    key={tag}
                    className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-zinc-800 text-zinc-400"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </>
          )}

          <div className="ml-auto">
            <EngagementMetrics
              score={item.engagement.score}
              comments={item.engagement.comments}
            />
          </div>
        </div>
      </div>
    </article>
  );
}
