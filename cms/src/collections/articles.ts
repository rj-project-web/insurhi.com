import { lexicalEditor } from "@payloadcms/richtext-lexical";
import type { CollectionConfig } from "payload";

export const Articles: CollectionConfig = {
  slug: "articles",
  labels: {
    singular: "指南文章",
    plural: "指南文章",
  },
  admin: {
    useAsTitle: "title",
    group: "内容",
  },
  versions: {
    drafts: true,
  },
  fields: [
    { name: "title", label: "标题", type: "text", required: true },
    { name: "slug", label: "Slug", type: "text", required: true, unique: true },
    {
      name: "category",
      label: "分类",
      type: "relationship",
      relationTo: "categories",
    },
    {
      name: "body",
      label: "正文",
      type: "richText",
      editor: lexicalEditor({}),
      required: true,
    },
    {
      name: "publishedAt",
      label: "发布时间",
      type: "date",
      admin: {
        date: {
          pickerAppearance: "dayAndTime",
        },
      },
    },
    {
      name: "seo",
      label: "SEO",
      type: "group",
      fields: [
        { name: "metaTitle", label: "Meta Title", type: "text" },
        { name: "metaDescription", label: "Meta Description", type: "textarea" },
      ],
    },
  ],
};
