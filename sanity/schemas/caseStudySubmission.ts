import { defineField, defineType } from "sanity";

const STATUS_OPTIONS = [
  { title: "草稿 / Draft (not submitted)", value: "draft" },
  { title: "正在处理 / Processing with AI", value: "processing" },
  { title: "已发布 / Published to /volumes", value: "published" },
  { title: "处理失败 / Failed (see error)", value: "failed" },
];

export const caseStudySubmission = defineType({
  name: "caseStudySubmission",
  title: "Case study submission",
  type: "document",
  groups: [
    { name: "input", title: "Your input", default: true },
    { name: "output", title: "AI result (auto)" },
  ],
  fields: [
    defineField({
      name: "photos",
      title: "Photos · 项目照片",
      type: "array",
      group: "input",
      description:
        "Upload at least one photo. The AI uses these to identify the structure, finishing, and visual character.",
      of: [
        {
          type: "image",
          options: { hotspot: true },
        },
      ],
      validation: (Rule) => Rule.required().min(1).max(20),
    }),
    defineField({
      name: "projectName",
      title: "Project name · 项目名",
      type: "string",
      group: "input",
      description:
        "Short title for this work. e.g. 'Lancôme Spring 2026', 'Yangshao Caitao Reissue'.",
      validation: (Rule) => Rule.required().min(2).max(80),
    }),
    defineField({
      name: "client",
      title: "Client · 客户",
      type: "string",
      group: "input",
      description:
        "Brand or studio name. Use 'House design' for in-house / DTC work without a named brand.",
      validation: (Rule) => Rule.required().max(80),
    }),
    defineField({
      name: "year",
      title: "Year · 年份",
      type: "number",
      group: "input",
      initialValue: () => new Date().getFullYear(),
      validation: (Rule) => Rule.required().min(1992).max(2100),
    }),
    defineField({
      name: "materials",
      title: "Materials & techniques · 材料和工艺",
      type: "text",
      rows: 3,
      group: "input",
      description:
        "Free text. e.g. 'Magnetic-closure rigid box, hot-foil champagne, soft-touch laminate'.",
    }),
    defineField({
      name: "notes",
      title: "Notes for the AI · 备注",
      type: "text",
      rows: 3,
      group: "input",
      description:
        "Anything else worth knowing — context, brief, things to emphasize. Free text.",
    }),
    defineField({
      name: "status",
      title: "Status · 状态",
      type: "string",
      group: "output",
      readOnly: true,
      initialValue: "draft",
      options: { list: STATUS_OPTIONS, layout: "radio" },
      description: "Set by the system. Don't edit manually.",
    }),
    defineField({
      name: "generatedCaseStudy",
      title: "Generated case study · AI 生成的案例",
      type: "reference",
      to: [{ type: "caseStudy" }],
      group: "output",
      readOnly: true,
      description:
        "Linked once the AI has processed this submission. Click to see the published case study.",
    }),
    defineField({
      name: "aiError",
      title: "AI error · 错误信息",
      type: "text",
      rows: 3,
      group: "output",
      readOnly: true,
      description: "If processing failed, the error message is recorded here.",
      hidden: ({ document }) => document?.status !== "failed",
    }),
  ],
  preview: {
    select: {
      title: "projectName",
      subtitle: "client",
      media: "photos.0",
      status: "status",
      year: "year",
    },
    prepare({ title, subtitle, media, status, year }) {
      const dot =
        status === "published" ? "●"
          : status === "processing" ? "◐"
          : status === "failed" ? "✗"
          : "○";
      return {
        title: `${dot} ${title ?? "(no name)"}`,
        subtitle: `${subtitle ?? ""}${year ? " · " + year : ""}`,
        media,
      };
    },
  },
  orderings: [
    {
      title: "Newest first",
      name: "createdDesc",
      by: [{ field: "_createdAt", direction: "desc" }],
    },
    {
      title: "Status (draft → published)",
      name: "byStatus",
      by: [
        { field: "status", direction: "asc" },
        { field: "_createdAt", direction: "desc" },
      ],
    },
  ],
});
