"use client";

import { useEffect, useMemo, useState } from "react";
import { NewsItem } from "@/lib/types";
import { format } from "date-fns";

function buildMarkdown(items: NewsItem[]): string {
  const today = format(new Date(), "EEEE, MMMM d, yyyy");
  const header = `# Pulse/Wire — AI Briefing for ${today}\n\nThe top ${items.length} signals across Hacker News, Reddit, RSS, and ArXiv.\n\n---\n`;
  const body = items
    .map((item, i) => {
      const tags =
        item.companyTags.length > 0
          ? ` _(${item.companyTags.join(", ")})_`
          : "";
      const summary = item.summary
        ? `\n\n${item.summary.slice(0, 220)}${
            item.summary.length > 220 ? "…" : ""
          }`
        : "";
      return `## ${i + 1}. ${item.title}${tags}\n\n[${item.sourceDetail}](${
        item.url
      }) · Signal ${item.signalScore ?? "—"}${summary}`;
    })
    .join("\n\n---\n\n");
  return `${header}\n${body}\n\n---\n\n_Forwarded from Pulse/Wire._`;
}

export function WireForward({ items }: { items: NewsItem[] }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const top = useMemo(
    () =>
      [...items]
        .sort((a, b) => (b.signalScore ?? 0) - (a.signalScore ?? 0))
        .slice(0, 5),
    [items]
  );

  const markdown = useMemo(() => buildMarkdown(top), [top]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(markdown);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  };

  const mailtoHref = `mailto:?subject=${encodeURIComponent(
    `Pulse/Wire — ${format(new Date(), "MMM d")}`
  )}&body=${encodeURIComponent(markdown)}`;

  if (top.length === 0) return null;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="border px-2 py-1 text-[10px] uppercase tracking-[0.18em]"
        style={{ borderColor: "var(--wire-rule)" }}
      >
        [forward today]
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.45)" }}
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-2xl max-h-[85vh] flex flex-col border"
            style={{
              background: "var(--wire-bg)",
              color: "var(--wire-fg)",
              borderColor: "var(--wire-rule)",
            }}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="Forward today's wire"
          >
            <div
              className="flex items-baseline justify-between px-5 py-4 border-b"
              style={{ borderColor: "var(--wire-rule)" }}
            >
              <div>
                <h2 className="text-[12px] uppercase tracking-[0.2em]">
                  &gt; forward today
                </h2>
                <p
                  className="text-[10px] uppercase tracking-[0.16em] mt-1"
                  style={{ color: "var(--wire-mute)" }}
                >
                  top {top.length} signals · paste into slack, email, notes
                </p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="text-[12px]"
                aria-label="Close"
              >
                [×]
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5">
              <pre
                className="whitespace-pre-wrap break-words text-[11px] leading-relaxed border p-3"
                style={{ borderColor: "var(--wire-rule)" }}
              >
                {markdown}
              </pre>
            </div>

            <div
              className="flex items-center justify-end gap-2 px-5 py-4 border-t"
              style={{ borderColor: "var(--wire-rule)" }}
            >
              <a
                href={mailtoHref}
                className="border px-2 py-1 text-[10px] uppercase tracking-[0.18em]"
                style={{ borderColor: "var(--wire-rule)" }}
              >
                [email]
              </a>
              <button
                type="button"
                onClick={copy}
                className="border px-2 py-1 text-[10px] uppercase tracking-[0.18em]"
                style={{
                  background: "var(--wire-fg)",
                  color: "var(--wire-bg)",
                  borderColor: "var(--wire-fg)",
                }}
              >
                {copied ? "[copied]" : "[copy markdown]"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
