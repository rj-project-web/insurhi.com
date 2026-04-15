import type { CollectionConfig } from "payload";

export const ClaimsGuides: CollectionConfig = {
  slug: "claims-guides",
  labels: {
    singular: "理赔指引",
    plural: "理赔指引",
  },
  admin: {
    useAsTitle: "title",
    group: "理赔",
  },
  fields: [
    { name: "title", label: "标题", type: "text", required: true },
    { name: "slug", label: "Slug", type: "text", required: true, unique: true },
    {
      name: "category",
      label: "关联分类",
      type: "relationship",
      relationTo: "categories",
    },
    {
      name: "steps",
      label: "流程步骤",
      type: "array",
      fields: [{ name: "step", label: "步骤", type: "text", required: true }],
    },
    {
      name: "documentChecklist",
      label: "材料清单",
      type: "array",
      fields: [{ name: "item", label: "材料项", type: "text", required: true }],
    },
    { name: "onlineClaimUrl", label: "在线报案入口", type: "text" },
  ],
};
