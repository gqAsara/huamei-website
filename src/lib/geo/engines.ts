/**
 * AI engine adapters for the GEO probe.
 *
 * All three engines route through OpenRouter using its OpenAI-compatible
 * REST API. The `:online` suffix activates Exa-powered web search for
 * any model that doesn't have search natively (Claude, GPT). Perplexity
 * Sonar has search built in.
 *
 * Citations come back as URLs embedded in the response text; we extract
 * them with `extractUrls()` and also surface any `sources` the AI SDK
 * exposes from the response.
 */

import { generateText } from "ai";
import { createOpenAICompatible } from "@ai-sdk/openai-compatible";

export type Engine = "claude" | "openai" | "perplexity";

export type ProbeResult = {
  engine: Engine;
  model: string;
  text: string;
  citedUrls: string[];
  error?: string;
};

// Model slugs as they appear on OpenRouter. Keep the bare Anthropic /
// OpenAI ids for storage; add `:online` to the request to turn on web
// search for Claude + GPT. Perplexity Sonar has search native.
const CLAUDE_MODEL = "claude-sonnet-4-6";
const OPENAI_MODEL = "gpt-5-mini";
const PERPLEXITY_MODEL = "sonar";

const OPENROUTER_CLAUDE = "anthropic/claude-sonnet-4.6:online";
const OPENROUTER_OPENAI = "openai/gpt-5-mini:online";
const OPENROUTER_PERPLEXITY = "perplexity/sonar";

const SYSTEM_PROMPT =
  "Answer the user's question as you normally would. Cite sources where relevant. Keep responses concise and on-topic.";

const openrouter = createOpenAICompatible({
  name: "openrouter",
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY ?? "",
  headers: {
    // OpenRouter uses these for attribution on their leaderboard.
    "HTTP-Referer": "https://huamei.io",
    "X-Title": "HuameiGEO",
  },
});

function extractUrls(text: string): string[] {
  if (!text) return [];
  const matches = text.match(/https?:\/\/[^\s)>\]"']+/gi) ?? [];
  const seen = new Set<string>();
  const out: string[] = [];
  for (const raw of matches) {
    const cleaned = raw.replace(/[.,;:!?)>\]"']+$/, "");
    try {
      const u = new URL(cleaned);
      const norm = `${u.protocol}//${u.host.toLowerCase()}${u.pathname.replace(/\/$/, "")}`;
      if (!seen.has(norm)) {
        seen.add(norm);
        out.push(cleaned);
      }
    } catch {
      // Skip malformed URLs.
    }
  }
  return out;
}

/* eslint-disable @typescript-eslint/no-explicit-any */
async function probeViaOpenRouter(
  engine: Engine,
  displayModel: string,
  routerModel: string,
  prompt: string,
): Promise<ProbeResult> {
  if (!process.env.OPENROUTER_API_KEY) {
    return {
      engine,
      model: displayModel,
      text: "",
      citedUrls: [],
      error: "OPENROUTER_API_KEY not set",
    };
  }
  try {
    const result = await generateText({
      model: openrouter(routerModel),
      system: SYSTEM_PROMPT,
      prompt,
    } as any);
    const text = (result as any).text ?? "";
    const sourceUrls = ((result as any).sources ?? [])
      .map((s: { url?: string }) => s.url)
      .filter((u: string | undefined): u is string => Boolean(u));
    const citedUrls = Array.from(new Set([...sourceUrls, ...extractUrls(text)]));
    return { engine, model: displayModel, text, citedUrls };
  } catch (err) {
    return {
      engine,
      model: displayModel,
      text: "",
      citedUrls: [],
      error: err instanceof Error ? err.message : String(err),
    };
  }
}
/* eslint-enable @typescript-eslint/no-explicit-any */

async function probeClaude(prompt: string): Promise<ProbeResult> {
  return probeViaOpenRouter("claude", CLAUDE_MODEL, OPENROUTER_CLAUDE, prompt);
}

async function probeOpenAI(prompt: string): Promise<ProbeResult> {
  return probeViaOpenRouter("openai", OPENAI_MODEL, OPENROUTER_OPENAI, prompt);
}

async function probePerplexity(prompt: string): Promise<ProbeResult> {
  return probeViaOpenRouter("perplexity", PERPLEXITY_MODEL, OPENROUTER_PERPLEXITY, prompt);
}

const PROBES: Record<Engine, (prompt: string) => Promise<ProbeResult>> = {
  claude: probeClaude,
  openai: probeOpenAI,
  perplexity: probePerplexity,
};

export async function probeEngine(
  engine: Engine,
  prompt: string,
): Promise<ProbeResult> {
  return PROBES[engine](prompt);
}

export const ENGINES: Engine[] = ["claude", "openai", "perplexity"];
