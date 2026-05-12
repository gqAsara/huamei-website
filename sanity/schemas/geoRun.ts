import { defineField, defineType } from "sanity";

const ENGINES = [
  { title: "Claude (Anthropic)", value: "claude" },
  { title: "ChatGPT (OpenAI)", value: "openai" },
  { title: "Perplexity (Sonar)", value: "perplexity" },
];

export const geoRun = defineType({
  name: "geoRun",
  title: "GEO run",
  type: "document",
  fields: [
    defineField({
      name: "prompt",
      title: "Prompt",
      type: "reference",
      to: [{ type: "geoPrompt" }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "promptText",
      title: "Prompt text (denormalized)",
      type: "string",
      description: "Copy of the prompt text at run time. Lets us preserve history if the prompt is later edited.",
    }),
    defineField({
      name: "engine",
      title: "Engine",
      type: "string",
      options: { list: ENGINES, layout: "radio" },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "model",
      title: "Model",
      type: "string",
      description: "Specific model used (e.g. claude-sonnet-4-6, gpt-5-mini, sonar-pro).",
    }),
    defineField({
      name: "runAt",
      title: "Run timestamp",
      type: "datetime",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "responseText",
      title: "Response text",
      type: "text",
      rows: 12,
      description: "Full response body from the engine.",
    }),
    defineField({
      name: "citedUrls",
      title: "All cited URLs",
      type: "array",
      of: [{ type: "string" }],
      description: "Every URL the response cited or surfaced in citations metadata.",
    }),
    defineField({
      name: "ourDomainCited",
      title: "huamei.io cited?",
      type: "boolean",
      description: "True if the response cited or named huamei.io / Huamei.",
    }),
    defineField({
      name: "ourBrandMentioned",
      title: "Huamei mentioned by name?",
      type: "boolean",
      description: "True if the response said 'Huamei' anywhere in the text, even without a URL.",
    }),
    defineField({
      name: "ourCitationContext",
      title: "Context around our citation",
      type: "text",
      rows: 4,
      description: "Sentence(s) where huamei.io / Huamei appears.",
    }),
    defineField({
      name: "competitorsCited",
      title: "Competitors cited",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "brand", type: "string", title: "Brand" },
            { name: "domain", type: "string", title: "Domain" },
          ],
        },
      ],
    }),
    defineField({
      name: "error",
      title: "Error",
      type: "text",
      rows: 2,
      description: "Set if the probe failed. Empty on success.",
    }),
  ],
  preview: {
    select: {
      title: "promptText",
      engine: "engine",
      runAt: "runAt",
      cited: "ourDomainCited",
      mentioned: "ourBrandMentioned",
      error: "error",
    },
    prepare({ title, engine, runAt, cited, mentioned, error }) {
      const date = runAt ? new Date(runAt).toISOString().slice(0, 10) : "?";
      const marker = error ? "✗" : cited ? "★" : mentioned ? "◐" : "○";
      return {
        title: `${marker} [${engine}] ${title?.slice(0, 80) ?? "(no text)"}`,
        subtitle: `${date}`,
      };
    },
  },
  orderings: [
    {
      title: "Newest first",
      name: "runAtDesc",
      by: [{ field: "runAt", direction: "desc" }],
    },
  ],
});
