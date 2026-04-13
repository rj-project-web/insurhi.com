import type { CollectionConfig } from "payload";

export const FaqItems: CollectionConfig = {
  slug: "faq-items",
  labels: {
    singular: "常见问题",
    plural: "常见问题",
  },
  admin: {
    useAsTitle: "question",
    group: "内容",
  },
  fields: [
    { name: "question", label: "问题", type: "text", required: true },
    { name: "answer", label: "答案", type: "textarea", required: true },
    {
      name: "category",
      label: "关联分类",
      type: "relationship",
      relationTo: "categories",
    },
  ],
};
