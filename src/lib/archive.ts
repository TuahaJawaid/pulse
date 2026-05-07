import { NewsItem } from "./types";

export interface DaySnapshot {
  date: string; // YYYY-MM-DD UTC
  capturedAt: string; // ISO timestamp
  items: NewsItem[];
  stats: {
    totalStories: number;
    hotSignals: number;
    majorLaunches: number;
    researchPapers: number;
  };
}

export const ARCHIVE_PREFIX = "archive/";

export function snapshotPath(date: string): string {
  return `${ARCHIVE_PREFIX}${date}.json`;
}

export function todayUTC(): string {
  return new Date().toISOString().slice(0, 10);
}

export function isValidDate(date: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return false;
  const d = new Date(`${date}T00:00:00Z`);
  return !Number.isNaN(d.getTime());
}

/**
 * Trim a snapshot to the top N items by signal score so blob payloads stay
 * small. We keep the original source items intact otherwise.
 */
export function trimForArchive(items: NewsItem[], limit = 80): NewsItem[] {
  return [...items]
    .sort((a, b) => (b.signalScore ?? 0) - (a.signalScore ?? 0))
    .slice(0, limit);
}
