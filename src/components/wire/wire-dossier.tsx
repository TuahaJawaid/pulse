import { NewsItem } from "@/lib/types";
import { formatDistanceToNow } from "date-fns";
import { WireRule } from "./wire-rule";

const SOURCE_TAG: Record<NewsItem["source"], string> = {
  hackernews: "HN",
  reddit: "RDT",
  rss: "RSS",
  arxiv: "ARX",
  twitter: "TWX",
};

export function WireDossier({
  lead,
  cycleStats,
  newSinceLabel,
}: {
  lead: NewsItem | null;
  cycleStats: {
    stories: number;
    capital: number;
    launches: number;
    research: number;
  };
  newSinceLabel: string | null;
}) {
  if (!lead) {
    return (
      <section className="pt-8 pb-6">
        <div
          className="text-[10px] uppercase tracking-[0.18em]"
          style={{ color: "var(--wire-mute)" }}
        >
          &gt; dossier
        </div>
        <WireRule />
        <p className="mt-6 text-base">No transmissions today. Wire is quiet.</p>
      </section>
    );
  }

  const ago = formatDistanceToNow(new Date(lead.timestamp), { addSuffix: false });
  const tags = [
    SOURCE_TAG[lead.source] ?? "RSS",
    lead.category.toUpperCase().replace("-", "/"),
    ago.toUpperCase(),
    ...lead.companyTags.slice(0, 2).map((t) => t.toUpperCase()),
  ];

  return (
    <section className="pt-10 pb-8">
      <div className="flex items-baseline justify-between gap-4 flex-wrap">
        <span
          className="text-[10px] uppercase tracking-[0.18em]"
          style={{ color: "var(--wire-mute)" }}
        >
          &gt; dossier · today
        </span>
        <div
          className="flex items-baseline gap-3 text-[10px] uppercase tracking-[0.18em]"
          style={{ color: "var(--wire-signal)" }}
        >
          {newSinceLabel && (
            <>
              <span>{newSinceLabel}</span>
              <span aria-hidden style={{ color: "var(--wire-mute)" }}>
                ·
              </span>
            </>
          )}
          <span>
            [ HOT <span className="wire-tick">●</span> ]
          </span>
        </div>
      </div>
      <WireRule />

      <div className="mt-8 grid gap-10 md:grid-cols-[1fr_auto] md:gap-16">
        <div>
          <a
            href={lead.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block"
          >
            <p
              className="text-[10px] uppercase tracking-[0.2em]"
              style={{ color: "var(--wire-mute)" }}
            >
              {tags.join("  ·  ")}
            </p>
            <h2 className="mt-3 text-[28px] sm:text-[34px] md:text-[42px] leading-[1.08] font-medium tracking-tight uppercase">
              {lead.title}
            </h2>
            {lead.summary && (
              <p
                className="mt-4 max-w-[62ch] text-[13px] leading-[1.7]"
                style={{ color: "var(--wire-mute)" }}
              >
                {lead.summary}
              </p>
            )}
            {lead.whyThisMatters && (
              <p
                className="mt-5 max-w-[62ch] text-[12px] leading-[1.7] border-l-2 pl-4"
                style={{ borderColor: "var(--wire-rule)" }}
              >
                <span
                  className="uppercase tracking-[0.18em] mr-2"
                  style={{ color: "var(--wire-signal)" }}
                >
                  &gt; why
                </span>
                {lead.whyThisMatters}
              </p>
            )}
            <p
              className="mt-6 text-[10px] uppercase tracking-[0.2em]"
              style={{ color: "var(--wire-mute)" }}
            >
              read transmission ↗
            </p>
          </a>
        </div>

        <aside className="md:min-w-[14ch] md:border-l md:pl-8">
          <p
            className="text-[10px] uppercase tracking-[0.2em]"
            style={{ color: "var(--wire-mute)" }}
          >
            cycle
          </p>
          <dl className="mt-3 space-y-3 tabular-nums">
            <Stat label="indexed" value={cycleStats.stories} />
            <Stat label="capital" value={cycleStats.capital} accent />
            <Stat label="launches" value={cycleStats.launches} />
            <Stat label="research" value={cycleStats.research} />
          </dl>
        </aside>
      </div>
    </section>
  );
}

function Stat({
  label,
  value,
  accent = false,
}: {
  label: string;
  value: number;
  accent?: boolean;
}) {
  return (
    <div>
      <dd
        className="text-[28px] leading-none tabular-nums"
        style={accent ? { color: "var(--wire-signal)" } : undefined}
      >
        {value.toString().padStart(3, "0")}
      </dd>
      <dt
        className="mt-1 text-[10px] uppercase tracking-[0.18em]"
        style={{ color: "var(--wire-mute)" }}
      >
        {label}
      </dt>
    </div>
  );
}
