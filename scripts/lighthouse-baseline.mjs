#!/usr/bin/env node

import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { spawnSync } from "node:child_process";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.insurhi.com";
const OUTPUT_DIR = path.join(process.cwd(), "reports");

const URLS = [
  { id: "home", path: "/" },
  { id: "insurance-home", path: "/insurance/home" },
  { id: "guide-deep", path: "/guides/home-replacement-cost-vs-acv-deep-guide-2026" },
  { id: "product-flagship", path: "/products/amica-home" },
  { id: "claims-guide", path: "/claims/guides/home-hail-damage-claim-guide-2026" },
];

function runLighthouse(url) {
  const result = spawnSync(
    "npx",
    [
      "lighthouse",
      url,
      "--quiet",
      "--chrome-flags=--headless",
      "--only-categories=performance,accessibility,best-practices,seo",
      "--output=json",
      "--output-path=stdout",
    ],
    {
      encoding: "utf8",
      maxBuffer: 20 * 1024 * 1024,
    },
  );

  if (result.status !== 0) {
    throw new Error(result.stderr || result.stdout || `Lighthouse failed for ${url}`);
  }

  return JSON.parse(result.stdout);
}

function summarize(report) {
  const categories = report.categories ?? {};
  return {
    performance: Math.round((categories.performance?.score ?? 0) * 100),
    accessibility: Math.round((categories.accessibility?.score ?? 0) * 100),
    bestPractices: Math.round((categories["best-practices"]?.score ?? 0) * 100),
    seo: Math.round((categories.seo?.score ?? 0) * 100),
    lcpMs: report.audits?.["largest-contentful-paint"]?.numericValue ?? null,
    cls: report.audits?.["cumulative-layout-shift"]?.numericValue ?? null,
  };
}

async function main() {
  await mkdir(OUTPUT_DIR, { recursive: true });

  const capturedAt = new Date().toISOString();
  const results = [];

  for (const entry of URLS) {
    const url = new URL(entry.path, SITE_URL).toString();
    console.log(`Running Lighthouse: ${url}`);
    const report = runLighthouse(url);
    const summary = summarize(report);
    results.push({ id: entry.id, path: entry.path, url, ...summary });
    console.log(
      `  perf ${summary.performance} | a11y ${summary.accessibility} | bp ${summary.bestPractices} | seo ${summary.seo}`,
    );
  }

  const payload = {
    capturedAt,
    siteUrl: SITE_URL,
    results,
  };

  const datedName = `lighthouse-baseline-${capturedAt.slice(0, 10)}.json`;
  const latestPath = path.join(OUTPUT_DIR, "lighthouse-baseline-latest.json");
  const datedPath = path.join(OUTPUT_DIR, datedName);

  await writeFile(latestPath, `${JSON.stringify(payload, null, 2)}\n`);
  await writeFile(datedPath, `${JSON.stringify(payload, null, 2)}\n`);

  console.log(`\nBaseline saved to ${latestPath}`);
}

main().catch((error) => {
  console.error("Failed to capture Lighthouse baseline:", error.message ?? error);
  process.exitCode = 1;
});
