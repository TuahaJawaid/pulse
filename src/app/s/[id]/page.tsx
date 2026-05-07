import { Metadata } from "next";
import Link from "next/link";
import { format, formatDistanceToNow } from "date-fns";
import { aggregateNews } from "@/lib/aggregator";
import { getSignalLabel } from "@/lib/signal-score";
import { readingTimeMinutes } from "@/lib/reading-time";
import { SOURCE_LABELS } from "@/lib/constants";
import { WireRule } from "@/components/wire/wire-rule";
import { WireFooter } from "@/components/wire/wire-footer";

export const revalidate = 300;

async function findItem(id: string) {
  const { items } = await aggregateNews();
  return items.find((i) => i.id === id) ?? null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const item = await findItem(id);
  if (!item) {
    return { title: "Transmission lost · Pulse", robots: { index: false } };
  }
  return {
    title: item.title,
    description: item.summary ?? `${item.sourceDetail} · Pulse signal`,
    openGraph: {
      title: item.title,
      description: item.summary ?? undefined,
      type: "article",
      publishedTime: item.timestamp,
    },
    alternates: { canonical: item.url },
  };
}

export default async function StoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const item = await findItem(id);

  return (
    <div className="wire-root wire-scanlines">
      <div className="relative mx-auto max-w-[920px] px-6 sm:px-8 pb-8">
        <header className="pt-6 pb-2">
          <div className="flex items-baseline justify-between gap-4">
            <Link
              href="/"
              className="text-[15px] font-semibold tracking-[0.22em] uppercase"
            >
              PULSE
              <span style={{ color: "var(--wire-signal)" }}>/</span>WIRE
            </Link>
            <Link
              href="/"
              className="text-[10px] uppercase tracking-[0.18em]"
              style={{ color: "var(--wire-mute)" }}
            >
              [back to wire]
            </Link>
          </div>
          <WireRule char="━" />
        </header>

        {!item ? (
          <section className="mt-12">
            <p
              className="text-[10px] uppercase tracking-[0.2em]"
              style={{ color: "var(--wire-mute)" }}
            >
              &gt; transmission lost · cycle rotated
            </p>
            <h1 className="mt-3 text-[28px] sm:text-[34px] leading-[1.08] font-medium tracking-tight uppercase">
              This signal is no longer on the wire.
            </h1>
            <p
              className="mt-4 text-[12px]"
              style={{ color: "var(--wire-mute)" }}
            >
              Pulse keeps a rolling window of fresh transmissions. The
              transmission you&apos;re looking for has rotated out of the
              current cycle.
            </p>
            <p className="mt-6">
              <Link
                href="/"
                className="border px-3 py-1.5 text-[10px] uppercase tracking-[0.18em]"
                style={{ borderColor: "var(--wire-rule)" }}
              >
                [return to wire]
              </Link>
              <Link
                href="/archive"
                className="ml-2 border px-3 py-1.5 text-[10px] uppercase tracking-[0.18em]"
                style={{ borderColor: "var(--wire-rule)" }}
              >
                [archive]
              </Link>
            </p>
          </section>
        ) : (
          <article className="mt-10">
            <p
              className="text-[10px] uppercase tracking-[0.2em]"
              style={{ color: "var(--wire-mute)" }}
            >
              {[
                SOURCE_LABELS[item.source] ?? item.source,
                item.category.toUpperCase().replace("-", "/"),
                format(new Date(item.timestamp), "yyyy.MM.dd HH:mm").toUpperCase() + " UTC",
                ...item.companyTags.slice(0, 3).map((t) => t.toUpperCase()),
              ].join("  ·  ")}
            </p>
            <h1 className="mt-3 text-[28px] sm:text-[34px] md:text-[42px] leading-[1.08] font-medium tracking-tight uppercase">
              {item.title}
            </h1>
            {item.summary && (
              <p
                className="mt-5 max-w-[64ch] text-[13px] leading-[1.7]"
                style={{ color: "var(--wire-mute)" }}
              >
                {item.summary}
              </p>
            )}

            <div className="mt-8 flex flex-wrap items-baseline gap-x-6 gap-y-2 text-[10px] uppercase tracking-[0.2em]">
              <span style={{ color: "var(--wire-mute)" }}>
                signal {(item.signalScore ?? 0).toString().padStart(2, "0")}{" "}
                <span style={{ color: "var(--wire-fg)" }}>
                  · {getSignalLabel(item.signalScore ?? 0).toUpperCase()}
                </span>
              </span>
              <span style={{ color: "var(--wire-mute)" }}>
                read · {readingTimeMinutes(item)} min
              </span>
              <span style={{ color: "var(--wire-mute)" }}>
                {formatDistanceToNow(new Date(item.timestamp), { addSuffix: true })}
              </span>
            </div>

            {item.relatedSources && item.relatedSources.length > 0 && (
              <div className="mt-6">
                <p
                  className="text-[10px] uppercase tracking-[0.2em]"
                  style={{ color: "var(--wire-mute)" }}
                >
                  also seen on
                </p>
                <ul className="mt-2 text-[12px] space-y-1">
                  {item.relatedSources.map((rel) => (
                    <li key={rel.id}>
                      <a
                        href={rel.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="uppercase"
                      >
                        {SOURCE_LABELS[rel.source] ?? rel.source} ·{" "}
                        <span style={{ color: "var(--wire-mute)" }}>
                          {rel.sourceDetail}
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="mt-10">
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="border px-3 py-2 text-[11px] uppercase tracking-[0.2em]"
                style={{
                  borderColor: "var(--wire-rule)",
                  color: "var(--wire-fg)",
                }}
              >
                read transmission ↗
              </a>
            </div>
          </article>
        )}

        <WireFooter refreshSeconds={revalidate} />
      </div>
    </div>
  );
}
