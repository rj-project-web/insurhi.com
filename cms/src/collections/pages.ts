import type { CollectionConfig } from "payload";

export const Pages: CollectionConfig = {
  slug: "pages",
  labels: {
    singular: "静态页面",
    plural: "静态页面",
  },
  admin: {
    useAsTitle: "title",
    group: "系统页面",
  },
  versions: {
    drafts: true,
  },
  fields: [
    { name: "title", label: "标题", type: "text", required: true },
    { name: "slug", label: "Slug", type: "text", required: true, unique: true },
    { name: "content", label: "内容", type: "textarea", required: true },
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
