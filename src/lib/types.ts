export type NewsSource = "hackernews" | "reddit" | "rss" | "arxiv" | "twitter";

export type NewsCategory =
  | "funding"
  | "product-launch"
  | "research"
  | "policy"
  | "big-tech"
  | "open-source"
  | "general";

export type TimeGroup = "this-morning" | "overnight" | "yesterday" | "this-week";

export interface NewsItem {
  id: string;
  title: string;
  summary: string | null;
  url: string;
  source: NewsSource;
  sourceDetail: string;
  timestamp: string;
  category: NewsCategory;
  companyTags: string[];
  engagement: {
    score: number | null;
    comments: number | null;
  };
  whyThisMatters: string | null;
  imageUrl: string | null;
}

export interface FundingRound {
  company: string;
  amount: string;
  investors: string[];
  timestamp: string;
  url: string;
}

export interface DashboardStats {
  totalStories: number;
  fundingRounds: number;
  majorLaunches: number;
  researchPapers: number;
}

export interface AggregatedData {
  items: NewsItem[];
  stats: DashboardStats;
  funding: FundingRound[];
}
