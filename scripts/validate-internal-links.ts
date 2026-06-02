import { readFile } from "node:fs/promises";
import path from "node:path";

import { categoryContentHubs, CATEGORY_SLUGS } from "../lib/category-content-hub";
import { collectInternalLinkPaths } from "../lib/content-links";
import { glossaryResourceLinks } from "../lib/glossary-links";

const SNAPSHOT_PATH =
  process.env.CMS_CONTENT_FILE_PATH ?? path.join(process.cwd(), "content", "cms-content.json");

type Snapshot = {
  articles?: Array<{ slug?: string }>;
  products?: Array<{ slug?: string }>;
  claimsGuides?: Array<{ slug?: string }>;
  glossaryTerms?: Array<{ slug?: string }>;
  categories?: Array<{ slug?: string }>;
};

function pathToSlug(href: string): { kind: string; slug: string } | null {
  if (href.startsWith("/guides/")) return { kind: "article", slug: href.slice("/guides/".length) };
  if (href.startsWith("/products/")) return { kind: "product", slug: href.slice("/products/".length) };
  if (href.startsWith("/claims/guides/")) {
    return { kind: "claimsGuide", slug: href.slice("/claims/guides/".length) };
  }
  if (href.startsWith("/glossary/")) return { kind: "glossary", slug: href.slice("/glossary/".length) };
  if (href.startsWith("/insurance/")) {
    const rest = href.slice("/insurance/".length);
    const slug = rest.split("#")[0];
    return slug ? { kind: "category", slug } : null;
  }
  if (href.startsWith("/claims/")) {
    const slug = href.slice("/claims/".length);
    return slug ? { kind: "claimsCategory", slug } : null;
  }
  return null;
}

async function main() {
  const raw = await readFile(SNAPSHOT_PATH, "utf8");
  const snapshot = JSON.parse(raw) as Snapshot;

  const articleSlugs = new Set((snapshot.articles ?? []).map((item) => item.slug).filter(Boolean));
  const productSlugs = new Set((snapshot.products ?? []).map((item) => item.slug).filter(Boolean));
  const claimsSlugs = new Set((snapshot.claimsGuides ?? []).map((item) => item.slug).filter(Boolean));
  const glossarySlugs = new Set((snapshot.glossaryTerms ?? []).map((item) => item.slug).filter(Boolean));
  const categorySlugs = new Set([
    ...CATEGORY_SLUGS,
    ...(snapshot.categories ?? []).map((item) => item.slug).filter(Boolean),
  ]);

  const errors: string[] = [];
  const checked = collectInternalLinkPaths();

  for (const href of checked) {
    const parsed = pathToSlug(href);
    if (!parsed) continue;

    const { kind, slug } = parsed;
    if (kind === "article" && !articleSlugs.has(slug)) {
      errors.push(`missing article slug: ${slug} (${href})`);
    }
    if (kind === "product" && !productSlugs.has(slug)) {
      errors.push(`missing product slug: ${slug} (${href})`);
    }
    if (kind === "claimsGuide" && !claimsSlugs.has(slug)) {
      errors.push(`missing claims guide slug: ${slug} (${href})`);
    }
    if (kind === "glossary" && !glossarySlugs.has(slug)) {
      errors.push(`missing glossary slug: ${slug} (${href})`);
    }
    if (kind === "category" && !categorySlugs.has(slug)) {
      errors.push(`missing category slug: ${slug} (${href})`);
    }
    if (kind === "claimsCategory" && !categorySlugs.has(slug)) {
      errors.push(`missing claims category slug: ${slug} (${href})`);
    }
  }

  // Hub completeness: each category hub flagship should exist
  for (const cat of CATEGORY_SLUGS) {
    const hub = categoryContentHubs[cat];
    if (!articleSlugs.has(hub.deepGuide.slug)) {
      errors.push(`hub ${cat}: deep guide missing ${hub.deepGuide.slug}`);
    }
    if (!productSlugs.has(hub.flagshipProduct.slug)) {
      errors.push(`hub ${cat}: flagship product missing ${hub.flagshipProduct.slug}`);
    }
  }

  // Glossary resource links should resolve
  for (const [termSlug, resources] of Object.entries(glossaryResourceLinks)) {
    if (!glossarySlugs.has(termSlug)) {
      errors.push(`glossaryResourceLinks references unknown term: ${termSlug}`);
    }
    for (const guide of resources.guides ?? []) {
      if (!articleSlugs.has(guide.slug)) {
        errors.push(`glossary ${termSlug}: guide missing ${guide.slug}`);
      }
    }
    for (const claim of resources.claims ?? []) {
      if (!claimsSlugs.has(claim.slug)) {
        errors.push(`glossary ${termSlug}: claims guide missing ${claim.slug}`);
      }
    }
    if (resources.insurance && !categorySlugs.has(resources.insurance)) {
      errors.push(`glossary ${termSlug}: category missing ${resources.insurance}`);
    }
  }

  if (errors.length > 0) {
    console.error(`Internal link validation failed (${errors.length} errors):`);
    for (const error of errors) {
      console.error(`- ${error}`);
    }
    process.exit(1);
  }

  console.log(`Internal link validation passed (${checked.length} paths checked).`);
}

main().catch((error) => {
  console.error("Internal link validation error:", error);
  process.exit(1);
});
