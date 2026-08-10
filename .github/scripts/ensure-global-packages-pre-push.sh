#!/usr/bin/env bash
# Ensure packages/global-packages pin SHAs being pushed exist on origin.
# If the pin is local-only and the submodule is on the prefixed mirror branch
# (<repo>/<consumer-branch>), push that branch first so CI can fetch the pin.
#
# Skip with: BLOCKERA_SKIP_SUBMODULE_PUSH=1
# Husky pre-push feeds: <local_ref> <local_sha> <remote_ref> <remote_sha>
set -euo pipefail

if [ "${BLOCKERA_SKIP_SUBMODULE_PUSH:-}" = "1" ]; then
	exit 0
fi

ROOT="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
SUBMODULE_PATH="packages/global-packages"
SUBMODULE="${ROOT}/${SUBMODULE_PATH}"

if [ ! -e "${SUBMODULE}/.git" ]; then
	echo "husky: packages/global-packages missing — run bash .github/scripts/ensure-global-packages-sparse.sh" >&2
	exit 1
fi

# Uncommitted submodule work would mean the pin may not match what developers expect.
if ! git -C "${SUBMODULE}" diff --quiet || ! git -C "${SUBMODULE}" diff --cached --quiet; then
	echo "husky: packages/global-packages has uncommitted changes; commit or stash before push" >&2
	exit 1
fi

REPO_NAME="$(basename -s .git "$(git -C "${ROOT}" remote get-url origin 2>/dev/null || true)" 2>/dev/null || true)"
if [ -z "${REPO_NAME}" ]; then
	REPO_NAME="$(basename "${ROOT}")"
fi

ensure_pin_on_origin() {
	local pin_sha="$1"

	if [ -z "${pin_sha}" ]; then
		return 0
	fi

	if ! git -C "${SUBMODULE}" cat-file -e "${pin_sha}^{commit}" 2>/dev/null; then
		echo "husky: pinned global-packages SHA ${pin_sha} is not present locally" >&2
		exit 1
	fi

	# Already advertised on origin?
	if git -C "${SUBMODULE}" fetch --quiet origin "${pin_sha}" 2>/dev/null; then
		return 0
	fi

	local sub_branch
	sub_branch="$(git -C "${SUBMODULE}" branch --show-current 2>/dev/null || true)"
	local consumer_branch
	consumer_branch="$(git -C "${ROOT}" branch --show-current 2>/dev/null || true)"
	local expected_mirror=""
	if [ -n "${consumer_branch}" ]; then
		case "${consumer_branch}" in
			"${REPO_NAME}/"*)
				expected_mirror="${consumer_branch}"
				;;
			*)
				expected_mirror="${REPO_NAME}/${consumer_branch}"
				;;
		esac
	fi

	if [ -n "${sub_branch}" ] && [ -n "${expected_mirror}" ] && [ "${sub_branch}" = "${expected_mirror}" ]; then
		if ! git -C "${SUBMODULE}" merge-base --is-ancestor "${pin_sha}" HEAD 2>/dev/null; then
			echo "husky: pin ${pin_sha} is not on submodule branch '${sub_branch}'" >&2
			exit 1
		fi
		echo "husky: pushing global-packages branch '${sub_branch}' so pin ${pin_sha:0:7} is on origin"
		git -C "${SUBMODULE}" push -u origin "HEAD:${sub_branch}"
		return 0
	fi

	echo "husky: pinned global-packages SHA ${pin_sha:0:7} is not on origin." >&2
	echo "husky: push it from packages/global-packages (or set BLOCKERA_SKIP_SUBMODULE_PUSH=1)." >&2
	exit 1
}

while read -r local_ref local_sha remote_ref remote_sha; do
	# Deleting a remote ref — nothing to validate.
	if [ "${local_sha}" = "0000000000000000000000000000000000000000" ]; then
		continue
	fi

	pin_sha="$(git -C "${ROOT}" ls-tree "${local_sha}" "${SUBMODULE_PATH}" 2>/dev/null | awk '{print $3}')"
	ensure_pin_on_origin "${pin_sha}"
done
