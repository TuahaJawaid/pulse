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
    <div className="flex items-center gap-3 font-mono text-[11px] text-muted-foreground">
      {score !== null && (
        <span className="flex items-center gap-1">
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
          </svg>
          {score.toLocaleString()}
        </span>
      )}
      {comments !== null && (
        <span className="flex items-center gap-1">
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
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
    <article className="group rounded-xl border border-border bg-card p-4 hover:shadow-sm transition-all">
      <div className="flex gap-3">
        <div className="flex-shrink-0 pt-0.5">
          <SourceBadge source={item.source} />
        </div>

        <div className="flex-1 min-w-0 space-y-2">
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium leading-snug text-foreground hover:underline underline-offset-2 decoration-border"
          >
            {item.title}
          </a>

          {item.summary && (
            <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
              {item.summary}
            </p>
          )}

          {item.whyThisMatters && (
            <div className="flex items-start gap-1.5 px-3 py-2 rounded-lg bg-lime/10 border border-lime/20">
              <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-lime-foreground dark:text-lime shrink-0 pt-px">
                Signal
              </span>
              <p className="text-xs text-foreground/70 leading-relaxed">
                {item.whyThisMatters}
              </p>
            </div>
          )}

          <div className="flex items-center gap-3 pt-0.5 flex-wrap">
            <span className="text-[11px] text-muted-foreground font-mono">
              {item.sourceDetail}
            </span>
            <span className="text-border">·</span>
            <span className="text-[11px] text-muted-foreground font-mono">
              {timeAgo}
            </span>

            {item.companyTags.length > 0 && (
              <>
                <span className="text-border">·</span>
                <div className="flex items-center gap-1.5">
                  {item.companyTags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-secondary text-muted-foreground"
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
      </div>
    </article>
  );
}
