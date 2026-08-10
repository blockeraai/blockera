#!/bin/bash

# Exit if any command fails.
set -e

# Change to the expected directory.
cd "$(dirname "$0")"
cd ..

# Enable nicer messaging for build status.
BLUE_BOLD='\033[1;34m';
GREEN_BOLD='\033[1;32m';
RED_BOLD='\033[1;31m';
YELLOW_BOLD='\033[1;33m';
COLOR_RESET='\033[0m';
error () {
	echo -e "\n${RED_BOLD}$1${COLOR_RESET}\n"
}
status () {
	echo -e "\n${BLUE_BOLD}$1${COLOR_RESET}\n"
}
success () {
	echo -e "\n${GREEN_BOLD}$1${COLOR_RESET}\n"
}
warning () {
	echo -e "\n${YELLOW_BOLD}$1${COLOR_RESET}\n"
}

status "💃 Time to build the Blockera plugin ZIP file 🕺"

if [ -z "$NO_CHECKS" ]; then
	# Make sure there are no changes in the working tree. Release builds should be
	# traceable to a particular commit and reliably reproducible.
	changed=
	if ! git diff --exit-code > /dev/null; then
		changed="file(s) modified"
	elif ! git diff --cached --exit-code > /dev/null; then
		changed="file(s) staged"
	fi
	if [ ! -z "$changed" ]; then
		git status
		error "ERROR: Cannot build plugin zip with dirty working tree. ☝️
		Commit your changes and try again."
		exit 1
	fi

	# Do a dry run of the repository reset. Prompting the user for a list of all
	# files that will be removed should prevent them from losing important files!
	#
	# Keep the sparse global-packages submodule working tree intact.
	status "Resetting the repository to pristine condition. ✨"
	git_clean_excludes=(
		--exclude=packages/global-packages
		--exclude=packages/global-packages/**
	)
	to_clean=$(git clean -xdf --dry-run "${git_clean_excludes[@]}")
	if [ ! -z "$to_clean" ]; then
		echo $to_clean
		warning "🚨 About to delete everything above! Is this okay? 🚨"
		echo -n "[y]es/[N]o: "
		read answer
		if [ "$answer" != "${answer#[Yy]}" ]; then
			# Remove ignored files to reset repository to pristine condition. Previous
			# test ensures that changed files abort the plugin build.
			status "Cleaning working directory... 🛀"
			git clean -xdf "${git_clean_excludes[@]}"
		else
			error "Fair enough; aborting. Tidy up your repo and try again. 🙂"
			exit 1
		fi
	fi
fi

# Clean old and extra files
status "Cleaning build files... 🗂"
rm -r -f dist

# Run the build.
status "Installing dependencies... 📦"
if [ -z "$NO_INSTALL_COMPOSER" ]; then
  composer install --no-dev -o --apcu-autoloader -a
fi
if [ -z "$NO_INSTALL_NPM" ]; then
  npm i
fi

status "Generating build... 🗂"
npm run build

# Shared packages live in packages/global-packages/packages and are consumed via
# Composer path repos under vendor/blockera/*. Prefer vendor for packaging.
resolve_shared_package_file () {
	local relative_path="$1"
	local candidate
	for candidate in \
		"vendor/blockera/${relative_path}" \
		"packages/global-packages/packages/${relative_path}"
	do
		if [ -f "${candidate}" ]; then
			php -r 'echo realpath($argv[1]);' "${candidate}"
			return 0
		fi
	done
	return 1
}

strip_dev_only_local_experimental_config () {
	local input_file="$1"
	local output_file="$2"

	php -r '
		$in = $argv[1];
		$out = $argv[2];
		$c = file_get_contents($in);
		if ($c === false) { fwrite(STDERR, "Failed to read: $in\n"); exit(1); }
		$re = "/^[ \\t]*### BEGIN DEV-ONLY LOCAL EXPERIMENTAL CONFIG\\R[\\s\\S]*?^[ \\t]*### END DEV-ONLY LOCAL EXPERIMENTAL CONFIG\\R?/m";
		$c2 = preg_replace($re, "", $c);
		if ($c2 === null) { fwrite(STDERR, "preg_replace failed for: $in\n"); exit(1); }
		if (file_put_contents($out, $c2) === false) { fwrite(STDERR, "Failed to write: $out\n"); exit(1); }
	' "$input_file" "$output_file"
}

# Track temporary production edits so cleanup can always restore them
# (env package is no longer in this git repo).
ZIP_BUILD_BACKUPS=()
restore_zip_build_backups () {
	local backup
	local original
	for backup in "${ZIP_BUILD_BACKUPS[@]:-}"; do
		[ -n "${backup}" ] || continue
		original="${backup%.zip-build.bak}"
		if [ -f "${backup}" ]; then
			mv -f "${backup}" "${original}"
		fi
	done
	ZIP_BUILD_BACKUPS=()
}
trap restore_zip_build_backups EXIT

backup_and_replace () {
	local target_file="$1"
	local next_file="$2"

	cp "${target_file}" "${target_file}.zip-build.bak"
	ZIP_BUILD_BACKUPS+=("${target_file}.zip-build.bak")
	mv "${next_file}" "${target_file}"
}

# Temporarily modify `blockera.php` with production constants defined.
# Use a temp file because `bin/generate-blockera-php.php` reads from `blockera.php`
# so we need to avoid writing to that file at the same time.
status "Generating blockera.php 📝"
php bin/generate-blockera-php.php > blockera.tmp.php
backup_and_replace "blockera.php" "blockera.tmp.php"

# Temporarily modify `readme.txt`.
# Use a temp file because `bin/generate-readme-txt.php` reads from `readme.txt`
# so we need to avoid writing to that file at the same time.
status "Generating readme.txt 📝"
php bin/generate-readme-txt.php > readme.tmp.txt
backup_and_replace "readme.txt" "readme.tmp.txt"

status "Stripping dev-only local experimental config 🧽"
strip_dev_only_local_experimental_config "config/panel.php" "config/panel.tmp.php"
backup_and_replace "config/panel.php" "config/panel.tmp.php"

ENV_FUNCTIONS_FILE="$(resolve_shared_package_file "env/php/functions.php" || true)"
if [ -z "${ENV_FUNCTIONS_FILE}" ]; then
	error "ERROR: Could not find env/php/functions.php under vendor/blockera or packages/global-packages/packages."
	exit 1
fi
status "Using env functions at ${ENV_FUNCTIONS_FILE}"
strip_dev_only_local_experimental_config "${ENV_FUNCTIONS_FILE}" "${ENV_FUNCTIONS_FILE}.tmp"
backup_and_replace "${ENV_FUNCTIONS_FILE}" "${ENV_FUNCTIONS_FILE}.tmp"

# Temporary copy some PHP files into "inc" directory.
status "Generating inc/app.php 📝"
mkdir -p "inc"
APP_PHP_FILE="$(resolve_shared_package_file "blockera/php/app.php" || true)"
if [ -z "${APP_PHP_FILE}" ]; then
	error "ERROR: Could not find blockera/php/app.php under vendor/blockera or packages/global-packages/packages."
	exit 1
fi
cp "${APP_PHP_FILE}" inc/app.php

build_files=$(
	ls dist/*/*.{min.js,min.css,asset.php} \
)

