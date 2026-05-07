import Link from "next/link";
import { WireRule } from "./wire-rule";

export function WireFooter({ refreshSeconds }: { refreshSeconds: number }) {
  const refresh =
    refreshSeconds >= 60
      ? `${Math.round(refreshSeconds / 60)}m`
      : `${refreshSeconds}s`;

  return (
    <footer className="mt-16 pb-12">
      <WireRule char="━" />
      <div
        className="mt-3 flex items-baseline justify-between gap-4 flex-wrap text-[10px] uppercase tracking-[0.18em]"
        style={{ color: "var(--wire-mute)" }}
      >
        <span>
          sources: HN · REDDIT · RSS (TC, VERGE, ARS, VB, MIT) · ARXIV (CS.AI · CS.CL · CS.LG)
        </span>
        <span className="flex items-baseline gap-3">
          <Link href="/about">[about]</Link>
          <span aria-hidden>·</span>
          <span>refresh {refresh}</span>
          <span aria-hidden>·</span>
          <span>pulse/wire v1</span>
        </span>
      </div>
      <p className="mt-6 text-[12px]">
        <span style={{ color: "var(--wire-mute)" }}>&gt;</span>{" "}
        <span
          className="uppercase tracking-[0.18em]"
          style={{ color: "var(--wire-mute)" }}
        >
          end of transmission
        </span>{" "}
        <span className="wire-cursor" style={{ color: "var(--wire-signal)" }}>
          █
        </span>
      </p>
    </footer>
  );
}
