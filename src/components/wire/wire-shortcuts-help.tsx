"use client";

import { useEffect } from "react";
import { WireRule } from "./wire-rule";

const ROWS: { key: string; label: string }[] = [
  { key: "/", label: "focus search" },
  { key: "j", label: "next transmission" },
  { key: "k", label: "previous transmission" },
  { key: "↵ enter", label: "open focused transmission" },
  { key: "b", label: "mark/unmark focused" },
  { key: "x", label: "hide focused" },
  { key: "s", label: "toggle marked-only" },
  { key: "v", label: "toggle tape / section view" },
  { key: "g h", label: "go home" },
  { key: "g a", label: "go archive" },
  { key: "esc", label: "clear filters / close" },
  { key: "?", label: "this help" },
];

export function WireShortcutsHelp({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Keyboard shortcuts"
      className="fixed inset-0 z-50 flex items-start justify-center px-4 py-16"
      style={{ background: "rgba(12, 11, 8, 0.55)" }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-[42rem] border p-6"
        style={{
          background: "var(--wire-bg)",
          color: "var(--wire-fg)",
          borderColor: "var(--wire-rule)",
        }}
      >
        <header className="flex items-baseline justify-between gap-4">
          <span
            className="text-[11px] uppercase tracking-[0.18em]"
            style={{ color: "var(--wire-mute)" }}
          >
            &gt; manual · keybinds
          </span>
          <button
            type="button"
            onClick={onClose}
            className="text-[10px] uppercase tracking-[0.18em] border px-2 py-1"
            style={{ borderColor: "var(--wire-rule)" }}
          >
            [esc] close
          </button>
        </header>
        <WireRule />
        <ul className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-y-1.5 gap-x-8 text-[12px] tabular-nums">
          {ROWS.map((row) => (
            <li
              key={row.key}
              className="flex items-baseline justify-between gap-3"
            >
              <span
                className="uppercase tracking-[0.14em]"
                style={{ color: "var(--wire-mute)" }}
              >
                {row.label}
              </span>
              <kbd
                className="border px-1.5 py-0.5 text-[10px] uppercase tracking-[0.16em]"
                style={{
                  borderColor: "var(--wire-rule)",
                  color: "var(--wire-fg)",
                }}
              >
                {row.key}
              </kbd>
            </li>
          ))}
        </ul>
        <p
          className="mt-5 text-[10px] uppercase tracking-[0.18em]"
          style={{ color: "var(--wire-mute)" }}
        >
          tip: keys are inactive while typing in search.
        </p>
      </div>
    </div>
  );
}
