import type { CategorySlug } from "@/lib/category-content-hub";

export const categoryDescriptions: Record<CategorySlug, string> = {
  auto: "Compare top carriers, analyze premium factors, and follow post-accident protocols.",
  life: "Term vs whole life, medical underwriting guides, and beneficiary planning tools.",
  home: "HO-3 vs HO-5 forms, natural disaster preparedness, and inventory filing guides.",
  pet: "Accident and illness reimbursement models and chronic condition coverage reviews.",
  medicare: "Navigating Parts A through D, Advantage enrollment, and Medigap supplements.",
  renters: "Personal property limits, liability coverage, and theft claim documentation.",
};

/** Site-level trust FAQs — aligned with homepage design (not category/product FAQs). */
export const homeTrustFaqs = [
  {
    id: "home-faq-independence",
    question: "How does Insurhi stay independent?",
    answer:
      "Insurhi is editorially independent. Our ratings and comparisons are based on documented methodology, cited sources, and category editor review — not paid placement. Affiliate relationships, when present, are disclosed and do not change editorial rankings.",
  },
  {
    id: "home-faq-advice",
    question: "Is this financial advice?",
    answer:
      "No. Insurhi content is informational and educational only. It is not legal, financial, or insurance advice. Always read full policy wording and confirm coverage, exclusions, and pricing with a licensed insurer or agent before purchase.",
  },
  {
    id: "home-faq-updates",
    question: "How often is provider data updated?",
    answer:
      "Flagship product and provider pages are reviewed on a rolling editorial schedule. Pricing snapshots and coverage summaries are refreshed when carriers publish material changes; claims playbooks are updated when workflows or regulations shift.",
  },
  {
    id: "home-faq-claims-help",
    question: "Can you help me file a claim?",
    answer:
      "We do not file claims on your behalf. Our claims playbooks provide step-by-step FNOL workflows, document checklists, denial patterns, and case references so you can prepare before contacting your carrier.",
  },
] as const;

export const heroStatLabels = {
  categories: "Deep Hubs",
  analysis: "Products",
  expertise: "Guides",
  support: "Claims Help",
} as const;
