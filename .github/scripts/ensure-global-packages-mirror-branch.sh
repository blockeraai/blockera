#!/usr/bin/env bash
# When a new consumer branch is created, create a prefixed mirror branch in
# packages/global-packages from origin/master (fallback: master) and check it out.
#
# Mirror name: <repo>/<branch>  (e.g. blockera-pro/fix/foo)
# Repo is derived from `origin` remote basename (fallback: directory name).
#
# Skip with: BLOCKERA_SKIP_SUBMODULE_BRANCH=1
# Invoked from .husky/post-checkout with: prev_head new_head is_branch_checkout
set -euo pipefail

if [ "${BLOCKERA_SKIP_SUBMODULE_BRANCH:-}" = "1" ]; then
	exit 0
fi

IS_BRANCH_CHECKOUT="${3:-0}"

# Only branch checkouts (not file checkouts).
if [ "${IS_BRANCH_CHECKOUT}" != "1" ]; then
	exit 0
fi

ROOT="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
cd "${ROOT}"

BRANCH="$(git branch --show-current 2>/dev/null || true)"
if [ -z "${BRANCH}" ]; then
	exit 0
fi

case "${BRANCH}" in
	master | main | develop | trunk)
		exit 0
		;;
esac

# Detect a freshly created branch via its newest reflog entry.
# `git checkout -b` / `git switch -c` → "branch: Created from ..."
# Switching to an existing branch → "checkout: moving from ..."
REFLOG_LINE="$(git reflog show --date=unix -n1 "${BRANCH}" 2>/dev/null || true)"
case "${REFLOG_LINE}" in
	*'branch: Created from'*)
		;;
	*)
		exit 0
		;;
esac

# Ignore stale "Created from" if somehow still the tip (safety window: 30s).
REFLOG_TS="$(printf '%s\n' "${REFLOG_LINE}" | sed -n 's/.*@{\([0-9][0-9]*\)}.*/\1/p')"
if [ -n "${REFLOG_TS}" ]; then
	NOW="$(date +%s)"
	AGE="$((NOW - REFLOG_TS))"
	if [ "${AGE}" -gt 30 ]; then
		exit 0
	fi
fi

REPO_NAME="$(basename -s .git "$(git remote get-url origin 2>/dev/null || true)" 2>/dev/null || true)"
if [ -z "${REPO_NAME}" ]; then
	REPO_NAME="$(basename "${ROOT}")"
fi

case "${BRANCH}" in
	"${REPO_NAME}/"*)
		MIRROR_BRANCH="${BRANCH}"
		;;
	*)
		MIRROR_BRANCH="${REPO_NAME}/${BRANCH}"
		;;
esac

SUBMODULE_PATH="packages/global-packages"
SUBMODULE="${ROOT}/${SUBMODULE_PATH}"

if [ ! -e "${SUBMODULE}/.git" ]; then
	# Best-effort init so local branch creates still work after a fresh clone.
	if [ -f "${ROOT}/.github/scripts/ensure-global-packages-sparse.sh" ]; then
		bash "${ROOT}/.github/scripts/ensure-global-packages-sparse.sh" "${ROOT}" || true
	fi
fi

if [ ! -e "${SUBMODULE}/.git" ]; then
	echo "husky: skip global-packages mirror — submodule missing at ${SUBMODULE_PATH}" >&2
	exit 0
fi

# Prefer freshly fetched origin/master; fall back to local master.
BASE_REF=""
if git -C "${SUBMODULE}" fetch --quiet origin master 2>/dev/null; then
	if git -C "${SUBMODULE}" rev-parse --verify --quiet origin/master >/dev/null; then
		BASE_REF="origin/master"
	fi
fi
if [ -z "${BASE_REF}" ]; then
	if git -C "${SUBMODULE}" rev-parse --verify --quiet master >/dev/null; then
		BASE_REF="master"
	elif git -C "${SUBMODULE}" rev-parse --verify --quiet origin/master >/dev/null; then
		BASE_REF="origin/master"
	else
		echo "husky: skip global-packages mirror — no master/origin.master in submodule" >&2
		exit 0
	fi
fi

CURRENT_SUB_BRANCH="$(git -C "${SUBMODULE}" branch --show-current 2>/dev/null || true)"
if [ "${CURRENT_SUB_BRANCH}" = "${MIRROR_BRANCH}" ]; then
	exit 0
fi

if git -C "${SUBMODULE}" show-ref --verify --quiet "refs/heads/${MIRROR_BRANCH}"; then
	echo "husky: checking out existing global-packages branch '${MIRROR_BRANCH}'"
	git -C "${SUBMODULE}" checkout --quiet "${MIRROR_BRANCH}"
	exit 0
fi

if git -C "${SUBMODULE}" show-ref --verify --quiet "refs/remotes/origin/${MIRROR_BRANCH}"; then
	echo "husky: checking out remote-tracking global-packages branch '${MIRROR_BRANCH}'"
	git -C "${SUBMODULE}" checkout --quiet -B "${MIRROR_BRANCH}" "origin/${MIRROR_BRANCH}"
	exit 0
fi

echo "husky: creating global-packages mirror branch '${MIRROR_BRANCH}' from ${BASE_REF}"
git -C "${SUBMODULE}" checkout --quiet -b "${MIRROR_BRANCH}" "${BASE_REF}"
echo "husky: submodule is now on '${MIRROR_BRANCH}' (pin dirty until you commit packages/global-packages)"
