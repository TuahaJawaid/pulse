import { aggregateNews } from "@/lib/aggregator";
import { getSiteUrl } from "@/lib/site-url";

export const revalidate = 300;

export async function GET() {
  const base = getSiteUrl();
  const { items } = await aggregateNews();

  const top = [...items]
    .sort((a, b) => (b.signalScore ?? 0) - (a.signalScore ?? 0))
    .slice(0, 50);

  const feed = {
    version: "https://jsonfeed.org/version/1.1",
    title: "Pulse — AI News Intelligence",
    description:
      "Top AI signals across HN, Reddit, RSS, and ArXiv. Deduplicated and ranked.",
    home_page_url: `${base}/`,
    feed_url: `${base}/feed.json`,
    language: "en",
    items: top.map((item) => ({
      id: `${base}/s/${item.id}`,
      url: item.url,
      external_url: item.url,
      title: item.title,
      content_text: item.summary ?? item.title,
      date_published: item.timestamp,
      tags: [
        item.category,
        ...item.companyTags,
        ...(item.signalScore !== undefined ? [`signal:${item.signalScore}`] : []),
      ],
      authors: [{ name: item.sourceDetail }],
      _pulse: {
        source: item.source,
        sourceDetail: item.sourceDetail,
        signalScore: item.signalScore ?? null,
        companyTags: item.companyTags,
        relatedSources: item.relatedSources ?? [],
      },
    })),
  };

  return Response.json(feed, {
    headers: {
      "Cache-Control":
        "public, max-age=0, s-maxage=300, stale-while-revalidate=600",
    },
  });
}
