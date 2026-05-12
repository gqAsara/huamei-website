import { defineField, defineType } from "sanity";

const STAGES = [
  { title: "Discovery (general awareness)", value: "discovery" },
  { title: "Evaluation (comparing approaches)", value: "evaluation" },
  { title: "Comparison (vendor shortlist)", value: "comparison" },
  { title: "Decision (chosen vendor)", value: "decision" },
  { title: "Procurement (RFQ-ready)", value: "procurement" },
];

const INTENTS = [
  { title: "Informational (learn)", value: "informational" },
  { title: "Investigative (compare)", value: "investigative" },
  { title: "Commercial (evaluate vendors)", value: "commercial" },
  { title: "Transactional (ready to buy)", value: "transactional" },
];

export const geoPrompt = defineType({
  name: "geoPrompt",
  title: "GEO prompt",
  type: "document",
  groups: [
    { name: "core", title: "Prompt", default: true },
    { name: "meta", title: "Metadata" },
  ],
  fields: [
    defineField({
      name: "text",
      title: "Prompt text",
      type: "text",
      rows: 2,
      group: "core",
      description: "The buyer question we want to track. Phrase as a real user would type into ChatGPT / Claude / Perplexity.",
      validation: (Rule) => Rule.required().min(10).max(280),
    }),
    defineField({
      name: "isActive",
      title: "Active",
      type: "boolean",
      group: "core",
      initialValue: true,
      description: "Inactive prompts are skipped by the weekly cron. Keep on unless retired.",
    }),
    defineField({
      name: "stage",
      title: "Buyer-journey stage",
      type: "string",
      group: "meta",
      options: { list: STAGES, layout: "dropdown" },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "intent",
      title: "Intent type",
      type: "string",
      group: "meta",
      options: { list: INTENTS, layout: "dropdown" },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "priority",
      title: "Priority",
      type: "number",
      group: "meta",
      description: "1 = high (pillar topics), 5 = low (long-tail). Used to sort the dashboard.",
      validation: (Rule) => Rule.min(1).max(5).integer(),
      initialValue: 3,
    }),
    defineField({
      name: "notes",
      title: "Notes",
      type: "text",
      rows: 2,
      group: "meta",
      description: "Why we're tracking this prompt. Free text.",
    }),
  ],
  preview: {
    select: { title: "text", stage: "stage", isActive: "isActive", priority: "priority" },
    prepare({ title, stage, isActive, priority }) {
      const dot = isActive ? "●" : "○";
      return {
        title: `${dot} ${title}`,
        subtitle: `${stage ?? "?"} · p${priority ?? "?"}`,
      };
    },
  },
  orderings: [
    {
      title: "By priority",
      name: "priorityAsc",
      by: [
        { field: "priority", direction: "asc" },
        { field: "_createdAt", direction: "desc" },
      ],
    },
    {
      title: "By stage",
      name: "byStage",
      by: [
        { field: "stage", direction: "asc" },
        { field: "priority", direction: "asc" },
      ],
    },
  ],
});
