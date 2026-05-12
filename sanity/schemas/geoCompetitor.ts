import { defineField, defineType } from "sanity";

export const geoCompetitor = defineType({
  name: "geoCompetitor",
  title: "GEO competitor",
  type: "document",
  fields: [
    defineField({
      name: "brand",
      title: "Brand name",
      type: "string",
      description: "How the brand refers to itself. Used for textual mention detection in AI responses.",
      validation: (Rule) => Rule.required().min(2).max(60),
    }),
    defineField({
      name: "domains",
      title: "Domains",
      type: "array",
      of: [{ type: "string" }],
      description: "All domains we should treat as 'this competitor cited' (e.g. example.com, www.example.com).",
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: "isActive",
      title: "Active",
      type: "boolean",
      initialValue: true,
    }),
    defineField({
      name: "notes",
      title: "Notes",
      type: "text",
      rows: 2,
      description: "Why we're tracking this competitor.",
    }),
  ],
  preview: {
    select: { title: "brand", subtitle: "domains.0", isActive: "isActive" },
    prepare({ title, subtitle, isActive }) {
      const dot = isActive ? "●" : "○";
      return { title: `${dot} ${title}`, subtitle };
    },
  },
});
