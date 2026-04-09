import { NewsItem } from "../types";
import { AI_KEYWORDS } from "../constants";

interface HNItem {
  id: number;
  title: string;
  url?: string;
  score: number;
  descendants?: number;
  time: number;
  by: string;
  text?: string;
}

function isAIRelated(title: string): boolean {
  const lower = title.toLowerCase();
  return AI_KEYWORDS.some((kw) => lower.includes(kw));
}

export async function fetchHackerNews(): Promise<NewsItem[]> {
  const res = await fetch(
    "https://hacker-news.firebaseio.com/v0/topstories.json",
    { next: { revalidate: 300 } }
  );
  if (!res.ok) return [];

  const ids: number[] = await res.json();
  const top50 = ids.slice(0, 50);

  const items = await Promise.allSettled(
    top50.map(async (id) => {
      const r = await fetch(
        `https://hacker-news.firebaseio.com/v0/item/${id}.json`,
        { next: { revalidate: 300 } }
      );
      if (!r.ok) return null;
      return r.json() as Promise<HNItem>;
    })
  );

  return items
    .map((r) => (r.status === "fulfilled" ? r.value : null))
    .filter((item): item is HNItem => item !== null && isAIRelated(item.title))
    .map((item) => ({
      id: `hn_${item.id}`,
      title: item.title,
      summary: null,
      url: item.url || `https://news.ycombinator.com/item?id=${item.id}`,
      source: "hackernews" as const,
      sourceDetail: "Hacker News",
      timestamp: new Date(item.time * 1000).toISOString(),
      category: "general" as const,
      companyTags: [],
      engagement: {
        score: item.score,
        comments: item.descendants ?? null,
      },
      whyThisMatters: null,
      imageUrl: null,
    }));
}
