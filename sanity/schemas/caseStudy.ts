import { defineField, defineType } from "sanity";

export const caseStudy = defineType({
  name: "caseStudy",
  title: "Case study",
  type: "document",
  groups: [
    { name: "core", title: "Core", default: true },
    { name: "media", title: "Photos" },
    { name: "meta", title: "Metadata" },
  ],
  fields: [
    defineField({
      name: "num",
      title: "Volume number",
      type: "string",
      group: "core",
      description:
        "Roman numeral as it appears on the site (e.g. 'XXXI', 'XXX', 'I'). Site lists in this order.",
      validation: (Rule) =>
        Rule.required().regex(/^[IVXLCDM]+$/, {
          name: "Roman numeral",
          invert: false,
        }),
    }),
    defineField({
      name: "name",
      title: "Project name",
      type: "string",
      group: "core",
      description: "Title shown on /volumes and on the case page itself.",
      validation: (Rule) => Rule.required().min(2).max(60),
    }),
    defineField({
      name: "slug",
      title: "Slug (URL)",
      type: "slug",
      group: "core",
      description:
        "Becomes /volumes/<slug>. Lowercase, hyphenated. Don't change after publish — it breaks links.",
      options: {
        source: "name",
        maxLength: 60,
        slugify: (input) =>
          input
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, ""),
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "client",
      title: "Client",
      type: "string",
      group: "core",
      description:
        "Brand or studio name as shown publicly. Use 'House design' for in-house work.",
      validation: (Rule) => Rule.required().max(60),
    }),
    defineField({
      name: "tag",
      title: "Tag line",
      type: "string",
      group: "core",
      description:
        "One-line descriptor. Format: 'Category · Description' (e.g. 'Cosmetics · Magnetic flap').",
      validation: (Rule) => Rule.required().max(80),
    }),
    defineField({
      name: "year",
      title: "Year",
      type: "number",
      group: "core",
      description: "Year of the project, used for filters.",
      validation: (Rule) => Rule.required().min(1992).max(2100),
    }),
    defineField({
      name: "industry",
      title: "Industry",
      type: "reference",
      to: [{ type: "industry" }],
      group: "core",
      description: "Pick from the dropdown. To add a new industry, go to Industries.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "section",
      title: "Section",
      type: "string",
      group: "core",
      description:
        "Which list this case appears in. 'Branded' for named-client work; 'DTC' for House design + DTC brand work.",
      options: {
        list: [
          { title: "Branded (named clients)", value: "branded" },
          { title: "DTC (House design + DTC brand)", value: "dtc" },
        ],
        layout: "radio",
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "featured",
      title: "Featured",
      type: "boolean",
      group: "core",
      description:
        "Highlight on the homepage / archive page. Keep total featured under ~8.",
      initialValue: false,
    }),
    defineField({
      name: "cover",
      title: "Cover photo",
      type: "image",
      group: "media",
      description:
        "Single photo shown on /volumes index. Recommend 1600×1200 or larger; will be served at multiple sizes.",
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "photos",
      title: "Photo gallery",
      type: "array",
      group: "media",
      description:
        "Additional photos shown on the case page. Order matters; drag to reorder.",
      of: [
        {
          type: "image",
          options: { hotspot: true },
          fields: [
            {
              name: "alt",
              title: "Alt text",
              type: "string",
              description:
                "Short description for screen readers (e.g. 'Closed magnetic-flap box, side view').",
            },
          ],
        },
      ],
      validation: (Rule) => Rule.min(1).max(20),
    }),
    defineField({
      name: "aiGenerated",
      title: "AI generated",
      type: "boolean",
      group: "meta",
      readOnly: true,
      hidden: ({ document }) => !document?.aiGenerated,
      description:
        "True if this case study was created by the AI intake from a submission.",
    }),
    defineField({
      name: "sourceSubmission",
      title: "Source submission",
      type: "reference",
      to: [{ type: "caseStudySubmission" }],
      group: "meta",
      readOnly: true,
      hidden: ({ document }) => !document?.sourceSubmission,
      description: "Link back to the submission that generated this case study.",
    }),
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "client",
      media: "cover",
      year: "year",
    },
    prepare({ title, subtitle, media, year }) {
      return {
        title,
        subtitle: `${subtitle ?? ""}${year ? " · " + year : ""}`,
        media,
      };
    },
  },
  orderings: [
    {
      title: "Year (newest first)",
      name: "yearDesc",
      by: [{ field: "year", direction: "desc" }],
    },
    {
      title: "Featured first",
      name: "featuredFirst",
      by: [
        { field: "featured", direction: "desc" },
        { field: "year", direction: "desc" },
      ],
    },
  ],
});
