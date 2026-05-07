import { differenceInHours, differenceInDays } from "date-fns";
import { NewsItem } from "./types";

const CATEGORY_WEIGHT: Record<NewsItem["category"], number> = {
  funding: 9,
  "product-launch": 8,
  research: 8,
  policy: 7,
  "open-source": 6,
  "big-tech": 5,
  general: 2,
};

const SOURCE_WEIGHT: Record<NewsItem["source"], number> = {
  arxiv: 6,
  hackernews: 5,
  rss: 5,
  reddit: 3,
  twitter: 2,
};

function recencyScore(timestamp: string): number {
  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) return 0;

  const now = new Date();
  const hours = differenceInHours(now, date);
  const days = differenceInDays(now, date);

  if (hours <= 6) return 28;
  if (hours <= 24) return 22;
  if (days <= 3) return 14;
  if (days <= 7) return 7;
  return 0;
}

function engagementScore(item: NewsItem): number {
  const { score, comments } = item.engagement;
  const scorePoints =
    score === null ? 0 : Math.min(18, Math.log10(score + 1) * 8);
  const commentPoints =
    comments === null ? 0 : Math.min(14, Math.log10(comments + 1) * 7);

  return scorePoints + commentPoints;
}

export function getSignalScore(item: NewsItem): number {
  const companyBoost = Math.min(12, item.companyTags.length * 6);
  const summaryBoost = item.summary ? 2 : 0;

  const total =
    22 +
    recencyScore(item.timestamp) +
    engagementScore(item) +
    CATEGORY_WEIGHT[item.category] +
    SOURCE_WEIGHT[item.source] +
    companyBoost +
    summaryBoost;

  return Math.max(0, Math.min(100, Math.round(total)));
}

export function getSignalLabel(score: number): string {
  if (score >= 80) return "High";
  if (score >= 60) return "Medium";
  return "Watch";
}
