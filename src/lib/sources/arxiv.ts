import { NewsItem } from "../types";

interface ArxivEntry {
  title: string;
  summary: string;
  id: string;
  published: string;
  authors: string[];
}

function parseArxivXml(xml: string): ArxivEntry[] {
  const entries: ArxivEntry[] = [];
  const entryRegex = /<entry>([\s\S]*?)<\/entry>/g;
  let match;

  while ((match = entryRegex.exec(xml)) !== null) {
    const entry = match[1];

    const title = entry.match(/<title>([\s\S]*?)<\/title>/)?.[1]?.replace(/\s+/g, " ").trim() || "";
    const summary = entry.match(/<summary>([\s\S]*?)<\/summary>/)?.[1]?.replace(/\s+/g, " ").trim() || "";
    const id = entry.match(/<id>([\s\S]*?)<\/id>/)?.[1]?.trim() || "";
    const published = entry.match(/<published>([\s\S]*?)<\/published>/)?.[1]?.trim() || "";

    const authors: string[] = [];
    const authorRegex = /<author>\s*<name>([\s\S]*?)<\/name>/g;
    let authorMatch;
    while ((authorMatch = authorRegex.exec(entry)) !== null) {
      authors.push(authorMatch[1].trim());
    }

    entries.push({ title, summary, id, published, authors });
  }

  return entries;
}

export async function fetchArxiv(): Promise<NewsItem[]> {
  const query = encodeURIComponent("cat:cs.AI OR cat:cs.LG OR cat:cs.CL");
  const res = await fetch(
    `https://export.arxiv.org/api/query?search_query=${query}&sortBy=submittedDate&sortOrder=descending&max_results=20`,
    { next: { revalidate: 300 } }
  );

  if (!res.ok) return [];

  const xml = await res.text();
  const entries = parseArxivXml(xml);

  return entries.map((entry) => {
    const arxivId = entry.id.split("/abs/").pop() || entry.id;
    const truncatedSummary = entry.summary.slice(0, 250);

    return {
      id: `arxiv_${arxivId}`,
      title: entry.title,
      summary: truncatedSummary + (entry.summary.length > 250 ? "..." : ""),
      url: entry.id,
      source: "arxiv" as const,
      sourceDetail: `ArXiv · ${entry.authors.slice(0, 3).join(", ")}${entry.authors.length > 3 ? " et al." : ""}`,
      timestamp: entry.published,
      category: "research" as const,
      companyTags: [],
      engagement: { score: null, comments: null },
      whyThisMatters: null,
      imageUrl: null,
    };
  });
}
