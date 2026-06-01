#!/usr/bin/env node

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.insurhi.com";

const CHECKS = [
  {
    path: "/guides/home-replacement-cost-vs-acv-deep-guide-2026",
    requiredTypes: ["Article", "BreadcrumbList"],
  },
  {
    path: "/products/amica-home",
    requiredTypes: ["Product", "BreadcrumbList"],
  },
  {
    path: "/claims/guides/home-hail-damage-claim-guide-2026",
    requiredTypes: ["HowTo", "BreadcrumbList"],
  },
  {
    path: "/insurance/home",
    requiredTypes: ["FAQPage", "BreadcrumbList"],
  },
];

function collectJsonLdTypes(html) {
  const types = new Set();
  const pattern = /<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi;
  let match = pattern.exec(html);

  while (match) {
    try {
      const parsed = JSON.parse(match[1]);
      const nodes = Array.isArray(parsed) ? parsed : [parsed];
      for (const node of nodes) {
        if (node?.["@type"]) {
          types.add(node["@type"]);
        }
        if (Array.isArray(node?.["@graph"])) {
          for (const graphNode of node["@graph"]) {
            if (graphNode?.["@type"]) {
              types.add(graphNode["@type"]);
            }
          }
        }
      }
    } catch {
      // ignore malformed blocks
    }
    match = pattern.exec(html);
  }

  return types;
}

async function main() {
  const failures = [];

  for (const check of CHECKS) {
    const url = new URL(check.path, SITE_URL).toString();
    const response = await fetch(url, { redirect: "follow" });

    if (!response.ok) {
      failures.push(`${check.path}: HTTP ${response.status}`);
      continue;
    }

    const html = await response.text();
    const types = collectJsonLdTypes(html);
    const missing = check.requiredTypes.filter((type) => !types.has(type));

    if (missing.length > 0) {
      failures.push(`${check.path}: missing JSON-LD types ${missing.join(", ")}`);
      continue;
    }

    console.log(`OK  ${check.path} -> ${check.requiredTypes.join(", ")}`);
  }

  if (failures.length > 0) {
    console.error("Schema validation failed:");
    for (const failure of failures) {
      console.error(`- ${failure}`);
    }
    process.exitCode = 1;
    return;
  }

  console.log(`Schema validation passed (${CHECKS.length} URLs)`);
}

main().catch((error) => {
  console.error("Failed to validate schema:", error);
  process.exitCode = 1;
});
