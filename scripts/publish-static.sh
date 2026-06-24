#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

cd "${ROOT_DIR}"

echo "==> [1/6] Export CMS content snapshot"
npm run export:cms-content

echo "==> [2/6] Validate CMS content snapshot"
npm run validate:content

echo "==> [3/6] Validate internal link graph"
npm run validate:internal-links

echo "==> [4/6] Validate sitemap coverage and lastmod"
npm run validate:sitemap-coverage

echo "==> [5/6] Run lint"
npm run lint

echo "==> [6/6] Build static site artifacts (regenerates sitemap.xml)"
npm run build

echo ""
echo "Static publish preparation complete."
echo "Next steps:"
echo "  1) git add content/cms-content.json"
echo "  2) git commit -m \"chore(content): refresh static CMS snapshot\""
echo "  3) git push origin main"
echo "  4) Ensure Vercel env: CMS_CONTENT_SOURCE=static"
