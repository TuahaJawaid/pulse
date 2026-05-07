import { aggregateNews } from "@/lib/aggregator";
import { getSiteUrl } from "@/lib/site-url";

export const revalidate = 300;

function escape(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const base = getSiteUrl();
  const { items } = await aggregateNews();

  const top = [...items]
    .sort((a, b) => (b.signalScore ?? 0) - (a.signalScore ?? 0))
    .slice(0, 50);

  const updated = top[0]?.timestamp ?? new Date().toISOString();

  const entries = top
    .map((item) => {
      const tags = [
        item.category,
        ...item.companyTags.map((t) => t.toLowerCase().replace(/\s+/g, "-")),
      ];
      return `  <entry>
    <id>${escape(item.url)}</id>
    <title>${escape(item.title)}</title>
    <link href="${escape(item.url)}"/>
    <updated>${escape(item.timestamp)}</updated>
    <author><name>${escape(item.sourceDetail)}</name></author>
${tags.map((t) => `    <category term="${escape(t)}"/>`).join("\n")}
    <summary type="text">${escape(item.summary ?? item.title)}</summary>
  </entry>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>Pulse — AI News Intelligence</title>
  <subtitle>Top AI signals across HN, Reddit, RSS, and ArXiv. Deduplicated and ranked.</subtitle>
  <link href="${escape(base)}"/>
  <link rel="self" href="${escape(base)}/feed.xml"/>
  <id>${escape(base)}/feed.xml</id>
  <updated>${escape(updated)}</updated>
  <generator uri="${escape(base)}">Pulse</generator>
${entries}
</feed>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/atom+xml; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=300, stale-while-revalidate=600",
    },
  });
}
