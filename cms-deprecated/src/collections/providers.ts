import type { CollectionConfig } from "payload";

export const Providers: CollectionConfig = {
  slug: "providers",
  labels: {
    singular: "供应商",
    plural: "供应商",
  },
  admin: {
    useAsTitle: "name",
    group: "内容",
  },
  fields: [
    { name: "name", label: "供应商名称", type: "text", required: true },
    { name: "slug", label: "Slug", type: "text", required: true, unique: true },
    {
      name: "categories",
      label: "关联分类",
      type: "relationship",
      relationTo: "categories",
      hasMany: true,
    },
    { name: "rating", label: "评分", type: "number", min: 0, max: 5 },
    { name: "coverageRegions", label: "覆盖地区", type: "text", hasMany: true },
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
