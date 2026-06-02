#!/usr/bin/env node

import { readFile } from "node:fs/promises";
import path from "node:path";

const SNAPSHOT_PATH =
  process.env.CMS_CONTENT_FILE_PATH ?? path.join(process.cwd(), "content", "cms-content.json");
const WARN_ONLY =
  process.argv.includes("--warn-only") || process.env.VALIDATE_CONTENT_WARN_ONLY === "1";

const BLACKLIST_URL_FRAGMENTS = ["medicare.gov", "content.naic.org"];
const META_TITLE_MIN = 30;
const META_TITLE_MAX = 60;
const META_DESC_MIN = 110;
const META_DESC_MAX = 160;

const FLAGSHIP_PRODUCT_SLUGS = new Set([
  "amica-home",
  "aarp-uhc-medicare",
  "lemonade-renters",
  "state-farm-home",
  "trupanion-pet",
]);

function pushIssue(bucket, scope, id, message) {
  bucket.push({ scope, id, message });
}

function isStrictSeoSlug(slug) {
  if (!slug) return false;
  if (FLAGSHIP_PRODUCT_SLUGS.has(slug)) return true;
  return slug.endsWith("-deep-guide-2026") || slug.endsWith("-claim-guide-2026");
}

function isStrictBlacklistSlug(slug) {
  return isStrictSeoSlug(slug);
}

function categorySlug(value) {
  if (!value) return null;
  if (typeof value === "object" && value.slug) return value.slug;
  if (typeof value === "string" && value.trim()) return value;
  return null;
}

function findBlacklistInSources(entity) {
  const hits = new Set();
  const urls = [];

  for (const source of entity.sources ?? []) {
    if (typeof source?.url === "string") {
      urls.push(source.url);
    }
  }

  if (typeof entity.onlineClaimUrl === "string") {
    urls.push(entity.onlineClaimUrl);
  }

  for (const url of urls) {
    const lower = url.toLowerCase();
    for (const fragment of BLACKLIST_URL_FRAGMENTS) {
      if (lower.includes(fragment)) {
        hits.add(fragment);
      }
    }
  }

  return [...hits];
}

function validateSeo(bucket, scope, id, seo) {
  if (!seo) return;
  const title = seo.metaTitle?.trim();
  const description = seo.metaDescription?.trim();

  if (title) {
    const len = title.length;
    if (len < META_TITLE_MIN || len > META_TITLE_MAX) {
      pushIssue(
        bucket,
        scope,
        id,
        `metaTitle length ${len} (expected ${META_TITLE_MIN}-${META_TITLE_MAX})`,
      );
    }
  }

  if (description) {
    const len = description.length;
    if (len < META_DESC_MIN || len > META_DESC_MAX) {
      pushIssue(
        bucket,
        scope,
        id,
        `metaDescription length ${len} (expected ${META_DESC_MIN}-${META_DESC_MAX})`,
      );
    }
  }
}

function validateSnapshot(snapshot) {
  const errors = [];
  const warnings = [];

  for (const article of snapshot.articles ?? []) {
    const id = article.slug ?? article.id ?? "unknown";
    const seoBucket = isStrictSeoSlug(id) ? errors : warnings;

    if (!categorySlug(article.category)) {
      pushIssue(errors, "articles", id, "missing category");
    }
    validateSeo(seoBucket, "articles", id, article.seo);

    const blacklistHits = findBlacklistInSources(article);
    const blacklistBucket = isStrictBlacklistSlug(id) ? errors : warnings;
    for (const hit of blacklistHits) {
      pushIssue(blacklistBucket, "articles", id, `blacklist URL in sources: ${hit}`);
    }
  }

  for (const product of snapshot.products ?? []) {
    const id = product.slug ?? product.id ?? "unknown";
    const seoBucket = isStrictSeoSlug(id) ? errors : warnings;

    validateSeo(seoBucket, "products", id, product.seo);

    const blacklistHits = findBlacklistInSources(product);
    const blacklistBucket = isStrictBlacklistSlug(id) ? errors : warnings;
    for (const hit of blacklistHits) {
      pushIssue(blacklistBucket, "products", id, `blacklist URL in sources: ${hit}`);
    }
  }

  for (const guide of snapshot.claimsGuides ?? []) {
    const id = guide.slug ?? guide.id ?? "unknown";

    if (!categorySlug(guide.category)) {
      pushIssue(errors, "claims-guides", id, "missing category");
    }

    const blacklistHits = findBlacklistInSources(guide);
    const blacklistBucket = isStrictBlacklistSlug(id) ? errors : warnings;
    for (const hit of blacklistHits) {
      pushIssue(blacklistBucket, "claims-guides", id, `blacklist URL in sources: ${hit}`);
    }
  }

  for (const faq of snapshot.faqItems ?? []) {
    const id = faq.question ?? faq.id ?? "unknown";
    if (!categorySlug(faq.category)) {
      pushIssue(errors, "faq-items", id, "missing category");
    }
  }

  for (const page of snapshot.pages ?? []) {
    const id = page.slug ?? page.id ?? "unknown";
    validateSeo(warnings, "pages", id, page.seo);

    const blacklistHits = findBlacklistInSources(page);
    for (const hit of blacklistHits) {
      pushIssue(warnings, "pages", id, `blacklist URL in sources: ${hit}`);
    }
  }

  for (const term of snapshot.glossaryTerms ?? []) {
    const id = term.slug ?? term.id ?? "unknown";
    if (!term.term?.trim()) {
      pushIssue(errors, "glossary-terms", id, "missing term");
    }
    if (!term.definition?.trim()) {
      pushIssue(errors, "glossary-terms", id, "missing definition");
    }
  }

  return { errors, warnings };
}

function printIssues(label, issues, logFn) {
  if (issues.length === 0) return;
  logFn(`${label} (${issues.length}):`);
  for (const issue of issues) {
    logFn(`- [${issue.scope}] ${issue.id}: ${issue.message}`);
  }
}

async function main() {
  const raw = await readFile(SNAPSHOT_PATH, "utf8");
  const snapshot = JSON.parse(raw);
  const { errors, warnings } = validateSnapshot(snapshot);

  if (errors.length === 0 && warnings.length === 0) {
    console.log(`Content validation passed (${SNAPSHOT_PATH})`);
    return;
  }

  if (errors.length === 0) {
    console.log(`Content validation passed with ${warnings.length} legacy warning(s) (${SNAPSHOT_PATH})`);
    printIssues("Warnings", warnings, console.warn);
    return;
  }

  const log = WARN_ONLY ? console.warn.bind(console) : console.error.bind(console);
  printIssues(WARN_ONLY ? "Validation warnings" : "Validation errors", errors, log);
  printIssues("Legacy warnings", warnings, WARN_ONLY ? console.warn.bind(console) : console.warn);

  if (WARN_ONLY) {
    console.warn("Continuing in warn-only mode.");
    return;
  }

  process.exitCode = 1;
}

main().catch((error) => {
  console.error("Failed to validate CMS content:", error);
  process.exitCode = 1;
});
