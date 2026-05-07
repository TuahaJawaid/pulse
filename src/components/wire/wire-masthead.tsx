import { WireRule } from "./wire-rule";
import { WireThemeToggle } from "./wire-theme-toggle";

export function WireMasthead({
  cycle,
  stats,
}: {
  cycle: string;
  stats: { stories: number; hot: number; capital: number };
}) {
  return (
    <header className="pt-6 pb-2">
      <div className="flex items-baseline justify-between gap-6 flex-wrap">
        <div className="flex items-baseline gap-3 flex-wrap">
          <h1 className="text-[15px] font-semibold tracking-[0.22em] uppercase">
            PULSE
            <span style={{ color: "var(--wire-signal)" }}>/</span>
            WIRE
          </h1>
          <span
            className="text-[10px] uppercase tracking-[0.18em]"
            style={{ color: "var(--wire-mute)" }}
          >
            ai intelligence · est. 2026
          </span>
        </div>
        <div
          className="flex items-baseline gap-4 text-[10px] uppercase tracking-[0.18em]"
          style={{ color: "var(--wire-mute)" }}
        >
          <span>{cycle}</span>
          <span aria-hidden>·</span>
          <span>
            <span style={{ color: "var(--wire-fg)" }}>
              {stats.stories.toString().padStart(3, "0")}
            </span>{" "}
            idx
          </span>
          <span aria-hidden>·</span>
          <span>
            <span style={{ color: "var(--wire-fg)" }}>
              {stats.capital.toString().padStart(2, "0")}
            </span>{" "}
            cap
          </span>
          <span aria-hidden>·</span>
          <span>
            <span style={{ color: "var(--wire-signal)" }}>
              {stats.hot.toString().padStart(2, "0")}
            </span>{" "}
            hot{" "}
            <span className="wire-tick" style={{ color: "var(--wire-signal)" }}>
              ●
            </span>
          </span>
          <WireThemeToggle />
        </div>
      </div>
      <WireRule char="━" />
    </header>
  );
}
