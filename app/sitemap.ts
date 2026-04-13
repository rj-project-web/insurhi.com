import type { MetadataRoute } from "next";

import {
  getClaimCases,
  getClaimsGuides,
  getLatestArticles,
} from "@/lib/cms-client";
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

  const [articles, claimsGuides, claimCases] = await Promise.all([
    getLatestArticles(),
    getClaimsGuides(),
    getClaimCases(),
  ]);

  const urls: MetadataRoute.Sitemap = [
    ...staticPaths.map((path) => ({
      url: absoluteUrl(path),
      changeFrequency: "weekly" as const,
      priority: path === "/" ? 1 : 0.7,
    })),
    ...insuranceCategories.map((category) => ({
      url: absoluteUrl(`/insurance/${category.slug}`),
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
  ];

  return urls;
}
