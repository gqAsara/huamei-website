import { defineField, defineType } from "sanity";

export const industry = defineType({
  name: "industry",
  title: "Industry",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Industry name",
      type: "string",
      description:
        "How this industry appears as a filter on /volumes (e.g. 'Cosmetics', 'Spirits').",
      validation: (Rule) => Rule.required().min(2).max(40),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      description:
        "Lowercase URL-safe identifier. Used internally; not visible on the site.",
      options: {
        source: "title",
        maxLength: 40,
        slugify: (input) =>
          input
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, ""),
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "order",
      title: "Sort order",
      type: "number",
      description:
        "Lower numbers appear first in the filter row. Leave blank for alphabetical.",
    }),
  ],
  preview: {
    select: { title: "title", subtitle: "slug.current" },
  },
  orderings: [
    {
      title: "Sort order",
      name: "orderAsc",
      by: [{ field: "order", direction: "asc" }],
    },
    {
      title: "Alphabetical",
      name: "titleAsc",
      by: [{ field: "title", direction: "asc" }],
    },
  ],
});
