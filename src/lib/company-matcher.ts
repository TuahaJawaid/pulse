import { NewsItem } from "./types";
import { WATCHLIST_COMPANIES } from "./constants";

export function matchCompanies(item: NewsItem): NewsItem {
  const text = `${item.title} ${item.summary || ""}`.toLowerCase();

  const companyTags = WATCHLIST_COMPANIES.filter((company) =>
    company.aliases.some((alias) => text.includes(alias.toLowerCase()))
  ).map((company) => company.name);

  return { ...item, companyTags };
}
