#!/usr/bin/env bash
# Init/update the packages/global-packages submodule and sparse-checkout only
# the remote packages/ tree (no monorepo root files).
#
# Private CI auth (optional):
#   BLOCKERA_GLOBAL_PACKAGES_TOKEN or GITHUB_TOKEN — PAT with repo read on
#   blockeraai/blockera-global-packages
set -euo pipefail

ROOT="${1:-$(pwd)}"
SUBMODULE_PATH="packages/global-packages"
SUBMODULE="${ROOT}/${SUBMODULE_PATH}"
TOKEN="${BLOCKERA_GLOBAL_PACKAGES_TOKEN:-${GITHUB_TOKEN:-}}"

cd "${ROOT}"

if [ -n "${TOKEN}" ]; then
	# Prefer HTTPS with token over SSH (Actions has no deploy key by default).
	git config --global url."https://x-access-token:${TOKEN}@github.com/".insteadOf "https://github.com/"
	git config --global url."https://x-access-token:${TOKEN}@github.com/".insteadOf "git@github.com:"
	git config --global url."https://x-access-token:${TOKEN}@github.com/".insteadOf "ssh://git@github.com/"
fi

git submodule sync -- "${SUBMODULE_PATH}"

# Do not use --depth: shallow fetches of a pinned SHA fail on GitHub with
# "upload-pack: not our ref" when the commit is not on the default branch tip.
git submodule update --init --force -- "${SUBMODULE_PATH}"

if [ ! -e "${SUBMODULE}/.git" ]; then
	echo "ensure-global-packages-sparse: missing submodule at ${SUBMODULE}" >&2
	exit 1
fi

git -C "${SUBMODULE}" sparse-checkout init --no-cone
git -C "${SUBMODULE}" sparse-checkout set '/packages/'

if [ ! -d "${SUBMODULE}/packages/editor" ] && [ ! -d "${SUBMODULE}/packages/blockera" ]; then
	echo "ensure-global-packages-sparse: expected packages/ under ${SUBMODULE}" >&2
	ls -la "${SUBMODULE}" >&2 || true
	exit 1
fi

echo "ensure-global-packages-sparse: OK ${SUBMODULE}/packages @ $(git -C "${SUBMODULE}" rev-parse --short HEAD)"
