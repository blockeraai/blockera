#!/usr/bin/env bash
# Ensure the packages/global-packages submodule is present and sparse-checked
# out to only the remote packages/ tree (no monorepo root files).
set -euo pipefail

ROOT="${1:-$(pwd)}"
SUBMODULE="${ROOT}/packages/global-packages"

if [ ! -e "${SUBMODULE}/.git" ]; then
	echo "ensure-global-packages-sparse: missing submodule at ${SUBMODULE}" >&2
	echo "Run: git submodule update --init packages/global-packages" >&2
	exit 1
fi

git -C "${SUBMODULE}" sparse-checkout init --no-cone
git -C "${SUBMODULE}" sparse-checkout set '/packages/'

if [ ! -d "${SUBMODULE}/packages/editor" ] && [ ! -d "${SUBMODULE}/packages/blockera" ]; then
	echo "ensure-global-packages-sparse: expected packages/ under ${SUBMODULE}" >&2
	ls -la "${SUBMODULE}" >&2 || true
	exit 1
fi

echo "ensure-global-packages-sparse: OK ${SUBMODULE}/packages"
