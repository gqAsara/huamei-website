/**
 * AI engine adapters for the GEO probe.
 *
 * Claude + OpenAI route through Vercel AI Gateway using the `gateway()`
 * provider from the `ai` package. On Vercel runtime, OIDC-based auth is
 * implicit; locally, set AI_GATEWAY_API_KEY in .env.local to test.
 *
 * Perplexity uses the Sonar API directly (no gateway middleman); needs
 * PERPLEXITY_API_KEY.
 */

import { generateText, gateway } from "ai";
import { anthropic } from "@ai-sdk/anthropic";
import { openai } from "@ai-sdk/openai";

export type Engine = "claude" | "openai" | "perplexity";

export type ProbeResult = {
  engine: Engine;
  model: string;
  text: string;
  citedUrls: string[];
  error?: string;
};

const CLAUDE_MODEL = "claude-sonnet-4-6";
const OPENAI_MODEL = "gpt-5-mini";
const PERPLEXITY_MODEL = "sonar";

const SYSTEM_PROMPT =
  "Answer the user's question as you normally would. Cite sources where relevant. Keep responses concise and on-topic.";

function extractUrls(text: string): string[] {
  if (!text) return [];
  // RFC-permissive URL regex; captures http/https links including in markdown.
  const matches = text.match(/https?:\/\/[^\s)>\]"']+/gi) ?? [];
  // Normalize: strip trailing punctuation, dedupe, lowercase host.
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
async function probeClaude(prompt: string): Promise<ProbeResult> {
  try {
    const result = await generateText({
      // gateway() routes through Vercel AI Gateway — picks up OIDC auth
      // on Vercel runtime automatically, no ANTHROPIC_API_KEY required.
      model: gateway(`anthropic/${CLAUDE_MODEL}`),
      system: SYSTEM_PROMPT,
      prompt,
      tools: {
        web_search: anthropic.tools.webSearch_20250305({ maxUses: 5 }) as any,
      },
      stopWhen: ({ steps }: { steps: unknown[] }) => steps.length >= 6,
    } as any);
    const text = (result as any).text ?? "";
    const sourceUrls = ((result as any).sources ?? [])
      .map((s: { url?: string }) => s.url)
      .filter((u: string | undefined): u is string => Boolean(u));
    const citedUrls = Array.from(new Set([...sourceUrls, ...extractUrls(text)]));
    return { engine: "claude", model: CLAUDE_MODEL, text, citedUrls };
  } catch (err) {
    return {
      engine: "claude",
      model: CLAUDE_MODEL,
      text: "",
      citedUrls: [],
      error: err instanceof Error ? err.message : String(err),
    };
  }
}

async function probeOpenAI(prompt: string): Promise<ProbeResult> {
  try {
    const result = await generateText({
      // Gateway routing for OpenAI too. Note: gateway uses Chat
      // Completions (not Responses API) under the hood — that's fine
      // for web_search; OpenAI's web_search tool works on both.
      model: gateway(`openai/${OPENAI_MODEL}`),
      system: SYSTEM_PROMPT,
      prompt,
      tools: {
        web_search: openai.tools.webSearch({}) as any,
      },
      stopWhen: ({ steps }: { steps: unknown[] }) => steps.length >= 4,
    } as any);
    const text = (result as any).text ?? "";
    const sourceUrls = ((result as any).sources ?? [])
      .map((s: { url?: string }) => s.url)
      .filter((u: string | undefined): u is string => Boolean(u));
    const citedUrls = Array.from(new Set([...sourceUrls, ...extractUrls(text)]));
    return { engine: "openai", model: OPENAI_MODEL, text, citedUrls };
  } catch (err) {
    return {
      engine: "openai",
      model: OPENAI_MODEL,
      text: "",
      citedUrls: [],
      error: err instanceof Error ? err.message : String(err),
    };
  }
}
/* eslint-enable @typescript-eslint/no-explicit-any */

/**
 * Perplexity Sonar — direct REST API call (web search is built-in to the
 * model, no separate tool wiring required). Returns citations in the
 * response payload natively.
 */
async function probePerplexity(prompt: string): Promise<ProbeResult> {
  try {
    const apiKey = process.env.PERPLEXITY_API_KEY;
    if (!apiKey) {
      return {
        engine: "perplexity",
        model: PERPLEXITY_MODEL,
        text: "",
        citedUrls: [],
        error: "PERPLEXITY_API_KEY not set",
      };
    }
    const res = await fetch("https://api.perplexity.ai/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: PERPLEXITY_MODEL,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: prompt },
        ],
        return_citations: true,
      }),
    });
    if (!res.ok) {
      const detail = await res.text();
      return {
        engine: "perplexity",
        model: PERPLEXITY_MODEL,
        text: "",
        citedUrls: [],
        error: `HTTP ${res.status}: ${detail.slice(0, 200)}`,
      };
    }
    const data = (await res.json()) as {
      choices?: { message?: { content?: string } }[];
      citations?: string[];
    };
    const text = data.choices?.[0]?.message?.content ?? "";
    const apiCitations = data.citations ?? [];
    const citedUrls = Array.from(new Set([...apiCitations, ...extractUrls(text)]));
    return { engine: "perplexity", model: PERPLEXITY_MODEL, text, citedUrls };
  } catch (err) {
    return {
      engine: "perplexity",
      model: PERPLEXITY_MODEL,
      text: "",
      citedUrls: [],
      error: err instanceof Error ? err.message : String(err),
    };
  }
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
