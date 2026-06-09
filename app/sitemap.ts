import type { MetadataRoute } from "next";

import {
  getAllPages,
  getArticlesList,
  getAuthors,
  getCategories,
  getClaimCasesList,
  getClaimsGuidesList,
  getGlossaryTerms,
  getProducts,
  getProviders,
} from "@/lib/cms-client";
import { cmsPagePublicPath } from "@/lib/cms-page-routes";
import { absoluteUrl } from "@/lib/seo";
import { categoryContentHubs, CATEGORY_SLUGS } from "@/lib/category-content-hub";
import { insuranceCategories } from "@/lib/site-data";

const DEEP_GUIDE_SLUGS = new Set(
  CATEGORY_SLUGS.map((slug) => categoryContentHubs[slug].deepGuide.slug),
);
const FLAGSHIP_PRODUCT_SLUGS = new Set(
  CATEGORY_SLUGS.map((slug) => categoryContentHubs[slug].flagshipProduct.slug),
);

function lastModified(...candidates: Array<string | undefined>): Date | undefined {
  for (const value of candidates) {
    if (!value) continue;
    const date = new Date(value);
    if (!Number.isNaN(date.getTime())) return date;
  }
  return undefined;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPaths = [
    "/",
    "/insurance",
    "/guides",
    "/claims",
    "/resources",
    "/about",
    "/contact",
    "/privacy-policy",
    "/terms",
    "/products",
    "/providers",
    "/methodology",
    "/glossary",
    "/authors",
  ];

  const [cmsCategories, articles, claimsGuides, claimCases, providers, products, pages, glossaryTerms, authors] =
    await Promise.all([
    getCategories(),
    getArticlesList(),
    getClaimsGuidesList(),
    getClaimCasesList(),
    getProviders(),
    getProducts(),
    getAllPages(),
    getGlossaryTerms(),
    getAuthors(),
  ]);

  const insuranceCategorySlugs = Array.from(
    new Set([...insuranceCategories.map((category) => category.slug), ...cmsCategories.map((category) => category.slug)]),
  );

  const pagePaths = Array.from(
    new Set(
      pages
        .map((page) => page.slug?.trim())
        .filter(Boolean)
        .map((slug) => cmsPagePublicPath(slug as string)),
    ),
  );

  const allUrls: MetadataRoute.Sitemap = [
    ...staticPaths.map((path) => ({
      url: absoluteUrl(path),
      changeFrequency: "weekly" as const,
      priority: path === "/" ? 1 : 0.7,
    })),
    ...insuranceCategorySlugs.map((slug) => ({
      url: absoluteUrl(`/insurance/${slug}`),
      changeFrequency: "weekly" as const,
      priority: 0.85,
    })),
    ...articles.map((article) => ({
      url: absoluteUrl(`/guides/${article.slug}`),
      lastModified: lastModified(article.lastReviewedAt, article.updatedAt, article.publishedAt, article.createdAt),
      changeFrequency: "weekly" as const,
      priority: DEEP_GUIDE_SLUGS.has(article.slug) ? 0.82 : 0.7,
    })),
    ...claimsGuides
      .filter((guide) => Boolean(guide.slug))
      .map((guide) => ({
        url: absoluteUrl(`/claims/guides/${guide.slug}`),
        lastModified: lastModified(guide.lastReviewedAt, guide.updatedAt, guide.createdAt),
        changeFrequency: "weekly" as const,
        priority: 0.7,
      })),
    ...claimCases.map((claimCase) => ({
      url: absoluteUrl(`/claims/cases/${claimCase.id}`),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    ...providers.map((provider) => ({
      url: absoluteUrl(`/providers/${provider.slug}`),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
    ...products.map((product) => ({
      url: absoluteUrl(`/products/${product.slug}`),
      lastModified: lastModified(product.lastReviewedAt, product.updatedAt, product.createdAt),
      changeFrequency: "weekly" as const,
      priority: FLAGSHIP_PRODUCT_SLUGS.has(product.slug) ? 0.8 : 0.7,
    })),
    ...pagePaths.map((path) => ({
      url: absoluteUrl(path),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    ...glossaryTerms.map((term) => ({
      url: absoluteUrl(`/glossary/${term.slug}`),
      lastModified: lastModified(term.updatedAt, term.createdAt),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...authors.map((author) => ({
      url: absoluteUrl(`/authors/${author.slug}`),
      lastModified: lastModified(author.updatedAt, author.createdAt),
      changeFrequency: "monthly" as const,
      priority: 0.5,
    })),
  ];

  const dedupedByUrl = new Map<string, MetadataRoute.Sitemap[number]>();
  for (const item of allUrls) {
    dedupedByUrl.set(item.url, item);
  }

  return Array.from(dedupedByUrl.values());
}
