#!/usr/bin/env bash
# Init/update the packages/global-packages submodule and sparse-checkout only
# the remote packages/ tree (no monorepo root files).
#
# Private CI auth (optional):
#   BLOCKERA_GLOBAL_PACKAGES_TOKEN or GITHUB_TOKEN — PAT with repo read on
#   blockeraai/blockera-global-packages
#
# Works with SSH or HTTPS urls in .gitmodules. On CI (token present), the active
# submodule URL is rewritten to HTTPS + PAT so Actions never needs an SSH key.
set -euo pipefail

ROOT="${1:-$(pwd)}"
SUBMODULE_PATH="packages/global-packages"
SUBMODULE="${ROOT}/${SUBMODULE_PATH}"
TOKEN="${BLOCKERA_GLOBAL_PACKAGES_TOKEN:-${GITHUB_TOKEN:-}}"

cd "${ROOT}"

# Map .gitmodules URL (ssh or https) → https://x-access-token:TOKEN@github.com/...
# Prefer rewriting submodule.*.url over url.*.insteadOf: insteadOf is not
# idempotent when setup-node and setup-php both run this script (multi-value
# overwrite errors), and scp-like git@host:path often still invokes SSH.
configure_ci_submodule_https() {
	local token="$1"
	local raw https_path authed

	raw="$(git config -f .gitmodules --get "submodule.${SUBMODULE_PATH}.url" 2>/dev/null || true)"
	case "${raw}" in
		git@github.com:*)
			https_path="${raw#git@github.com:}"
			;;
		ssh://git@github.com/*)
			https_path="${raw#ssh://git@github.com/}"
			;;
		https://github.com/*)
			https_path="${raw#https://github.com/}"
			;;
		http://github.com/*)
			https_path="${raw#http://github.com/}"
			;;
		*)
			https_path="blockeraai/blockera-global-packages.git"
			;;
	esac

	authed="https://x-access-token:${token}@github.com/${https_path}"

	# Pin the live submodule URL after sync so clone/fetch never use SSH on CI.
	git config "submodule.${SUBMODULE_PATH}.url" "${authed}"
}

git submodule sync -- "${SUBMODULE_PATH}"

if [ -n "${TOKEN}" ]; then
	configure_ci_submodule_https "${TOKEN}"
fi

# Do not use --depth: shallow fetches of a pinned SHA fail on GitHub with
# "upload-pack: not our ref" when the commit is not on the default branch tip.
git submodule update --init --force -- "${SUBMODULE_PATH}"

if [ ! -e "${SUBMODULE}/.git" ]; then
	echo "ensure-global-packages-sparse: missing submodule at ${SUBMODULE}" >&2
	exit 1
fi

# Keep submodule origin on the authed HTTPS URL for later fetches (bump/sync).
if [ -n "${TOKEN}" ]; then
	ORIGIN_URL="$(git config --get "submodule.${SUBMODULE_PATH}.url" 2>/dev/null || true)"
	if [ -n "${ORIGIN_URL}" ]; then
		git -C "${SUBMODULE}" remote set-url origin "${ORIGIN_URL}" 2>/dev/null || true
	fi
fi

git -C "${SUBMODULE}" sparse-checkout init --no-cone
git -C "${SUBMODULE}" sparse-checkout set '/packages/'

if [ ! -d "${SUBMODULE}/packages/editor" ] && [ ! -d "${SUBMODULE}/packages/blockera" ]; then
	echo "ensure-global-packages-sparse: expected packages/ under ${SUBMODULE}" >&2
	ls -la "${SUBMODULE}" >&2 || true
	exit 1
fi

echo "ensure-global-packages-sparse: OK ${SUBMODULE}/packages @ $(git -C "${SUBMODULE}" rev-parse --short HEAD)"
