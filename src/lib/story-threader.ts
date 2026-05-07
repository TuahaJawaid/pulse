import { NewsItem, RelatedSource } from "./types";

const STOPWORDS = new Set([
  "the", "a", "an", "and", "or", "but", "of", "to", "in", "on", "at", "for",
  "is", "are", "was", "were", "be", "been", "being", "with", "by", "from",
  "as", "it", "its", "this", "that", "these", "those", "has", "have", "had",
  "will", "would", "could", "should", "can", "may", "might", "new", "now",
  "how", "why", "what", "when", "who", "your", "you", "we", "us", "our",
  "their", "his", "her", "i", "me", "my", "if", "so", "do", "does", "did",
  "than", "then", "into", "about", "over", "after", "before", "up", "down",
  "out", "off", "again", "more", "most", "some", "any", "all", "no", "not",
  "show", "hn", "ask", "tell", "video", "blog", "post", "via",
]);

function tokenize(text: string): Set<string> {
  return new Set(
    text
      .toLowerCase()
      .replace(/[^\p{L}\p{N}\s-]/gu, " ")
      .split(/\s+/)
      .filter((w) => w.length > 2 && !STOPWORDS.has(w))
  );
}

function jaccard(a: Set<string>, b: Set<string>): number {
  if (a.size === 0 || b.size === 0) return 0;
  let intersection = 0;
  for (const w of a) if (b.has(w)) intersection++;
  const union = a.size + b.size - intersection;
  return union === 0 ? 0 : intersection / union;
}

const SIMILARITY_THRESHOLD = 0.55;

function authorityScore(item: NewsItem): number {
  const sourceWeight = { rss: 4, hackernews: 3, arxiv: 3, reddit: 1, twitter: 1 }[item.source] ?? 0;
  const eng =
    (item.engagement.score ?? 0) +
    (item.engagement.comments ?? 0) * 2;
  return sourceWeight * 100 + eng;
}

export function threadStories(items: NewsItem[]): NewsItem[] {
  const tokenCache = new Map<string, Set<string>>();
  const get = (item: NewsItem) => {
    let t = tokenCache.get(item.id);
    if (!t) {
      t = tokenize(`${item.title} ${item.summary ?? ""}`);
      tokenCache.set(item.id, t);
    }
    return t;
  };

  // Sort by authority so canonical card is the "best" representative
  const sorted = [...items].sort((a, b) => authorityScore(b) - authorityScore(a));

  const used = new Set<string>();
  const threads: NewsItem[] = [];

  for (const canonical of sorted) {
    if (used.has(canonical.id)) continue;
    used.add(canonical.id);

    const cTokens = get(canonical);
    if (cTokens.size < 3) {
      threads.push(canonical);
      continue;
    }

    const related: RelatedSource[] = [];
    for (const other of sorted) {
      if (used.has(other.id)) continue;
      if (other.source === canonical.source && other.sourceDetail === canonical.sourceDetail) {
        // same source/detail combo — don't merge (would lose individual stories like multiple HN posts)
        continue;
      }
      const score = jaccard(cTokens, get(other));
      if (score >= SIMILARITY_THRESHOLD) {
        used.add(other.id);
        related.push({
          source: other.source,
          sourceDetail: other.sourceDetail,
          url: other.url,
          id: other.id,
        });
      }
    }

    threads.push(related.length > 0 ? { ...canonical, relatedSources: related } : canonical);
  }

  return threads;
}
