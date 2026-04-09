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

  const assistantText =
    assistantMessage?.parts
      ?.filter(
        (part): part is Extract<typeof part, { type: "text" }> =>
          part.type === "text"
      )
      .map((part) => part.text)
      .join("") || "";

  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden mb-6">
      <div className="flex items-center justify-between px-5 py-4 border-b border-border">
        <div className="flex items-center gap-2.5">
          <div className="w-2 h-2 rounded-full bg-lime animate-pulse" />
          <span className="text-base font-semibold tracking-tight">
            AI Executive Briefing
          </span>
        </div>
        {!hasStarted && (
          <button
            onClick={handleGenerate}
            className="px-5 py-2.5 rounded-full text-sm font-semibold bg-foreground text-background hover:opacity-90 transition-opacity"
          >
            Generate Briefing
          </button>
        )}
        {isStreaming && (
          <span className="text-sm font-mono text-muted-foreground animate-pulse">
            analyzing...
          </span>
        )}
      </div>

      <div className="px-5 py-4">
        {!hasStarted && (
          <p className="text-base text-muted-foreground">
            Click &quot;Generate Briefing&quot; for an AI-powered summary of
            today&apos;s most important AI developments.
          </p>
        )}

        {hasStarted && !assistantText && isStreaming && (
          <div className="space-y-2.5">
            <div className="h-3 bg-muted rounded-full animate-pulse w-full" />
            <div className="h-3 bg-muted rounded-full animate-pulse w-4/5" />
            <div className="h-3 bg-muted rounded-full animate-pulse w-3/5" />
          </div>
        )}

        {assistantText && (
          <div className="text-base leading-relaxed [&_h2]:text-base [&_h2]:font-semibold [&_h2]:text-foreground [&_h3]:text-base [&_h3]:font-medium [&_li]:text-foreground/80 [&_p]:text-foreground/80 [&_strong]:text-foreground">
            <MessageResponse>{assistantText}</MessageResponse>
          </div>
        )}
      </div>
    </div>
  );
}
