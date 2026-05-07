import { TimeGroup, NewsItem } from "./types";
import {
  isToday,
  isYesterday,
  differenceInHours,
  differenceInDays,
} from "date-fns";

export function getTimeGroup(timestamp: string): TimeGroup {
  const date = new Date(timestamp);
  const now = new Date();

  if (isToday(date)) {
    // Items posted within the last 6 hours are "this morning"; older same-day
    // items roll into "overnight" so users still see what broke while they slept.
    return differenceInHours(now, date) <= 6 ? "this-morning" : "overnight";
  }

  if (isYesterday(date)) {
    return "yesterday";
  }

  if (differenceInDays(now, date) <= 7) {
    return "this-week";
  }

  return "this-week";
}

export function groupByTime(items: NewsItem[]): Map<TimeGroup, NewsItem[]> {
  const groups = new Map<TimeGroup, NewsItem[]>([
    ["this-morning", []],
    ["overnight", []],
    ["yesterday", []],
    ["this-week", []],
  ]);

  for (const item of items) {
    const group = getTimeGroup(item.timestamp);
    groups.get(group)!.push(item);
  }

  for (const [key, value] of groups) {
    if (value.length === 0) {
      groups.delete(key);
    }
  }

  return groups;
}

export const TIME_GROUP_LABELS: Record<TimeGroup, string> = {
  "this-morning": "This Morning",
  overnight: "Overnight",
  yesterday: "Yesterday",
  "this-week": "This Week",
};
