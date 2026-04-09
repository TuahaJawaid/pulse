import { NewsItem } from "../types";
import { RSS_FEEDS, AI_KEYWORDS } from "../constants";
import Parser from "rss-parser";

const parser = new Parser({
  timeout: 10000,
  headers: {
    "User-Agent": "PulseAINews/1.0",
    Accept: "application/rss+xml, application/xml, text/xml",
  },
});

function isAIRelated(title: string, content?: string): boolean {
  const text = `${title} ${content || ""}`.toLowerCase();
  return AI_KEYWORDS.some((kw) => text.includes(kw));
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "").replace(/&[^;]+;/g, " ").trim();
}

async function fetchFeed(
  feedUrl: string,
  feedName: string
): Promise<NewsItem[]> {
  try {
    const feed = await parser.parseURL(feedUrl);

    return (feed.items || [])
      .filter((item) => isAIRelated(item.title || "", item.contentSnippet))
      .slice(0, 15)
      .map((item, i) => {
        const summary = item.contentSnippet
          ? stripHtml(item.contentSnippet).slice(0, 250)
          : item.content
            ? stripHtml(item.content).slice(0, 250)
            : null;

        return {
          id: `rss_${feedName.toLowerCase().replace(/\s+/g, "")}_${i}`,
          title: item.title || "Untitled",
          summary: summary ? summary + (summary.length >= 250 ? "..." : "") : null,
          url: item.link || "#",
          source: "rss" as const,
          sourceDetail: feedName,
          timestamp: item.isoDate || new Date().toISOString(),
          category: "general" as const,
          companyTags: [],
          engagement: { score: null, comments: null },
          whyThisMatters: null,
          imageUrl: null,
        };
      });
  } catch {
    console.warn(`Failed to fetch RSS feed: ${feedName} (${feedUrl})`);
    return [];
  }
}

export async function fetchRSSFeeds(): Promise<NewsItem[]> {
  const results = await Promise.allSettled(
    RSS_FEEDS.map((feed) => fetchFeed(feed.url, feed.name))
  );

  return results.flatMap((r) => (r.status === "fulfilled" ? r.value : []));
}
