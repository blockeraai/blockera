#!/usr/bin/env bash
# Link shared packages into the consumer packages/ directory when a local package
# folder is missing. Keeps CI/tooling globs like packages/**/*.e2e.cy.js working.
#
# Also ensures sibling ../packages exists for Composer/npm file: deps:
#   <consumer>/../packages  → shared packages root
#
# Local layout:
#   plugins/blockera/
#   plugins/blockera-global-packages/packages/   (source of truth)
#   plugins/packages → blockera-global-packages/packages  (created if missing)
#
# CI layout:
#   /home/runner/work/blockera/blockera/
#   /home/runner/work/blockera/packages → blockera/.blockera-global-packages/packages
set -euo pipefail

CONSUMER_ROOT="${1:-$(pwd)}"
INPUT_ROOT="${2:-}"

if [ -n "${INPUT_ROOT}" ]; then
	if [ -d "${INPUT_ROOT}/packages" ]; then
		GLOBAL_PACKAGES_DIR="${INPUT_ROOT}/packages"
	else
		GLOBAL_PACKAGES_DIR="${INPUT_ROOT}"
	fi
elif [ -d "${CONSUMER_ROOT}/../packages/editor" ] || [ -d "${CONSUMER_ROOT}/../packages/blockera" ]; then
	GLOBAL_PACKAGES_DIR="${CONSUMER_ROOT}/../packages"
elif [ -d "${CONSUMER_ROOT}/../blockera-global-packages/packages" ]; then
	GLOBAL_PACKAGES_DIR="${CONSUMER_ROOT}/../blockera-global-packages/packages"
else
	GLOBAL_PACKAGES_DIR="${CONSUMER_ROOT}/../packages"
fi

GLOBAL_PACKAGES_DIR="$(cd "${GLOBAL_PACKAGES_DIR}" && pwd)"
PACKAGES_SIBLING="$(cd "${CONSUMER_ROOT}/.." && pwd)/packages"
CONSUMER_PACKAGES_DIR="${CONSUMER_ROOT}/packages"

if [ ! -d "${GLOBAL_PACKAGES_DIR}" ]; then
	echo "link-global-packages: missing ${GLOBAL_PACKAGES_DIR}" >&2
	exit 1
fi

# Ensure consumer-relative ../packages exists for file: / Composer path deps.
if [ ! -e "${PACKAGES_SIBLING}" ]; then
	rel_sibling="$(node -e "const path=require('path'); process.stdout.write(path.relative(path.dirname(process.argv[1]), process.argv[2]))" "${PACKAGES_SIBLING}" "${GLOBAL_PACKAGES_DIR}")"
	ln -sfn "${rel_sibling}" "${PACKAGES_SIBLING}"
	echo "linked ../packages -> ${rel_sibling}"
elif [ -L "${PACKAGES_SIBLING}" ]; then
	echo "sibling ../packages already linked"
elif [ "${PACKAGES_SIBLING}" != "${GLOBAL_PACKAGES_DIR}" ]; then
	echo "sibling ../packages already exists at ${PACKAGES_SIBLING}"
fi

mkdir -p "${CONSUMER_PACKAGES_DIR}"

linked=0
skipped=0

for pkg_path in "${GLOBAL_PACKAGES_DIR}"/*; do
	[ -e "${pkg_path}" ] || continue
	name="$(basename "${pkg_path}")"
	dest="${CONSUMER_PACKAGES_DIR}/${name}"

	if [ -e "${dest}" ] || [ -L "${dest}" ]; then
		skipped=$((skipped + 1))
		continue
	fi

	# Prefer relative symlink so the consumer tree stays portable.
	rel_target="$(node -e "const path=require('path'); process.stdout.write(path.relative(process.argv[1], process.argv[2]))" "${CONSUMER_PACKAGES_DIR}" "${pkg_path}")"
	ln -sfn "${rel_target}" "${dest}"
	echo "linked packages/${name} -> ${rel_target}"
	linked=$((linked + 1))
done

echo "link-global-packages: linked=${linked} skipped-existing=${skipped}"
echo "link-global-packages: using ${GLOBAL_PACKAGES_DIR}"
