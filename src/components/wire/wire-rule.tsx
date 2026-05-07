export function WireRule({ char = "─" }: { char?: "─" | "━" | "═" | "·" }) {
  return (
    <div className="wire-rule" aria-hidden>
      {char.repeat(220)}
    </div>
  );
}
