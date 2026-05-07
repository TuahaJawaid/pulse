import { AggregatedData, DashboardStats, NewsItem } from "./types";
import { fetchHackerNews } from "./sources/hackernews";
import { fetchReddit } from "./sources/reddit";
import { fetchRSSFeeds } from "./sources/rss";
import { fetchArxiv } from "./sources/arxiv";
import { categorizeItem } from "./categorizer";
import { matchCompanies } from "./company-matcher";
import { threadStories } from "./story-threader";
import { getSignalScore } from "./signal-score";

function deduplicateByUrl(items: NewsItem[]): NewsItem[] {
  const seen = new Set<string>();
  return items.filter((item) => {
    const normalized = item.url
      .replace(/^https?:\/\/(www\.)?/, "")
      .replace(/\/$/, "")
      .replace(/[?#].*$/, "");
    if (seen.has(normalized)) return false;
    seen.add(normalized);
    return true;
  });
}

function computeStats(items: NewsItem[]): DashboardStats {
  return {
    totalStories: items.length,
    hotSignals: items.filter((i) => (i.signalScore ?? 0) >= 75).length,
    majorLaunches: items.filter((i) => i.category === "product-launch").length,
    researchPapers: items.filter((i) => i.source === "arxiv").length,
  };
}

export async function aggregateNews(): Promise<AggregatedData> {
  const [hn, reddit, rss, arxiv] = await Promise.allSettled([
    fetchHackerNews(),
    fetchReddit(),
    fetchRSSFeeds(),
    fetchArxiv(),
  ]);

  let items: NewsItem[] = [
    ...(hn.status === "fulfilled" ? hn.value : []),
    ...(reddit.status === "fulfilled" ? reddit.value : []),
    ...(rss.status === "fulfilled" ? rss.value : []),
    ...(arxiv.status === "fulfilled" ? arxiv.value : []),
  ];

  // Pipeline: categorize → tag companies → dedupe → thread → score → sort
  items = items.map(categorizeItem).map(matchCompanies);
  items = deduplicateByUrl(items);
  items = threadStories(items);
  items = items.map((item) => ({ ...item, signalScore: getSignalScore(item) }));
  items.sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  const stats = computeStats(items);

  const sourceCounts = items.reduce(
    (acc, item) => {
      acc[item.source] = (acc[item.source] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );
  console.log("[Pulse] Aggregated:", sourceCounts, `Total: ${items.length}`);

  return { items, stats };
}
