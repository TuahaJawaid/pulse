import { NewsItem } from "./types";

const WORDS_PER_MINUTE = 220;

function wordCount(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

/**
 * Estimates reading time in whole minutes for a story. Title contributes a
 * small fixed cost; summary scales with word count. Floors to 1 min when any
 * text is present so we never report "0 min".
 */
export function readingTimeMinutes(item: NewsItem): number {
  const titleWords = wordCount(item.title);
  const summaryWords = item.summary ? wordCount(item.summary) : 0;
  const total = titleWords + summaryWords;
  if (total === 0) return 1;
  return Math.max(1, Math.round(total / WORDS_PER_MINUTE));
}

export function readingTimeLabel(item: NewsItem): string {
  return `${readingTimeMinutes(item)} MIN`;
}
