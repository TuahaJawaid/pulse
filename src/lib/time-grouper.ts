import { TimeGroup, NewsItem } from "./types";
import {
  isToday,
  isYesterday,
  differenceInHours,
  differenceInDays,
  startOfDay,
} from "date-fns";

export function getTimeGroup(timestamp: string): TimeGroup {
  const date = new Date(timestamp);
  const now = new Date();
  const todayStart = startOfDay(now);
  const hoursSinceMidnight = differenceInHours(now, todayStart);

  if (isToday(date)) {
    const hours = differenceInHours(now, date);
    // If it's morning and the item is from today, it's "this morning"
    if (hours <= Math.max(hoursSinceMidnight, 6)) {
      return "this-morning";
    }
    return "this-morning";
  }

  if (isYesterday(date)) {
    const hours = differenceInHours(now, date);
    // Items from late last night
    if (hours <= 12) {
      return "overnight";
    }
    return "yesterday";
  }

  if (differenceInDays(now, date) <= 7) {
    return "this-week";
  }

  return "this-week";
}

export function groupByTime(
  items: NewsItem[]
): Map<TimeGroup, NewsItem[]> {
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

  // Remove empty groups
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
