"use client";

export function WireCustomBanner({
  tokens,
  matched,
  total,
}: {
  tokens: string[];
  matched: number;
  total: number;
}) {
  if (tokens.length === 0) return null;

  return (
    <div
      className="flex flex-wrap items-baseline gap-x-3 gap-y-1 border-y py-3 text-[11px] uppercase tracking-[0.14em]"
      style={{ borderColor: "var(--wire-rule)" }}
    >
      <span style={{ color: "var(--wire-signal)" }}>&gt;</span>
      <span style={{ color: "var(--wire-mute)" }}>watch:</span>
      {tokens.map((tok) => (
        <span
          key={tok}
          className="border px-2 py-0.5"
          style={{ borderColor: "var(--wire-rule)" }}
        >
          {tok}
        </span>
      ))}
      <span className="ml-auto" style={{ color: "var(--wire-mute)" }}>
        {matched}/{total} match
      </span>
    </div>
  );
}
