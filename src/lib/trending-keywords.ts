import { NewsItem } from "./types";
import { WATCHLIST_COMPANIES } from "./constants";

// Tech-domain terms we explicitly want to surface as trending. Stored in their
// canonical display form. Matched case-insensitively against title + summary.
const TECH_TERMS = [
  // model families
  "GPT-5", "GPT-4", "GPT-4o", "o1", "o3", "Claude", "Gemini", "Llama", "Mistral",
  "Mixtral", "Phi", "Qwen", "DeepSeek", "Command", "Grok", "Stable Diffusion",
  "DALL-E", "Sora", "Veo", "Imagen", "Midjourney", "Flux",
  // techniques / paradigms
  "RAG", "MCP", "RLHF", "DPO", "RLAIF", "SFT", "LoRA", "QLoRA", "PEFT",
  "Diffusion", "Transformer", "Mamba", "Mixture of Experts", "MoE", "CoT",
  "Chain of Thought", "Tree of Thought", "ReAct", "Agentic", "Agents",
  "Reasoning", "Inference", "Quantization", "Distillation", "Embedding",
  "Multimodal", "Vision Language", "VLM", "Speech", "TTS", "ASR", "Whisper",
  // infra / runtimes
  "CUDA", "Triton", "TensorRT", "vLLM", "SGLang", "ONNX", "GGUF", "Ollama",
  "LangChain", "LlamaIndex", "Haystack", "DSPy",
  // commerce / context
  "API", "SDK", "Open Source", "Open-Weights", "Open Weights", "Self-Hosted",
  "Edge", "On-Device", "Robotics", "AGI", "Superintelligence", "Alignment",
  "Safety", "Red Team", "Jailbreak", "Hallucination", "Bench", "Benchmark",
  "SOTA", "Eval", "Vibe Coding",
];

// Exclude company names so this lane is conceptually distinct from the
// company watchlist.
const COMPANY_NAMES = new Set(
  WATCHLIST_COMPANIES.flatMap((c) => [c.name.toLowerCase(), ...c.aliases.map((a) => a.toLowerCase())])
);

export interface TrendingKeyword {
  term: string;
  count: number;
}

export function trendingKeywords(items: NewsItem[], limit = 14): TrendingKeyword[] {
  const counts = new Map<string, number>();

  for (const item of items) {
    const hay = `${item.title} ${item.summary ?? ""}`.toLowerCase();
    for (const term of TECH_TERMS) {
      const lower = term.toLowerCase();
      if (COMPANY_NAMES.has(lower)) continue;
      // word-boundary-ish check; allow hyphens within term
      const escaped = lower.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const re = new RegExp(`(^|[^a-z0-9])${escaped}([^a-z0-9]|$)`, "i");
      if (re.test(hay)) {
        counts.set(term, (counts.get(term) ?? 0) + 1);
      }
    }
  }

  return [...counts.entries()]
    .map(([term, count]) => ({ term, count }))
    .sort((a, b) => b.count - a.count || a.term.localeCompare(b.term))
    .slice(0, limit);
}
