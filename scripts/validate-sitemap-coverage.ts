/**
 * Ensures app/sitemap.ts includes every CMS snapshot URL with up-to-date lastmod.
 * Run after export:cms-content (publish:static does this automatically).
 */
import { readFile } from "node:fs/promises";
import path from "node:path";

import { cmsPagePublicPath, isFixedCmsPageSlug } from "../lib/cms-page-routes";
import { contentLastModified, normalizeLastModified, type TimestampedContent } from "../lib/sitemap-dates";
import { absoluteUrl } from "../lib/seo";
import { providerCanonicalAliases } from "../lib/site-data";

const SNAPSHOT_PATH =
  process.env.CMS_CONTENT_FILE_PATH ?? path.join(process.cwd(), "content", "cms-content.json");

type SnapshotItem = TimestampedContent & { slug?: string; id?: string | number };

type Snapshot = {
  meta?: { exportedAt?: string };
  articles?: SnapshotItem[];
  claimsGuides?: SnapshotItem[];
  products?: SnapshotItem[];
  providers?: SnapshotItem[];
  glossaryTerms?: SnapshotItem[];
  authors?: SnapshotItem[];
  claimCases?: Array<{ id?: string | number }>;
  pages?: SnapshotItem[];
};

type ExpectedEntry = {
  path: string;
  label: string;
  lastModified?: Date;
};

function toStringId(value: string | number | undefined): string {
  return value === undefined || value === null ? "" : String(value);
}

function buildExpectedEntries(snapshot: Snapshot): ExpectedEntry[] {
  const entries: ExpectedEntry[] = [];

  for (const article of snapshot.articles ?? []) {
    const slug = article.slug?.trim();
    if (!slug) continue;
    entries.push({
      path: `/guides/${slug}`,
      label: `article:${slug}`,
      lastModified: contentLastModified(article),
    });
  }

  for (const guide of snapshot.claimsGuides ?? []) {
    const slug = guide.slug?.trim();
    if (!slug) continue;
    entries.push({
      path: `/claims/guides/${slug}`,
      label: `claims-guide:${slug}`,
      lastModified: contentLastModified(guide),
    });
  }

  for (const product of snapshot.products ?? []) {
    const slug = product.slug?.trim();
    if (!slug) continue;
    entries.push({
      path: `/products/${slug}`,
      label: `product:${slug}`,
      lastModified: contentLastModified(product),
    });
  }

  for (const provider of snapshot.providers ?? []) {
    const slug = provider.slug?.trim();
    if (!slug || providerCanonicalAliases[slug]) continue;
    entries.push({
      path: `/providers/${slug}`,
      label: `provider:${slug}`,
      lastModified: contentLastModified(provider),
    });
  }

  for (const term of snapshot.glossaryTerms ?? []) {
    const slug = term.slug?.trim();
    if (!slug) continue;
    entries.push({
      path: `/glossary/${slug}`,
      label: `glossary:${slug}`,
      lastModified: contentLastModified(term),
    });
  }

  for (const author of snapshot.authors ?? []) {
    const slug = author.slug?.trim();
    if (!slug) continue;
    entries.push({
      path: `/authors/${slug}`,
      label: `author:${slug}`,
      lastModified: contentLastModified(author),
    });
  }

  for (const claimCase of snapshot.claimCases ?? []) {
    const id = toStringId(claimCase.id).trim();
    if (!id) continue;
    entries.push({
      path: `/claims/cases/${id}`,
      label: `claim-case:${id}`,
    });
  }

  for (const page of snapshot.pages ?? []) {
    const slug = page.slug?.trim();
    if (!slug || isFixedCmsPageSlug(slug)) continue;
    entries.push({
      path: cmsPagePublicPath(slug),
      label: `page:${slug}`,
      lastModified: contentLastModified(page),
    });
  }

  return entries;
}

function entryLastModified(value: Date | string | undefined): Date | undefined {
  const iso = normalizeLastModified(value ?? undefined);
  if (!iso) return undefined;
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? undefined : date;
}

async function main() {
  process.env.CMS_CONTENT_SOURCE = "static";

  const raw = await readFile(SNAPSHOT_PATH, "utf8");
  const snapshot = JSON.parse(raw) as Snapshot;
  const exportedAt = snapshot.meta?.exportedAt;

  const { default: sitemap } = await import("../app/sitemap");
  const sitemapEntries = await sitemap();
  const sitemapByUrl = new Map(sitemapEntries.map((entry) => [entry.url, entry]));

  const errors: string[] = [];
  const expected = buildExpectedEntries(snapshot);

  for (const item of expected) {
    const url = absoluteUrl(item.path);
    const entry = sitemapByUrl.get(url);
    if (!entry) {
      errors.push(`missing sitemap URL for ${item.label} (${item.path})`);
      continue;
    }

    const actualLastMod = entryLastModified(entry.lastModified);
    if (!actualLastMod) {
      errors.push(`missing lastmod for ${item.label} (${item.path})`);
      continue;
    }

    if (item.lastModified && actualLastMod.getTime() < item.lastModified.getTime()) {
      errors.push(
        `stale lastmod for ${item.label}: sitemap ${actualLastMod.toISOString()} < snapshot ${item.lastModified.toISOString()}`,
      );
    }
  }

  if (errors.length > 0) {
    console.error(`Sitemap coverage failed (${errors.length} issue(s), snapshot ${SNAPSHOT_PATH}):`);
    for (const error of errors) {
      console.error(`- ${error}`);
    }
    console.error("");
    console.error("Fix: run npm run export:cms-content, then npm run publish:static before pushing.");
    process.exitCode = 1;
    return;
  }

  console.log(
    `Sitemap coverage passed (${expected.length} CMS URLs, ${sitemapEntries.length} total sitemap entries, exportedAt ${exportedAt ?? "unknown"})`,
  );
}

main().catch((error) => {
  console.error("Failed to validate sitemap coverage:", error);
  process.exitCode = 1;
});
