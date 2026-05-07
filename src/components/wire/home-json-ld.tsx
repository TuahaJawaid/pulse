import { NewsItem } from "@/lib/types";

/**
 * Renders an ItemList JSON-LD payload for the top 25 stories. Helps Google
 * News and AI search engines understand the page as a list of news items.
 * Server component — runs once per ISR rebuild.
 */
export function HomeJsonLd({ items }: { items: NewsItem[] }) {
  const top = [...items]
    .sort((a, b) => (b.signalScore ?? 0) - (a.signalScore ?? 0))
    .slice(0, 25);

  const payload = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Pulse — top AI signals",
    itemListOrder: "https://schema.org/ItemListOrderDescending",
    numberOfItems: top.length,
    itemListElement: top.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: item.url,
      name: item.title,
    })),
  };

  return (
    <script
      type="application/ld+json"
      // Stringified server-side; safe — values come from our own pipeline.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(payload) }}
    />
  );
}
