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

function pushIssue(issues, scope, id, message) {
  issues.push({ scope, id, message });
}

function collectText(value, buffer) {
  if (typeof value === "string") {
    buffer.push(value);
    return;
  }
  if (!value || typeof value !== "object") return;

  if (Array.isArray(value)) {
    for (const item of value) collectText(item, buffer);
    return;
  }

  for (const [key, nested] of Object.entries(value)) {
    if (key === "url" && typeof nested === "string") {
      buffer.push(nested);
    }
    collectText(nested, buffer);
  }
}

function findBlacklistHits(value) {
  const buffer = [];
  collectText(value, buffer);
  const hits = new Set();
  for (const text of buffer) {
    const lower = text.toLowerCase();
    for (const fragment of BLACKLIST_URL_FRAGMENTS) {
      if (lower.includes(fragment)) {
        hits.add(fragment);
      }
    }
  }
  return [...hits];
}

function categorySlug(value) {
  if (!value) return null;
  if (typeof value === "object" && value.slug) return value.slug;
  if (typeof value === "string" && value.trim()) return value;
  return null;
}

function validateSeo(issues, scope, id, seo) {
  if (!seo) return;
  const title = seo.metaTitle?.trim();
  const description = seo.metaDescription?.trim();

  if (title) {
    const len = title.length;
    if (len < META_TITLE_MIN || len > META_TITLE_MAX) {
      pushIssue(
        issues,
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
        issues,
        scope,
        id,
        `metaDescription length ${len} (expected ${META_DESC_MIN}-${META_DESC_MAX})`,
      );
    }
  }
}

function validateSnapshot(snapshot) {
  const issues = [];

  for (const article of snapshot.articles ?? []) {
    const id = article.slug ?? article.id ?? "unknown";
    if (!categorySlug(article.category)) {
      pushIssue(issues, "articles", id, "missing category");
    }
    validateSeo(issues, "articles", id, article.seo);
    for (const hit of findBlacklistHits(article)) {
      pushIssue(issues, "articles", id, `blacklist URL fragment: ${hit}`);
    }
  }

  for (const product of snapshot.products ?? []) {
    const id = product.slug ?? product.id ?? "unknown";
    validateSeo(issues, "products", id, product.seo);
    for (const hit of findBlacklistHits(product)) {
      pushIssue(issues, "products", id, `blacklist URL fragment: ${hit}`);
    }
  }

  for (const guide of snapshot.claimsGuides ?? []) {
    const id = guide.slug ?? guide.id ?? "unknown";
    if (!categorySlug(guide.category)) {
      pushIssue(issues, "claims-guides", id, "missing category");
    }
    for (const hit of findBlacklistHits(guide)) {
      pushIssue(issues, "claims-guides", id, `blacklist URL fragment: ${hit}`);
    }
  }

  for (const faq of snapshot.faqItems ?? []) {
    const id = faq.question ?? faq.id ?? "unknown";
    if (!categorySlug(faq.category)) {
      pushIssue(issues, "faq-items", id, "missing category");
    }
  }

  for (const page of snapshot.pages ?? []) {
    const id = page.slug ?? page.id ?? "unknown";
    validateSeo(issues, "pages", id, page.seo);
    for (const hit of findBlacklistHits(page)) {
      pushIssue(issues, "pages", id, `blacklist URL fragment: ${hit}`);
    }
  }

  for (const term of snapshot.glossaryTerms ?? []) {
    const id = term.slug ?? term.id ?? "unknown";
    if (!term.term?.trim()) {
      pushIssue(issues, "glossary-terms", id, "missing term");
    }
    if (!term.definition?.trim()) {
      pushIssue(issues, "glossary-terms", id, "missing definition");
    }
  }

  return issues;
}

async function main() {
  const raw = await readFile(SNAPSHOT_PATH, "utf8");
  const snapshot = JSON.parse(raw);
  const issues = validateSnapshot(snapshot);

  if (issues.length === 0) {
    console.log(`Content validation passed (${SNAPSHOT_PATH})`);
    return;
  }

  const log = WARN_ONLY ? console.warn.bind(console) : console.error.bind(console);
  const label = WARN_ONLY ? "warnings" : "failed";
  log(`Content validation ${label} with ${issues.length} issue(s):`);
  for (const issue of issues) {
    log(`- [${issue.scope}] ${issue.id}: ${issue.message}`);
  }
  if (WARN_ONLY) {
    console.warn("Continuing in warn-only mode (legacy cleanup tracked for Day 2+).");
    return;
  }
  process.exitCode = 1;
}

main().catch((error) => {
  console.error("Failed to validate CMS content:", error);
  process.exitCode = 1;
});
