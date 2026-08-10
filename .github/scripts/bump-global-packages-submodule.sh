#!/usr/bin/env bash
# Point packages/global-packages at a remote SHA/branch tip and stage the gitlink.
#
# Usage:
#   bump-global-packages-submodule.sh [sha|branch] [repo-root]
#
# Env:
#   BLOCKERA_GLOBAL_PACKAGES_TOKEN / GITHUB_TOKEN — optional HTTPS auth for private fetch
set -euo pipefail

TARGET_REF="${1:-master}"
ROOT="${2:-$(pwd)}"
SUBMODULE_PATH="packages/global-packages"
SUBMODULE="${ROOT}/${SUBMODULE_PATH}"
TOKEN="${BLOCKERA_GLOBAL_PACKAGES_TOKEN:-${GITHUB_TOKEN:-}}"

cd "${ROOT}"

if [ -n "${TOKEN}" ]; then
	git config --global url."https://x-access-token:${TOKEN}@github.com/".insteadOf "https://github.com/"
	git config --global url."https://x-access-token:${TOKEN}@github.com/".insteadOf "git@github.com:"
	git config --global url."https://x-access-token:${TOKEN}@github.com/".insteadOf "ssh://git@github.com/"
fi

git submodule sync -- "${SUBMODULE_PATH}"

if [ ! -e "${SUBMODULE}/.git" ]; then
	git submodule update --init --force -- "${SUBMODULE_PATH}"
fi

git -C "${SUBMODULE}" fetch --force --prune origin "+refs/heads/*:refs/remotes/origin/*" "+refs/tags/*:refs/tags/*"

RESOLVED_SHA="$(git -C "${SUBMODULE}" rev-parse --verify "${TARGET_REF}^{commit}" 2>/dev/null || true)"
if [ -z "${RESOLVED_SHA}" ]; then
	RESOLVED_SHA="$(git -C "${SUBMODULE}" rev-parse --verify "origin/${TARGET_REF}^{commit}" 2>/dev/null || true)"
fi
if [ -z "${RESOLVED_SHA}" ]; then
	echo "bump-global-packages-submodule: cannot resolve '${TARGET_REF}'" >&2
	exit 1
fi

git -C "${SUBMODULE}" checkout --detach --force "${RESOLVED_SHA}"
git -C "${SUBMODULE}" sparse-checkout init --no-cone
git -C "${SUBMODULE}" sparse-checkout set '/packages/'

git add "${SUBMODULE_PATH}"

SHORT_SHA="$(git -C "${SUBMODULE}" rev-parse --short HEAD)"
echo "bump-global-packages-submodule: staged ${SUBMODULE_PATH} @ ${SHORT_SHA} (${RESOLVED_SHA})"
echo "sha=${RESOLVED_SHA}"
echo "short_sha=${SHORT_SHA}"
