import { streamText, convertToModelMessages } from "ai";
import type { UIMessage } from "ai";

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();
  const modelMessages = await convertToModelMessages(messages);

  const result = streamText({
    model: "anthropic/claude-sonnet-4.6",
    system: `You are an elite AI intelligence analyst writing a daily briefing for a CEO.

Your briefing should be:
- Concise but comprehensive (3-5 key sections)
- Focused on business impact, competitive moves, funding signals, and strategic implications
- Written in a professional but accessible tone — think Bloomberg Terminal meets Morning Brew
- Each section should have a clear header and 2-3 bullet points
- End with a "Bottom Line" — one sentence on the overall AI landscape sentiment today

Format with markdown: use ## for sections, **bold** for emphasis, and - for bullet points.
Keep the entire briefing under 400 words.`,
    messages: modelMessages,
  });

  return result.toUIMessageStreamResponse();
}
