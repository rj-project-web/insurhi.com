#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

cd "${ROOT_DIR}"

echo "==> [1/3] Export CMS content snapshot"
npm run export:cms-content

echo "==> [2/3] Run lint"
npm run lint

echo "==> [3/3] Build static site artifacts"
npm run build

echo ""
echo "Static publish preparation complete."
echo "Next steps:"
echo "  1) git add content/cms-content.json"
echo "  2) git commit -m \"chore(content): refresh static CMS snapshot\""
echo "  3) git push origin main"
echo "  4) Ensure Vercel env: CMS_CONTENT_SOURCE=static"
