#!/usr/bin/env bash
# Link blockera-global-packages/packages/* into the consumer packages/ directory
# when a local package folder is missing. Keeps CI/tooling globs like
# packages/**/*.e2e.cy.js working after packages moved to the shared repo.
#
# Local layout expected:
#   <consumer>/                 (e.g. plugins/blockera)
#   <consumer>/../blockera-global-packages
set -euo pipefail

CONSUMER_ROOT="${1:-$(pwd)}"
GLOBAL_PACKAGES_ROOT="${2:-${CONSUMER_ROOT}/../blockera-global-packages}"
GLOBAL_PACKAGES_DIR="${GLOBAL_PACKAGES_ROOT}/packages"
CONSUMER_PACKAGES_DIR="${CONSUMER_ROOT}/packages"

if [ ! -d "${GLOBAL_PACKAGES_DIR}" ]; then
	echo "link-global-packages: missing ${GLOBAL_PACKAGES_DIR}" >&2
	exit 1
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
