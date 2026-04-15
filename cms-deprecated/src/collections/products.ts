import type { CollectionConfig } from "payload";

export const Products: CollectionConfig = {
  slug: "products",
  labels: {
    singular: "保险产品",
    plural: "保险产品",
  },
  admin: {
    useAsTitle: "name",
    group: "内容",
  },
  fields: [
    { name: "name", label: "产品名称", type: "text", required: true },
    { name: "slug", label: "Slug", type: "text", required: true, unique: true },
    {
      name: "category",
      label: "保险分类",
      type: "relationship",
      relationTo: "categories",
      required: true,
    },
    {
      name: "provider",
      label: "供应商",
      type: "relationship",
      relationTo: "providers",
    },
    { name: "coverageAmount", label: "保额说明", type: "text" },
    { name: "deductible", label: "免赔额", type: "text" },
    { name: "priceRange", label: "价格区间", type: "text" },
    { name: "recommendedFor", label: "适合人群", type: "textarea" },
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
