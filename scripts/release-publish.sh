#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

cd "${ROOT_DIR}"

echo "==> [1/2] Generate"
npm run release:generate

echo "==> [2/2] Commit and push"
npm run release:push -- "$@"

echo ""
echo "Release pipeline done."
echo "If Vercel auto-deploy is enabled on main, production deployment is now triggered."
