export const WATCHLIST_COMPANIES = [
  { name: "OpenAI", aliases: ["openai", "chatgpt", "gpt-4", "gpt-5", "sam altman", "gpt"] },
  { name: "Anthropic", aliases: ["anthropic", "claude", "dario amodei"] },
  { name: "Google DeepMind", aliases: ["deepmind", "gemini", "google ai", "google brain"] },
  { name: "Meta AI", aliases: ["meta ai", "llama", "fair", "meta llama"] },
  { name: "Microsoft", aliases: ["microsoft", "copilot", "azure ai", "bing ai"] },
  { name: "Mistral", aliases: ["mistral"] },
  { name: "xAI", aliases: ["xai", "grok"] },
  { name: "Cohere", aliases: ["cohere"] },
  { name: "Stability AI", aliases: ["stability ai", "stable diffusion", "stability"] },
  { name: "Perplexity", aliases: ["perplexity"] },
  { name: "Nvidia", aliases: ["nvidia", "cuda", "tensorrt"] },
  { name: "Apple", aliases: ["apple intelligence", "apple ai", "apple ml"] },
  { name: "Amazon", aliases: ["amazon bedrock", "aws ai", "alexa ai"] },
  { name: "Hugging Face", aliases: ["hugging face", "huggingface", "transformers"] },
] as const;

export const CATEGORY_KEYWORDS: Record<string, string[]> = {
  funding: [
    "raises", "raised", "funding", "series a", "series b", "series c", "series d",
    "valuation", "investment", "investor", "ipo", "venture", "seed round", "million",
    "billion", "capital", "fundraise", "backed",
  ],
  "product-launch": [
    "launches", "launched", "release", "released", "announces", "announced",
    "unveils", "unveiled", "introduces", "ships", "shipped", "new model",
    "now available", "rolling out", "beta", "preview", "generally available",
  ],
  research: [
    "paper", "arxiv", "study", "researchers", "breakthrough", "benchmark",
    "state-of-the-art", "sota", "findings", "published", "preprint",
    "experiment", "ablation", "fine-tuning", "training",
  ],
  policy: [
    "regulation", "eu ai act", "congress", "senate", "ban", "law",
    "safety", "governance", "executive order", "compliance", "audit",
    "ethics", "bias", "alignment", "legislation",
  ],
  "big-tech": [
    "google", "meta", "apple", "microsoft", "amazon", "openai", "anthropic",
    "nvidia", "tesla", "deepmind",
  ],
  "open-source": [
    "open-source", "open source", "github", "weights", "llama", "mistral",
    "apache", "mit license", "hugging face", "community", "self-hosted",
  ],
};

export const RSS_FEEDS = [
  { url: "https://techcrunch.com/category/artificial-intelligence/feed/", name: "TechCrunch" },
  { url: "https://www.theverge.com/rss/ai-artificial-intelligence/index.xml", name: "The Verge" },
  { url: "https://feeds.arstechnica.com/arstechnica/technology-lab", name: "Ars Technica" },
  { url: "https://venturebeat.com/category/ai/feed/", name: "VentureBeat" },
  { url: "https://www.technologyreview.com/feed/", name: "MIT Tech Review" },
];

export const REDDIT_SUBREDDITS = [
  "MachineLearning",
  "artificial",
  "LocalLLaMA",
];

export const AI_KEYWORDS = [
  "ai", "artificial intelligence", "machine learning", "deep learning",
  "llm", "large language model", "gpt", "chatgpt", "claude", "gemini",
  "neural network", "transformer", "diffusion", "generative ai",
  "foundation model", "fine-tuning", "rag", "retrieval augmented",
  "openai", "anthropic", "deepmind", "mistral", "llama", "copilot",
  "agent", "agentic", "multimodal", "vision model", "embedding",
  "inference", "training", "gpu", "tensor", "prompt", "reasoning",
];

export const SOURCE_COLORS: Record<string, { bg: string; text: string }> = {
  hackernews: { bg: "bg-orange-500/15", text: "text-orange-400" },
  reddit: { bg: "bg-blue-500/15", text: "text-blue-400" },
  rss: { bg: "bg-emerald-500/15", text: "text-emerald-400" },
  arxiv: { bg: "bg-purple-500/15", text: "text-purple-400" },
  twitter: { bg: "bg-zinc-500/15", text: "text-zinc-400" },
};

export const SOURCE_LABELS: Record<string, string> = {
  hackernews: "HN",
  reddit: "Reddit",
  rss: "News",
  arxiv: "ArXiv",
  twitter: "Twitter",
};
