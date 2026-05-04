import type { MetadataRoute } from "next";

const SITE = "https://huamei.io";

// AI crawler allowlist per playbook §6.5. Each rule is explicit so
// changes are auditable; the wildcard `*` covers everything else.
//
// Disallowed paths are kept out for ALL agents — they are either
// API-only (/api) or robots-disallowed feature pages (/portal).
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/portal"],
      },

      // OpenAI / ChatGPT
      { userAgent: "GPTBot",          allow: "/" },
      { userAgent: "OAI-SearchBot",   allow: "/" },
      { userAgent: "ChatGPT-User",    allow: "/" },

      // Anthropic / Claude
      { userAgent: "ClaudeBot",       allow: "/" },
      { userAgent: "anthropic-ai",    allow: "/" },

      // Perplexity
      { userAgent: "PerplexityBot",   allow: "/" },

      // Google AI training (separate from Googlebot — must opt in
      // explicitly to be cited in AI Overviews / Gemini)
      { userAgent: "Google-Extended", allow: "/" },

      // Common Crawl + Cohere training corpus
      { userAgent: "CCBot",           allow: "/" },
      { userAgent: "cohere-ai",       allow: "/" },

      // ByteDance (Bytespider) — feeds Doubao + TikTok search
      { userAgent: "Bytespider",      allow: "/" },

      // Apple Intelligence
      { userAgent: "Applebot-Extended", allow: "/" },
    ],
    sitemap: `${SITE}/sitemap.xml`,
  };
}
