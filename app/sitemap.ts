import type { MetadataRoute } from "next";

import {
  getAllPages,
  getArticlesList,
  getCategories,
  getClaimCasesList,
  getClaimsGuidesList,
  getProducts,
  getProviders,
} from "@/lib/cms-client";
import { cmsPagePublicPath } from "@/lib/cms-page-routes";
import { absoluteUrl } from "@/lib/seo";
import { insuranceCategories } from "@/lib/site-data";

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
  ];

  const [cmsCategories, articles, claimsGuides, claimCases, providers, products, pages] = await Promise.all([
    getCategories(),
    getArticlesList(),
    getClaimsGuidesList(),
    getClaimCasesList(),
    getProviders(),
    getProducts(),
    getAllPages(),
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
      priority: 0.8,
    })),
    ...articles.map((article) => ({
      url: absoluteUrl(`/guides/${article.slug}`),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
    ...claimsGuides
      .filter((guide) => Boolean(guide.slug))
      .map((guide) => ({
        url: absoluteUrl(`/claims/guides/${guide.slug}`),
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
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
    ...pagePaths.map((path) => ({
      url: absoluteUrl(path),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];

  const dedupedByUrl = new Map<string, MetadataRoute.Sitemap[number]>();
  for (const item of allUrls) {
    dedupedByUrl.set(item.url, item);
  }

  return Array.from(dedupedByUrl.values());
}
