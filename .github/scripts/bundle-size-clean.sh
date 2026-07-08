#!/usr/bin/env bash
# Reset build artifacts between compressed-size-action base/PR builds.
set -euo pipefail

git checkout -- blockera.php readme.txt config/panel.php packages/env/php/functions.php 2>/dev/null || true

rm -rf dist blockera.zip inc vendor node_modules
