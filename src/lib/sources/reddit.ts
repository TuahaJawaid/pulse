import { NewsItem } from "../types";
import { REDDIT_SUBREDDITS } from "../constants";

interface RedditPost {
  data: {
    id: string;
    title: string;
    selftext: string;
    url: string;
    permalink: string;
    subreddit: string;
    score: number;
    num_comments: number;
    created_utc: number;
    author: string;
    thumbnail: string;
    is_self: boolean;
  };
}

interface RedditResponse {
  data: {
    children: RedditPost[];
  };
}

async function fetchSubreddit(subreddit: string): Promise<NewsItem[]> {
  const res = await fetch(
    `https://www.reddit.com/r/${subreddit}/hot.json?limit=20`,
    {
      next: { revalidate: 300 },
      headers: {
        "User-Agent": "PulseAINews/1.0",
      },
    }
  );
  if (!res.ok) return [];

  const data: RedditResponse = await res.json();

  return data.data.children
    .filter((post) => !post.data.url.includes("/r/") || post.data.is_self)
    .map((post) => ({
      id: `reddit_${post.data.id}`,
      title: post.data.title,
      summary: post.data.selftext
        ? post.data.selftext.slice(0, 200) + (post.data.selftext.length > 200 ? "..." : "")
        : null,
      url: post.data.is_self
        ? `https://www.reddit.com${post.data.permalink}`
        : post.data.url,
      source: "reddit" as const,
      sourceDetail: `r/${post.data.subreddit}`,
      timestamp: new Date(post.data.created_utc * 1000).toISOString(),
      category: "general" as const,
      companyTags: [],
      engagement: {
        score: post.data.score,
        comments: post.data.num_comments,
      },
      whyThisMatters: null,
      imageUrl:
        post.data.thumbnail && post.data.thumbnail.startsWith("http")
          ? post.data.thumbnail
          : null,
    }));
}

export async function fetchReddit(): Promise<NewsItem[]> {
  const results = await Promise.allSettled(
    REDDIT_SUBREDDITS.map(fetchSubreddit)
  );

  return results.flatMap((r) => (r.status === "fulfilled" ? r.value : []));
}
