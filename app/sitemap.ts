import type { MetadataRoute } from "next";

import {
  getAllPages,
  getArticlesList,
  getAuthors,
  getCategories,
  getClaimCasesList,
  getClaimsGuidesList,
  getContentSnapshotMeta,
  getGlossaryTerms,
  getProducts,
  getProviders,
} from "@/lib/cms-client";
import { cmsPagePublicPath, isFixedCmsPageSlug } from "@/lib/cms-page-routes";
import { categoryContentHubs, CATEGORY_SLUGS } from "@/lib/category-content-hub";
import {
  buildCategoryLastModifiedMap,
  contentLastModified,
  latestModified,
  maxDateFromItems,
  normalizeLastModified,
} from "@/lib/sitemap-dates";
import { absoluteUrl } from "@/lib/seo";
import { insuranceCategories, providerCanonicalAliases } from "@/lib/site-data";

const DEEP_GUIDE_SLUGS = new Set(
  CATEGORY_SLUGS.map((slug) => categoryContentHubs[slug].deepGuide.slug),
);
const FLAGSHIP_PRODUCT_SLUGS = new Set(
  CATEGORY_SLUGS.map((slug) => categoryContentHubs[slug].flagshipProduct.slug),
);

function withLastModified(
  entry: MetadataRoute.Sitemap[number],
  ...candidates: Array<string | undefined | null | Date>
): MetadataRoute.Sitemap[number] {
  const isoCandidates = candidates.map((value) =>
    value instanceof Date ? value.toISOString() : value,
  );
  const lastModified = latestModified(...isoCandidates);
  return lastModified ? { ...entry, lastModified } : entry;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [
    cmsCategories,
    articles,
    claimsGuides,
    claimCases,
    providers,
    products,
    pages,
    glossaryTerms,
    authors,
    snapshotMeta,
  ] = await Promise.all([
    getCategories(),
    getArticlesList(),
    getClaimsGuidesList(),
    getClaimCasesList(),
    getProviders(),
    getProducts(),
    getAllPages(),
    getGlossaryTerms(),
    getAuthors(),
    getContentSnapshotMeta(),
  ]);

  const exportedAt = snapshotMeta?.exportedAt;

  const articleLastMod = maxDateFromItems(articles);
  const claimsLastMod = maxDateFromItems(claimsGuides);
  const productLastMod = maxDateFromItems(
    products.map((product) => ({
      lastReviewedAt: product.lastReviewedAt,
      updatedAt: product.updatedAt,
      publishedAt: product.claimsTurnaround?.lastUpdated,
      createdAt: product.createdAt,
    })),
  );
  const providerLastMod = maxDateFromItems(providers);
  const glossaryLastMod = maxDateFromItems(glossaryTerms);
  const authorLastMod = maxDateFromItems(authors);
  const siteLastMod = latestModified(
    exportedAt,
    articleLastMod?.toISOString(),
    claimsLastMod?.toISOString(),
    productLastMod?.toISOString(),
  );

  const categoryArticleMap = buildCategoryLastModifiedMap(articles);
  const categoryClaimsMap = buildCategoryLastModifiedMap(claimsGuides);
  const categoryProductMap = buildCategoryLastModifiedMap(products);

  const categoryLastMod = (slug: string) =>
    latestModified(
      categoryArticleMap.get(slug)?.toISOString(),
      categoryClaimsMap.get(slug)?.toISOString(),
      categoryProductMap.get(slug)?.toISOString(),
      exportedAt,
    );

  const fixedPageLastMod = new Map<string, Date | undefined>();
  for (const page of pages) {
    const slug = page.slug?.trim();
    if (!slug || !isFixedCmsPageSlug(slug)) continue;
    fixedPageLastMod.set(cmsPagePublicPath(slug), contentLastModified(page));
  }

  const staticPaths: Array<{ path: string; lastMod?: Date }> = [
    { path: "/", lastMod: siteLastMod },
    { path: "/insurance", lastMod: siteLastMod },
    { path: "/guides", lastMod: latestModified(articleLastMod?.toISOString(), exportedAt) },
    { path: "/claims", lastMod: latestModified(claimsLastMod?.toISOString(), exportedAt) },
    { path: "/resources", lastMod: siteLastMod },
    { path: "/about", lastMod: fixedPageLastMod.get("/about") ?? siteLastMod },
    { path: "/contact", lastMod: fixedPageLastMod.get("/contact") ?? siteLastMod },
    { path: "/privacy-policy", lastMod: fixedPageLastMod.get("/privacy-policy") ?? siteLastMod },
    { path: "/terms", lastMod: fixedPageLastMod.get("/terms") ?? siteLastMod },
    { path: "/products", lastMod: latestModified(productLastMod?.toISOString(), exportedAt) },
    { path: "/providers", lastMod: latestModified(providerLastMod?.toISOString(), exportedAt) },
    { path: "/methodology", lastMod: fixedPageLastMod.get("/methodology") ?? siteLastMod },
    { path: "/glossary", lastMod: latestModified(glossaryLastMod?.toISOString(), exportedAt) },
    { path: "/authors", lastMod: latestModified(authorLastMod?.toISOString(), exportedAt) },
  ];

  const insuranceCategorySlugs = Array.from(
    new Set([...insuranceCategories.map((category) => category.slug), ...cmsCategories.map((category) => category.slug)]),
  );

  const pagePaths = Array.from(
    new Set(
      pages
        .map((page) => page.slug?.trim())
        .filter((slug): slug is string => Boolean(slug) && !isFixedCmsPageSlug(slug))
        .map((slug) => cmsPagePublicPath(slug)),
    ),
  );

  const allUrls: MetadataRoute.Sitemap = [
    ...staticPaths.map(({ path, lastMod }) =>
      withLastModified(
        {
          url: absoluteUrl(path),
          changeFrequency: "weekly" as const,
          priority: path === "/" ? 1 : 0.7,
        },
        lastMod,
      ),
    ),
    ...insuranceCategorySlugs.map((slug) =>
      withLastModified(
        {
          url: absoluteUrl(`/insurance/${slug}`),
          changeFrequency: "weekly" as const,
          priority: 0.85,
        },
        categoryLastMod(slug),
      ),
    ),
    ...insuranceCategorySlugs.map((slug) =>
      withLastModified(
        {
          url: absoluteUrl(`/claims/${slug}`),
          changeFrequency: "weekly" as const,
          priority: 0.75,
        },
        categoryLastMod(slug),
        categoryClaimsMap.get(slug),
      ),
    ),
    ...articles.map((article) =>
      withLastModified(
        {
          url: absoluteUrl(`/guides/${article.slug}`),
          changeFrequency: "weekly" as const,
          priority: DEEP_GUIDE_SLUGS.has(article.slug) ? 0.82 : 0.7,
        },
        contentLastModified(article),
      ),
    ),
    ...claimsGuides
      .filter((guide) => Boolean(guide.slug))
      .map((guide) =>
        withLastModified(
          {
            url: absoluteUrl(`/claims/guides/${guide.slug}`),
            changeFrequency: "weekly" as const,
            priority: 0.7,
          },
          contentLastModified(guide),
        ),
      ),
    ...claimCases.map((claimCase) =>
      withLastModified(
        {
          url: absoluteUrl(`/claims/cases/${claimCase.id}`),
          changeFrequency: "monthly" as const,
          priority: 0.6,
        },
        exportedAt,
      ),
    ),
    ...providers
      .filter((provider) => !providerCanonicalAliases[provider.slug])
      .map((provider) =>
        withLastModified(
          {
            url: absoluteUrl(`/providers/${provider.slug}`),
            changeFrequency: "weekly" as const,
            priority: 0.7,
          },
          contentLastModified(provider),
        ),
      ),
    ...products.map((product) =>
      withLastModified(
        {
          url: absoluteUrl(`/products/${product.slug}`),
          changeFrequency: "weekly" as const,
          priority: FLAGSHIP_PRODUCT_SLUGS.has(product.slug) ? 0.8 : 0.7,
        },
        contentLastModified(product),
        product.claimsTurnaround?.lastUpdated,
      ),
    ),
    ...pagePaths.map((path) => {
      const page = pages.find((item) => cmsPagePublicPath(item.slug) === path);
      return withLastModified(
        {
          url: absoluteUrl(path),
          changeFrequency: "monthly" as const,
          priority: 0.6,
        },
        page ? contentLastModified(page) : undefined,
        exportedAt,
      );
    }),
    ...glossaryTerms.map((term) =>
      withLastModified(
        {
          url: absoluteUrl(`/glossary/${term.slug}`),
          changeFrequency: "monthly" as const,
          priority: 0.7,
        },
        contentLastModified(term),
      ),
    ),
    ...authors.map((author) =>
      withLastModified(
        {
          url: absoluteUrl(`/authors/${author.slug}`),
          changeFrequency: "monthly" as const,
          priority: 0.5,
        },
        contentLastModified(author),
      ),
    ),
  ];

  const dedupedByUrl = new Map<string, MetadataRoute.Sitemap[number]>();
  for (const item of allUrls) {
    const existing = dedupedByUrl.get(item.url);
    if (!existing) {
      dedupedByUrl.set(item.url, item);
      continue;
    }
    const mergedLastMod = latestModified(
      normalizeLastModified(existing.lastModified),
      normalizeLastModified(item.lastModified),
    );
    dedupedByUrl.set(item.url, mergedLastMod ? { ...existing, lastModified: mergedLastMod } : existing);
  }

  return Array.from(dedupedByUrl.values());
}
