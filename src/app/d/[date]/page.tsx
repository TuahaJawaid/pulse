import { Metadata } from "next";
import Link from "next/link";
import { format } from "date-fns";
import { isValidDate } from "@/lib/archive";
import { readSnapshot } from "@/lib/archive-store";
import { getSignalLabel } from "@/lib/signal-score";
import { SOURCE_LABELS } from "@/lib/constants";
import { WireRule } from "@/components/wire/wire-rule";
import { WireFooter } from "@/components/wire/wire-footer";

export const revalidate = 86400;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ date: string }>;
}): Promise<Metadata> {
  const { date } = await params;
  if (!isValidDate(date)) {
    return { title: "Invalid date · Pulse", robots: { index: false } };
  }
  return {
    title: `Wire archive · ${date}`,
    description: `Top AI signals captured on ${date}. Daily snapshot from Pulse.`,
  };
}

export default async function ArchiveDayPage({
  params,
}: {
  params: Promise<{ date: string }>;
}) {
  const { date } = await params;
  const valid = isValidDate(date);
  const snapshot = valid ? await readSnapshot(date) : null;
  const headerDate = valid
    ? format(new Date(`${date}T00:00:00Z`), "EEEE, MMMM d, yyyy")
    : date;

  return (
    <div className="wire-root wire-scanlines">
      <div className="relative mx-auto max-w-[1280px] px-6 sm:px-8 pb-8">
        <header className="pt-6 pb-2">
          <div className="flex items-baseline justify-between gap-4 flex-wrap">
            <Link
              href="/"
              className="text-[15px] font-semibold tracking-[0.22em] uppercase"
            >
              PULSE
              <span style={{ color: "var(--wire-signal)" }}>/</span>WIRE
            </Link>
            <div className="flex items-baseline gap-3 text-[10px] uppercase tracking-[0.18em]">
              <Link href="/" style={{ color: "var(--wire-mute)" }}>
                [today]
              </Link>
              <Link href="/archive" style={{ color: "var(--wire-mute)" }}>
                [archive]
              </Link>
            </div>
          </div>
          <WireRule char="━" />
        </header>

        <section className="mt-10">
          <p
            className="text-[10px] uppercase tracking-[0.2em]"
            style={{ color: "var(--wire-mute)" }}
          >
            &gt; archive · {date}
          </p>
          <h1 className="mt-2 text-[28px] sm:text-[34px] leading-[1.08] font-medium tracking-tight uppercase">
            {headerDate}
          </h1>

          {!valid && (
            <p
              className="mt-6 text-[12px]"
              style={{ color: "var(--wire-mute)" }}
            >
              Invalid date format. Use YYYY-MM-DD.
            </p>
          )}

          {valid && !snapshot && (
            <div className="mt-6 space-y-3">
              <p
                className="text-[12px]"
                style={{ color: "var(--wire-mute)" }}
              >
                No snapshot recorded for this date. Either Pulse hadn&apos;t
                yet captured this day, or Vercel Blob isn&apos;t configured for
                this deployment.
              </p>
              <Link
                href="/archive"
                className="inline-block border px-3 py-1.5 text-[10px] uppercase tracking-[0.18em]"
                style={{ borderColor: "var(--wire-rule)" }}
              >
                [browse available dates]
              </Link>
            </div>
          )}

          {snapshot && (
            <>
              <div className="mt-4 flex flex-wrap items-baseline gap-x-6 gap-y-1 text-[10px] uppercase tracking-[0.2em]">
                <span style={{ color: "var(--wire-mute)" }}>
                  indexed{" "}
                  <span style={{ color: "var(--wire-fg)" }}>
                    {snapshot.items.length.toString().padStart(3, "0")}
                  </span>
                </span>
                <span style={{ color: "var(--wire-mute)" }}>
                  hot{" "}
                  <span style={{ color: "var(--wire-signal)" }}>
                    {snapshot.stats.hotSignals.toString().padStart(2, "0")}
                  </span>
                </span>
                <span style={{ color: "var(--wire-mute)" }}>
                  launches{" "}
                  <span style={{ color: "var(--wire-fg)" }}>
                    {snapshot.stats.majorLaunches.toString().padStart(2, "0")}
                  </span>
                </span>
                <span style={{ color: "var(--wire-mute)" }}>
                  papers{" "}
                  <span style={{ color: "var(--wire-fg)" }}>
                    {snapshot.stats.researchPapers.toString().padStart(2, "0")}
                  </span>
                </span>
              </div>

              <ol className="mt-8 text-[12px] tabular-nums">
                {snapshot.items.map((item, i) => (
                  <li
                    key={item.id}
                    className="grid items-baseline gap-x-3 border-b py-2 px-1"
                    style={{
                      gridTemplateColumns:
                        "4ch 5ch 4ch minmax(0, 1fr) auto auto",
                      borderColor: "var(--wire-rule)",
                    }}
                  >
                    <span
                      className="text-[10px]"
                      style={{ color: "var(--wire-cold)" }}
                    >
                      {(i + 1).toString().padStart(3, "0")}
                    </span>
                    <span
                      className="text-[10px] uppercase tracking-[0.12em]"
                      style={{ color: "var(--wire-mute)" }}
                    >
                      {format(new Date(item.timestamp), "HH:mm")}
                    </span>
                    <span style={{ color: "var(--wire-mute)" }}>
                      {SOURCE_LABELS[item.source] ?? item.source}
                    </span>
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="min-w-0 truncate uppercase tracking-tight"
                      title={item.title}
                    >
                      {item.title}
                    </a>
                    <span
                      className="text-[10px] uppercase tracking-[0.14em] hidden md:inline"
                      style={{ color: "var(--wire-mute)" }}
                    >
                      {item.companyTags[0]?.toUpperCase() ?? ""}
                    </span>
                    <span
                      className="text-[10px] uppercase tracking-[0.14em]"
                      style={{
                        color:
                          (item.signalScore ?? 0) >= 80
                            ? "var(--wire-signal)"
                            : "var(--wire-mute)",
                      }}
                    >
                      {getSignalLabel(item.signalScore ?? 0).toUpperCase()}{" "}
                      {(item.signalScore ?? 0).toString().padStart(2, "0")}
                    </span>
                  </li>
                ))}
              </ol>

              <p
                className="mt-6 text-[10px] uppercase tracking-[0.2em]"
                style={{ color: "var(--wire-cold)" }}
              >
                captured {format(new Date(snapshot.capturedAt), "yyyy.MM.dd HH:mm")}{" "}
                UTC
              </p>
            </>
          )}
        </section>

        <WireFooter refreshSeconds={revalidate} />
      </div>
    </div>
  );
}
