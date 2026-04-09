"use client";

import { useState } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { MessageResponse } from "@/components/ai-elements/message";
import { NewsItem } from "@/lib/types";

export function ExecutiveSummary({ items }: { items: NewsItem[] }) {
  const [hasStarted, setHasStarted] = useState(false);

  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({ api: "/api/summary" }),
  });

  const isStreaming = status === "streaming" || status === "submitted";
  const assistantMessage = messages.find((m) => m.role === "assistant");

  const handleGenerate = () => {
    if (hasStarted || isStreaming) return;
    setHasStarted(true);

    const context = items
      .slice(0, 25)
      .map(
        (item) =>
          `[${item.source.toUpperCase()}] ${item.title}${item.summary ? ` — ${item.summary.slice(0, 100)}` : ""}${item.companyTags.length > 0 ? ` (${item.companyTags.join(", ")})` : ""}`
      )
      .join("\n");

    sendMessage({ text: context });
  };

  // Extract text content from assistant message parts
  const assistantText = assistantMessage?.parts
    ?.filter((part): part is Extract<typeof part, { type: "text" }> => part.type === "text")
    .map((part) => part.text)
    .join("") || "";

  return (
    <div className="mx-6 my-4 border border-zinc-800 rounded-lg bg-zinc-900/50 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800/50">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-mono font-medium uppercase tracking-wider text-zinc-400">
            AI Executive Briefing
          </span>
        </div>
        {!hasStarted && (
          <button
            onClick={handleGenerate}
            className="px-3 py-1 rounded-md text-xs font-medium bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:text-zinc-100 transition-colors"
          >
            Generate Briefing
          </button>
        )}
        {isStreaming && (
          <span className="text-[10px] font-mono text-zinc-600 animate-pulse">
            analyzing...
          </span>
        )}
      </div>

      <div className="px-4 py-3">
        {!hasStarted && (
          <p className="text-xs text-zinc-600 italic">
            Click &quot;Generate Briefing&quot; for an AI-powered summary of
            today&apos;s most important AI developments.
          </p>
        )}

        {hasStarted && !assistantText && isStreaming && (
          <div className="space-y-2">
            <div className="h-3 bg-zinc-800/50 rounded animate-pulse w-full" />
            <div className="h-3 bg-zinc-800/50 rounded animate-pulse w-4/5" />
            <div className="h-3 bg-zinc-800/50 rounded animate-pulse w-3/5" />
          </div>
        )}

        {assistantText && (
          <div className="text-sm [&_h2]:text-sm [&_h2]:font-semibold [&_h2]:text-zinc-100 [&_h3]:text-sm [&_h3]:font-medium [&_h3]:text-zinc-200 [&_li]:text-zinc-300 [&_p]:text-zinc-300 [&_strong]:text-zinc-200">
            <MessageResponse>{assistantText}</MessageResponse>
          </div>
        )}
      </div>
    </div>
  );
}
