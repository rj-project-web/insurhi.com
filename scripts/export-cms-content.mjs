#!/usr/bin/env node

import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const CMS_BASE_URL = process.env.CMS_EXPORT_SOURCE_URL ?? "http://localhost:3000";
const OUTPUT_PATH =
  process.env.CMS_EXPORT_OUTPUT_PATH ?? path.join(process.cwd(), "content/cms-content.json");
const REQUEST_TIMEOUT_MS = 15000;

async function fetchCollection(endpoint) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(`${CMS_BASE_URL}${endpoint}`, {
      cache: "no-store",
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`Request failed: ${endpoint} => ${response.status}`);
    }

    const json = await response.json();
    return Array.isArray(json?.docs) ? json.docs : [];
  } finally {
    clearTimeout(timeout);
  }
}

async function main() {
  const [categories, providers, products, articles, faqItems, claimsGuides, claimCases, pages] =
    await Promise.all([
      fetchCollection("/api/categories?limit=200&sort=title"),
      fetchCollection("/api/providers?limit=500&sort=name&depth=1"),
      fetchCollection("/api/products?limit=500&sort=name&depth=1"),
      fetchCollection("/api/articles?limit=500&sort=-publishedAt"),
      fetchCollection("/api/faq-items?limit=500&depth=1"),
      fetchCollection("/api/claims-guides?limit=200&sort=title"),
      fetchCollection("/api/claim-cases?limit=500"),
      fetchCollection("/api/pages?limit=500&sort=title"),
    ]);

  const payload = {
    meta: {
      exportedAt: new Date().toISOString(),
      source: CMS_BASE_URL,
    },
    categories,
    providers,
    products,
    articles,
    faqItems,
    claimsGuides,
    claimCases,
    pages,
  };

  await mkdir(path.dirname(OUTPUT_PATH), { recursive: true });
  await writeFile(OUTPUT_PATH, `${JSON.stringify(payload, null, 2)}\n`, "utf8");

  console.log(`Exported CMS content to ${OUTPUT_PATH}`);
  console.log(
    `Counts -> categories:${categories.length}, providers:${providers.length}, products:${products.length}, articles:${articles.length}, faqItems:${faqItems.length}, claimsGuides:${claimsGuides.length}, claimCases:${claimCases.length}, pages:${pages.length}`,
  );
}

main().catch((error) => {
  console.error("Failed to export CMS content:", error);
  process.exitCode = 1;
});
