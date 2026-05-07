"use client";

import { ReactNode } from "react";

export type WireColumn = {
  key: string;
  label: string;
  width?: string;
  align?: "left" | "right";
  mute?: boolean;
};

export function WireTable({
  columns,
  rows,
  empty = "No entries this cycle.",
}: {
  columns: WireColumn[];
  rows: { id: string; cells: ReactNode[]; href?: string }[];
  empty?: string;
}) {
  if (rows.length === 0) {
    return (
      <p className="py-6 text-[12px]" style={{ color: "var(--wire-mute)" }}>
        {empty}
      </p>
    );
  }

  const gridTemplate = columns.map((c) => c.width ?? "minmax(0, 1fr)").join(" ");

  return (
    <div className="text-[12px] tabular-nums">
      <div
        className="grid gap-x-4 px-1 py-2 border-b text-[10px] uppercase tracking-[0.16em]"
        style={{
          gridTemplateColumns: gridTemplate,
          color: "var(--wire-mute)",
          borderColor: "var(--wire-rule)",
        }}
      >
        {columns.map((col) => (
          <div
            key={col.key}
            className={col.align === "right" ? "text-right" : ""}
          >
            {col.label}
          </div>
        ))}
      </div>
      <div>
        {rows.map((row) => (
          <RowShell
            key={row.id}
            href={row.href}
            columns={columns}
            cells={row.cells}
          />
        ))}
      </div>
    </div>
  );
}

function RowShell({
  href,
  columns,
  cells,
}: {
  href?: string;
  columns: WireColumn[];
  cells: ReactNode[];
}) {
  const gridTemplate = columns.map((c) => c.width ?? "minmax(0, 1fr)").join(" ");

  const inner = (
    <div
      className="grid gap-x-4 px-1 py-2 border-b"
      style={{
        gridTemplateColumns: gridTemplate,
        borderColor: "var(--wire-rule)",
      }}
    >
      {columns.map((col, idx) => (
        <div
          key={col.key}
          className={`min-w-0 truncate ${
            col.align === "right" ? "text-right" : ""
          }`}
          style={col.mute ? { color: "var(--wire-mute)" } : undefined}
        >
          {cells[idx]}
        </div>
      ))}
    </div>
  );

  if (!href) return inner;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="block wire-row-hover"
    >
      {inner}
    </a>
  );
}
