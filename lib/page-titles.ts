import type { CmsCategory, CmsProduct, CmsProvider } from "@/lib/cms-client";
import { normalizeMetaTitle } from "@/lib/seo";

function resolveCategoryTitle(category: string | CmsCategory | undefined): string | undefined {
  if (!category) return undefined;
  if (typeof category === "object") return category.title;
  return undefined;
}

function primaryProviderCategory(provider: CmsProvider): string | undefined {
  const categories = provider.categories ?? [];
  const first = categories.find((item) => typeof item === "object" && item !== null && "title" in item);
  if (first && typeof first === "object") return first.title;
  return undefined;
}

function stripReviewSuffix(title: string): string {
  return title
    .replace(/\s*\|\s*Insurhi\s*$/i, "")
    .replace(/\s+Review\s+\d{4}\s*$/i, "")
    .replace(/\s+Review\s*$/i, "")
    .trim();
}

/**
 * Provider hub title — company profile, not a product review.
 * Distinct from sibling /products/{slug} pages that share CMS metaTitle.
 */
export function buildProviderPageTitle(provider: CmsProvider): string {
  const category = primaryProviderCategory(provider);
  const name = provider.name.trim();

  if (category) {
    return normalizeMetaTitle(`${name} Provider Profile | ${category} & Claims`);
  }

  return normalizeMetaTitle(`${name} Insurance Provider Profile | Coverage & Claims`);
}

/**
 * Product review title — plan-specific, category-aware.
 */
export function buildProductPageTitle(product: CmsProduct): string {
  const category = resolveCategoryTitle(product.category);
  const name = product.name.trim();

  if (category) {
    return normalizeMetaTitle(`${name} Review 2026 | ${category} Pros & Pricing`);
  }

  const cmsTitle = product.seo?.metaTitle;
  if (cmsTitle && !/(…|\.\.\.)$/.test(cmsTitle)) {
    return normalizeMetaTitle(cmsTitle);
  }

  return normalizeMetaTitle(`${name} Review 2026 | Coverage & Pricing`);
}

/**
 * Claims guide title — action-oriented, shorter than CMS title.
 */
export function buildClaimsGuidePageTitle(title: string): string {
  const cleaned = stripReviewSuffix(title);
  if (/claim guide/i.test(cleaned)) {
    return normalizeMetaTitle(cleaned);
  }
  return normalizeMetaTitle(`${cleaned} | Claim Steps & Documents`);
}
