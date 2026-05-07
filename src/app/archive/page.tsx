import Link from "next/link";
import { format } from "date-fns";
import { listSnapshots } from "@/lib/archive-store";
import { WireRule } from "@/components/wire/wire-rule";
import { WireFooter } from "@/components/wire/wire-footer";

export const revalidate = 3600;

export const metadata = {
  title: "Archive · Pulse",
  description:
    "Daily snapshots of the Pulse wire — every day's top AI signals, captured.",
};

export default async function ArchiveIndex() {
  const snapshots = await listSnapshots();
  const blobConfigured = Boolean(process.env.BLOB_READ_WRITE_TOKEN);

  return (
    <div className="wire-root wire-scanlines">
      <div className="relative mx-auto max-w-[1100px] px-6 sm:px-8 pb-8">
        <header className="pt-6 pb-2">
          <div className="flex items-baseline justify-between gap-4 flex-wrap">
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
              [today]
            </Link>
          </div>
          <WireRule char="━" />
        </header>

        <section className="mt-10">
          <p
            className="text-[10px] uppercase tracking-[0.2em]"
            style={{ color: "var(--wire-mute)" }}
          >
            &gt; archive · all cycles
          </p>
          <h1 className="mt-2 text-[28px] sm:text-[34px] leading-[1.08] font-medium tracking-tight uppercase">
            Daily snapshots of the wire.
          </h1>
          <p
            className="mt-3 max-w-[60ch] text-[13px]"
            style={{ color: "var(--wire-mute)" }}
          >
            Every day at 23:00 UTC, Pulse freezes the top signals to a
            permanent record. Browse any past day below.
          </p>

          {!blobConfigured && (
            <div
              className="mt-8 border p-4 text-[12px]"
              style={{ borderColor: "var(--wire-rule)" }}
            >
              <p
                className="text-[10px] uppercase tracking-[0.18em]"
                style={{ color: "var(--wire-signal)" }}
              >
                &gt; archive offline
              </p>
              <p
                className="mt-2"
                style={{ color: "var(--wire-mute)" }}
              >
                Vercel Blob is not configured for this deployment. Set{" "}
                <span style={{ color: "var(--wire-fg)" }}>
                  BLOB_READ_WRITE_TOKEN
                </span>{" "}
                to start recording snapshots.
              </p>
            </div>
          )}

          {blobConfigured && snapshots.length === 0 && (
            <p
              className="mt-8 text-[12px]"
              style={{ color: "var(--wire-mute)" }}
            >
              No snapshots yet — the next cron run will create the first one.
            </p>
          )}

          {snapshots.length > 0 && (
            <ol className="mt-8 text-[12px] tabular-nums">
              {snapshots.map((s) => (
                <li
                  key={s.date}
                  className="grid items-baseline gap-x-3 border-b py-2 px-1"
                  style={{
                    gridTemplateColumns:
                      "minmax(14ch, 18ch) minmax(0, 1fr) auto",
                    borderColor: "var(--wire-rule)",
                  }}
                >
                  <span
                    className="uppercase tracking-[0.14em]"
                    style={{ color: "var(--wire-mute)" }}
                  >
                    {s.date}
                  </span>
                  <Link
                    href={`/d/${s.date}`}
                    className="uppercase tracking-tight"
                  >
                    {format(new Date(`${s.date}T00:00:00Z`), "EEEE, MMMM d, yyyy")}
                  </Link>
                  <span
                    className="text-[10px] uppercase tracking-[0.14em]"
                    style={{ color: "var(--wire-cold)" }}
                  >
                    {(s.size / 1024).toFixed(1)}KB
                  </span>
                </li>
              ))}
            </ol>
          )}
        </section>

        <WireFooter refreshSeconds={revalidate} />
      </div>
    </div>
  );
}
