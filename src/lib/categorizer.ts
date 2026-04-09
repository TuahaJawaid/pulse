import { NewsCategory, NewsItem } from "./types";
import { CATEGORY_KEYWORDS } from "./constants";

export function categorizeItem(item: NewsItem): NewsItem {
  const text = `${item.title} ${item.summary || ""}`.toLowerCase();

  // ArXiv items are always research
  if (item.source === "arxiv") {
    return { ...item, category: "research" };
  }

  let bestCategory: NewsCategory = "general";
  let bestScore = 0;

  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    const score = keywords.reduce((acc, kw) => {
      return acc + (text.includes(kw.toLowerCase()) ? 1 : 0);
    }, 0);

    if (score > bestScore) {
      bestScore = score;
      bestCategory = category as NewsCategory;
    }
  }

  return { ...item, category: bestCategory };
}
