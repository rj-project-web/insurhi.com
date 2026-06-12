import type { DetailSection } from "@/lib/detail-page-utils";

type ProductLike = {
  editorConclusion?: string;
  coverageDetails?: unknown;
  premiumEstimateRows?: Array<{ ageBand?: string; estimatedPremium?: string }>;
  pros?: Array<{ item?: string }>;
  cons?: Array<{ item?: string }>;
  bestFor?: Array<{ item?: string }>;
  notFor?: Array<{ item?: string }>;
  recommendedFor?: string;
  claimsTurnaround?: { avgDays?: number; p90Days?: number; dataSource?: string };
  competitorComparisons?: Array<{ competitorName?: string }>;
  ratingDistribution?: unknown;
  reviewHighlights?: unknown;
  faqItems?: Array<{ question?: string }>;
  methodology?: unknown;
  sources?: Array<{ sourceName?: string }>;
};

export function getProductDetailSections(product: ProductLike): DetailSection[] {
  const sections: DetailSection[] = [];

  if (product.editorConclusion) sections.push({ id: "editorial-conclusion", label: "Editorial verdict" });
  if (product.coverageDetails) sections.push({ id: "coverage-details", label: "Coverage details" });
  if ((product.premiumEstimateRows ?? []).some((row) => row.ageBand || row.estimatedPremium)) {
    sections.push({ id: "premium-estimates", label: "Premium estimates" });
  }
  if ((product.pros ?? []).length || (product.cons ?? []).length) {
    sections.push({ id: "pros-cons", label: "Pros & cons" });
  }
  if ((product.bestFor ?? []).length || (product.notFor ?? []).length) {
    sections.push({ id: "best-for", label: "Best for" });
  }
  if (product.recommendedFor) sections.push({ id: "recommended-for", label: "Recommended for" });
  if (
    product.claimsTurnaround?.avgDays != null ||
    product.claimsTurnaround?.p90Days != null ||
    product.claimsTurnaround?.dataSource
  ) {
    sections.push({ id: "claims-turnaround", label: "Claims turnaround" });
  }
  if ((product.competitorComparisons ?? []).some((row) => row.competitorName)) {
    sections.push({ id: "competitor-comparison", label: "Competitor comparison" });
  }
  if (product.ratingDistribution) sections.push({ id: "rating-distribution", label: "Ratings" });
  if (product.reviewHighlights) sections.push({ id: "review-highlights", label: "User reviews" });
  if ((product.faqItems ?? []).some((item) => item.question)) {
    sections.push({ id: "product-faq", label: "FAQ" });
  }
  if (product.methodology) sections.push({ id: "methodology", label: "Methodology" });
  if ((product.sources ?? []).some((row) => row.sourceName)) {
    sections.push({ id: "sources", label: "Sources" });
  }

  return sections;
}

export function getProductHighlights(product: ProductLike, limit = 3): string[] {
  const items: string[] = [];
  for (const row of product.pros ?? []) {
    if (row.item) items.push(row.item);
    if (items.length >= limit) return items;
  }
  if (typeof product.editorConclusion === "string" && product.editorConclusion.trim()) {
    items.push(product.editorConclusion.trim());
  }
  return items.slice(0, limit);
}
