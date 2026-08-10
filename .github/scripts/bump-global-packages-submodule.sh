#!/usr/bin/env bash
# Point packages/global-packages at a remote SHA/branch tip, stage the gitlink, and commit.
#
# Usage:
#   bump-global-packages-submodule.sh [sha|branch] [repo-root]
#
# Local (no ref arg): advance the current pin to the tip of the branch that contains it.
#   - If the pin is on master → master tip
#   - Else if exactly one remote branch contains it → that branch tip
#   - Else if multiple remote branches contain it → master tip (ambiguous)
#   - Else → error
# Explicit ref/SHA always wins. CI should pass the ref (defaults to master if omitted).
#
# Env:
#   BLOCKERA_GLOBAL_PACKAGES_TOKEN / GITHUB_TOKEN — optional HTTPS auth for private fetch
#
# Compatible with SSH or HTTPS .gitmodules urls (CI rewrites to HTTPS + PAT).
set -euo pipefail

EXPLICIT_REF="${1:-}"
ROOT="${2:-$(pwd)}"
SUBMODULE_PATH="packages/global-packages"
SUBMODULE="${ROOT}/${SUBMODULE_PATH}"
TOKEN="${BLOCKERA_GLOBAL_PACKAGES_TOKEN:-${GITHUB_TOKEN:-}}"
MAX_COMMITS=5

cd "${ROOT}"

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

	# Explicit URL only — avoid url.*.insteadOf (not idempotent across setup steps).
	git config "submodule.${SUBMODULE_PATH}.url" "${authed}"
}

# Previous pin from the parent repo HEAD (before we move the submodule).
PREV_SHA="$(git rev-parse "HEAD:${SUBMODULE_PATH}" 2>/dev/null || true)"

git submodule sync -- "${SUBMODULE_PATH}"

if [ -n "${TOKEN}" ]; then
	configure_ci_submodule_https "${TOKEN}"
fi

if [ ! -e "${SUBMODULE}/.git" ]; then
	git submodule update --init --force -- "${SUBMODULE_PATH}"
fi

if [ -n "${TOKEN}" ]; then
	ORIGIN_URL="$(git config --get "submodule.${SUBMODULE_PATH}.url" 2>/dev/null || true)"
	if [ -n "${ORIGIN_URL}" ]; then
		git -C "${SUBMODULE}" remote set-url origin "${ORIGIN_URL}" 2>/dev/null || true
	fi
fi

git -C "${SUBMODULE}" fetch --force --prune origin "+refs/heads/*:refs/remotes/origin/*" "+refs/tags/*:refs/tags/*"

# Resolve which ref tip to pin (local auto-detect when no arg).
if [ -n "${EXPLICIT_REF}" ]; then
	TARGET_REF="${EXPLICIT_REF}"
elif [ "${CI:-}" = "true" ]; then
	TARGET_REF="master"
else
	if [ -z "${PREV_SHA}" ]; then
		echo "bump-global-packages-submodule: no existing pin at ${SUBMODULE_PATH}; pass an explicit ref" >&2
		exit 1
	fi

	# Prefer master whenever the current pin is already on master's history.
	if git -C "${SUBMODULE}" rev-parse --verify --quiet "origin/master^{commit}" >/dev/null \
		&& git -C "${SUBMODULE}" merge-base --is-ancestor "${PREV_SHA}" "origin/master"; then
		TARGET_REF="master"
	else
		CANDIDATES=()
		while IFS= read -r remote_ref; do
			[ -z "${remote_ref}" ] && continue
			case "${remote_ref}" in
				origin/HEAD) continue ;;
				origin/master | origin/main) continue ;;
			esac
			CANDIDATES+=("${remote_ref#origin/}")
		done < <(
			git -C "${SUBMODULE}" branch -r --contains "${PREV_SHA}" \
				| sed -e 's/^[* ]*//' -e 's/ -> .*//'
		)

		if [ "${#CANDIDATES[@]}" -eq 0 ]; then
			echo "bump-global-packages-submodule: current pin ${PREV_SHA} is not on any remote branch" >&2
			exit 1
		fi

		if [ "${#CANDIDATES[@]}" -eq 1 ]; then
			TARGET_REF="${CANDIDATES[0]}"
		else
			echo "bump-global-packages-submodule: pin ${PREV_SHA} is on multiple branches (${CANDIDATES[*]}); falling back to master" >&2
			TARGET_REF="master"
		fi
	fi

	echo "bump-global-packages-submodule: auto-detected target ref '${TARGET_REF}' from pin ${PREV_SHA}"
fi

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
echo "target_ref=${TARGET_REF}"

if git diff --cached --quiet -- "${SUBMODULE_PATH}"; then
	echo "bump-global-packages-submodule: already at ${SHORT_SHA}; nothing to commit"
	echo "changed=false"
	exit 0
fi

# CI keeps its own commit step; only auto-commit for local/manual bumps.
if [ "${CI:-}" = "true" ]; then
	echo "changed=true"
	echo "bump-global-packages-submodule: staged only (CI=true); skipping commit"
	exit 0
fi

COMMIT_SUBJECT="submodule: bump global-packages to ${SHORT_SHA}"
COMMIT_BODY=""

if [ -n "${PREV_SHA}" ] && [ "${PREV_SHA}" != "${RESOLVED_SHA}" ]; then
	TOTAL="$(git -C "${SUBMODULE}" rev-list --count "${PREV_SHA}..${RESOLVED_SHA}" 2>/dev/null || echo 0)"
	if [ "${TOTAL}" -gt 0 ]; then
		COMMIT_BODY="$(git -C "${SUBMODULE}" log --pretty=format:'- %s' -n "${MAX_COMMITS}" "${PREV_SHA}..${RESOLVED_SHA}")"
		if [ "${TOTAL}" -gt "${MAX_COMMITS}" ]; then
			MORE=$((TOTAL - MAX_COMMITS))
			COMMIT_BODY="${COMMIT_BODY}"$'\n'"- ...and ${MORE} more commits"
		fi
	fi
fi

if [ -n "${COMMIT_BODY}" ]; then
	git commit -m "${COMMIT_SUBJECT}" -m "${COMMIT_BODY}"
else
	git commit -m "${COMMIT_SUBJECT}"
fi

echo "changed=true"
echo "commit=$(git rev-parse --short HEAD)"
echo "bump-global-packages-submodule: committed ${COMMIT_SUBJECT}"