vendor_without_blockera=$(
  find ./vendor -type f -not -path "./vendor/blockera" \
);

main_plugin_file='blockera.php'

if [ -n "$MAIN_FILE_SUFFIX" ]; then
  main_plugin_file="blockera$MAIN_FILE_SUFFIX.php"
  cp blockera.php "$main_plugin_file"
fi

# Generate the plugin zip file.
status "Creating archive... 🎁"
zip -r -q blockera.zip \
  inc \
	config \
	assets \
	bootstrap \
	readme.txt \
	languages \
	$build_files \
	$main_plugin_file \
	changelog.txt \
	composer.json \
	experimental.config.json \
	$vendor_without_blockera \
  ### BEGIN AUTO-GENERATED VENDOR PACKAGES PATH PATTERN
  ### END AUTO-GENERATED VENDOR PACKAGES PATH PATTERN
  && echo "blockera.zip created successfully ✅" || echo "blockera.zip creation failed ❌"

status "Cleaning up... 🧹"
restore_zip_build_backups
trap - EXIT

# Drop generated main-file copy when a custom suffix was used.
if [ -n "${MAIN_FILE_SUFFIX:-}" ] && [ -f "${main_plugin_file}" ] && [ "${main_plugin_file}" != "blockera.php" ]; then
	rm -f "${main_plugin_file}"
fi

success "Done ✅ You've built Blockera! 🎉 "
