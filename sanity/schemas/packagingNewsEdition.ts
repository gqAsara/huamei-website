import { defineArrayMember, defineField, defineType } from "sanity";

export const packagingNewsEdition = defineType({
  name: "packagingNewsEdition",
  title: "Daily packaging question",
  type: "document",
  fields: [
    defineField({ name: "date", title: "Publication date (Shanghai)", type: "date", readOnly: true }),
    defineField({ name: "publishedAt", title: "First published", type: "datetime", readOnly: true }),
    defineField({ name: "title", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "summary", type: "text", rows: 2, validation: (rule) => rule.required() }),
    defineField({
      name: "study", title: "Weekly packaging study", type: "object",
      fields: [
        defineField({ name: "title", title: "Data table title", type: "string", validation: (rule) => rule.required() }),
        defineField({ name: "method", title: "Methods", type: "text", validation: (rule) => rule.required() }),
        defineField({ name: "columns", title: "Column headings", type: "array", of: [{ type: "string" }], validation: (rule) => rule.required().min(2) }),
        defineField({
          name: "rows", title: "Table rows", type: "array", validation: (rule) => rule.required().min(1),
          of: [defineArrayMember({
            name: "packagingResearchRow", type: "object",
            fields: [defineField({
              name: "cells", type: "array", of: [{ type: "string" }], validation: (rule) => rule.required().min(2),
            })],
            preview: { select: { title: "cells.0" } },
          })],
        }),
        defineField({ name: "findings", type: "array", of: [{ type: "string" }], validation: (rule) => rule.required().min(1) }),
        defineField({ name: "limitations", type: "text", validation: (rule) => rule.required() }),
      ],
    }),
    defineField({
      name: "items",
      title: "Answers and earlier stories",
      type: "array",
      validation: (rule) => rule.required().min(1).max(3),
      of: [
        defineArrayMember({
          name: "packagingNewsStory",
          type: "object",
          fields: [
            defineField({ name: "title", type: "string", validation: (rule) => rule.required() }),
            defineField({ name: "summary", type: "text", rows: 3, validation: (rule) => rule.required() }),
            defineField({ name: "buyerNote", title: "Practical example", type: "text", rows: 3, validation: (rule) => rule.required() }),
            defineField({ name: "sourceName", title: "Source", type: "string", validation: (rule) => rule.required() }),
            defineField({ name: "sourceUrl", title: "Original article", type: "url", validation: (rule) => rule.required().uri({ scheme: ["https"] }) }),
            defineField({ name: "sourceDate", title: "Original publication date", type: "date", validation: (rule) => rule.required() }),
            defineField({
              name: "image", title: "Editorial photograph", type: "object",
              fields: [
                defineField({ name: "url", title: "Website image path", type: "string", validation: (rule) => rule.required().regex(/^\/news-media\/[a-z0-9_-]+(?:\.[a-z0-9_-]+)*\.(?:jpe?g|webp|png)$/i) }),
                defineField({ name: "alt", title: "Image description and caption", type: "text", rows: 2, validation: (rule) => rule.required() }),
                defineField({ name: "credit", title: "Photographer or rights holder (internal)", type: "string", validation: (rule) => rule.required() }),
                defineField({ name: "sourceUrl", title: "Original image page (internal)", type: "url", validation: (rule) => rule.required().uri({ scheme: ["https"] }) }),
                defineField({ name: "license", title: "Licence (internal)", type: "string", validation: (rule) => rule.required() }),
                defineField({ name: "licenseUrl", title: "Licence terms (internal)", type: "url", validation: (rule) => rule.uri({ scheme: ["https"] }) }),
              ],
            }),
            defineField({
              name: "kind", title: "Entry type", type: "string",
              options: { list: [{ title: "Packaging question", value: "question" }, { title: "Industry news", value: "news" }, { title: "Buyer reference", value: "reference" }] },
              validation: (rule) => rule.required(),
            }),
          ],
          preview: { select: { title: "title", subtitle: "sourceName" } },
        }),
      ],
    }),
  ],
  preview: { select: { title: "title", subtitle: "date" } },
});
