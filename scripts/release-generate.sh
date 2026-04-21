#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

cd "${ROOT_DIR}"

echo "==> Generate static release artifacts"
npm run publish:static

echo ""
echo "Generate complete."
echo "You can now run:"
echo "  npm run release:push"
