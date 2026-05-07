import { ReactNode } from "react";
import { WireRule } from "./wire-rule";

export function WireSection({
  label,
  meta,
  children,
}: {
  label: string;
  meta?: string;
  children: ReactNode;
}) {
  return (
    <section className="mt-12">
      <header className="flex items-baseline justify-between gap-4">
        <h2 className="text-[11px] uppercase tracking-[0.18em]">
          <span style={{ color: "var(--wire-mute)" }}>&gt;&nbsp;</span>
          <span>{label}</span>
        </h2>
        {meta && (
          <span
            className="text-[10px] uppercase tracking-[0.16em]"
            style={{ color: "var(--wire-mute)" }}
          >
            {meta}
          </span>
        )}
      </header>
      <WireRule />
      <div className="mt-3">{children}</div>
    </section>
  );
}
