import type { CollectionConfig } from "payload";

export const Categories: CollectionConfig = {
  slug: "categories",
  labels: {
    singular: "保险分类",
    plural: "保险分类",
  },
  admin: {
    useAsTitle: "title",
    group: "内容",
  },
  fields: [
    { name: "title", label: "标题", type: "text", required: true },
    { name: "slug", label: "Slug", type: "text", required: true, unique: true },
    { name: "summary", label: "简介", type: "textarea" },
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
