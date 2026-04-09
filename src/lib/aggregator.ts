import { AggregatedData, DashboardStats, NewsItem, FundingRound } from "./types";
import { fetchHackerNews } from "./sources/hackernews";
import { fetchReddit } from "./sources/reddit";
import { fetchRSSFeeds } from "./sources/rss";
import { fetchArxiv } from "./sources/arxiv";
import { fetchFunding } from "./sources/funding";
import { categorizeItem } from "./categorizer";
import { matchCompanies } from "./company-matcher";

function deduplicateByUrl(items: NewsItem[]): NewsItem[] {
  const seen = new Set<string>();
  return items.filter((item) => {
    // Normalize URL for dedup
    const normalized = item.url
      .replace(/^https?:\/\/(www\.)?/, "")
      .replace(/\/$/, "");
    if (seen.has(normalized)) return false;
    seen.add(normalized);
    return true;
  });
}

function computeStats(
  items: NewsItem[],
  funding: FundingRound[]
): DashboardStats {
  return {
    totalStories: items.length,
    fundingRounds: funding.length,
    majorLaunches: items.filter((i) => i.category === "product-launch").length,
    researchPapers: items.filter((i) => i.source === "arxiv").length,
  };
}

export async function aggregateNews(): Promise<AggregatedData> {
  const [hn, reddit, rss, arxiv, funding] = await Promise.allSettled([
    fetchHackerNews(),
    fetchReddit(),
    fetchRSSFeeds(),
    fetchArxiv(),
    fetchFunding(),
  ]);

  // Collect fulfilled results, gracefully degrade on failures
  let items: NewsItem[] = [
    ...(hn.status === "fulfilled" ? hn.value : []),
    ...(reddit.status === "fulfilled" ? reddit.value : []),
    ...(rss.status === "fulfilled" ? rss.value : []),
    ...(arxiv.status === "fulfilled" ? arxiv.value : []),
  ];

  const fundingData: FundingRound[] =
    funding.status === "fulfilled" ? funding.value : [];

  // Pipeline: categorize → tag companies → sort → deduplicate
  items = items.map(categorizeItem).map(matchCompanies);
  items.sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
  items = deduplicateByUrl(items);

  const stats = computeStats(items, fundingData);

  // Log source counts for debugging
  const sourceCounts = items.reduce(
    (acc, item) => {
      acc[item.source] = (acc[item.source] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );
  console.log("[Pulse] Aggregated news:", sourceCounts, `Total: ${items.length}`);

  return { items, stats, funding: fundingData };
}
