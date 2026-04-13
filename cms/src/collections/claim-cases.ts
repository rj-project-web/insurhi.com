import type { CollectionConfig } from "payload";

export const ClaimCases: CollectionConfig = {
  slug: "claim-cases",
  labels: {
    singular: "理赔案例",
    plural: "理赔案例",
  },
  admin: {
    useAsTitle: "title",
    group: "理赔",
  },
  fields: [
    { name: "title", label: "案例标题", type: "text", required: true },
    {
      name: "category",
      label: "关联分类",
      type: "relationship",
      relationTo: "categories",
    },
    { name: "scenario", label: "案例场景", type: "textarea", required: true },
    { name: "outcome", label: "处理结果", type: "textarea", required: true },
  ],
};
