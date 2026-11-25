import { defineArrayMember, defineField, defineType } from "sanity";

export const packagingNewsEdition = defineType({
  name: "packagingNewsEdition",
  title: "Packaging news edition",
  type: "document",
  fields: [
    defineField({ name: "date", title: "Edition date (Shanghai)", type: "date", readOnly: true }),
    defineField({ name: "publishedAt", title: "First published", type: "datetime", readOnly: true }),
    defineField({ name: "title", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "summary", type: "text", rows: 2, validation: (rule) => rule.required() }),
    defineField({
      name: "items",
      title: "Stories",
      type: "array",
      validation: (rule) => rule.required().min(1).max(3),
      of: [
        defineArrayMember({
          name: "packagingNewsStory",
          type: "object",
          fields: [
            defineField({ name: "title", type: "string", validation: (rule) => rule.required() }),
            defineField({ name: "summary", type: "text", rows: 3, validation: (rule) => rule.required() }),
            defineField({ name: "buyerNote", title: "Buyer note", type: "text", rows: 3, validation: (rule) => rule.required() }),
            defineField({ name: "sourceName", title: "Source", type: "string", validation: (rule) => rule.required() }),
            defineField({ name: "sourceUrl", title: "Original article", type: "url", validation: (rule) => rule.required().uri({ scheme: ["https"] }) }),
            defineField({ name: "sourceDate", title: "Original publication date", type: "date", validation: (rule) => rule.required() }),
            defineField({
              name: "kind", title: "Story type", type: "string",
              options: { list: [{ title: "Industry news", value: "news" }, { title: "Buyer reference", value: "reference" }] },
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
