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
	status "Resetting the repository to pristine condition. ✨"
	to_clean=$(git clean -xdf --dry-run)
	if [ ! -z "$to_clean" ]; then
		echo $to_clean
		warning "🚨 About to delete everything above! Is this okay? 🚨"
		echo -n "[y]es/[N]o: "
		read answer
		if [ "$answer" != "${answer#[Yy]}" ]; then
			# Remove ignored files to reset repository to pristine condition. Previous
			# test ensures that changed files abort the plugin build.
			status "Cleaning working directory... 🛀"
			git clean -xdf
		else
			error "Fair enough; aborting. Tidy up your repo and try again. 🙂"
			exit 1
		fi
	fi
fi

# Clean old and extra files
status "Cleaning build files... 🗂"
rm -r dist

# Run the build.
status "Installing dependencies... 📦"
composer install --no-dev
if [ -z "$NO_INSTALL_NPM" ]; then
  npm cache verify
  npm ci
fi

status "Generating build... 🗂"
npm run build


# Temporarily modify `blockera.php` with production constants defined.
# Use a temp file because `bin/generate-blockera-php.php` reads from `blockera.php`
# so we need to avoid writing to that file at the same time.
status "Generating blockera.php 📝"
php bin/generate-blockera-php.php > blockera.tmp.php
mv blockera.tmp.php blockera.php


# Temporarily modify `readme.txt`.
# Use a temp file because `bin/generate-readme-txt.php` reads from `readme.txt`
# so we need to avoid writing to that file at the same time.
status "Generating readme.txt 📝"
php bin/generate-readme-txt.php > readme.tmp.txt
mv readme.tmp.txt readme.txt


# Temporary copy some PHP files into "inc" directory.
status "Generating inc/app.php 📝"
mkdir -p "inc"
cp packages/blockera/php/app.php inc/app.php

build_files=$(
	ls dist/*/*.{min.js,min.css,asset.php} \
)

vendor_without_blockera=$(
  find ./vendor -type f -not -path "./vendor/blockera" \
);

# Generate the plugin zip file.
status "Creating archive... 🎁"
zip -r -q blockera.zip \
  inc \
	config \
	assets \
	readme.txt \
	languages \
	$build_files \
	blockera.php \
	changelog.txt \
	composer.json \
	experimental.config.json \
	$vendor_without_blockera \
	$(find ./vendor/blockera/blockera/ -type f \( -name "*.php" -o -name "*.json" \)) \
	$(find ./vendor/blockera/blockera-admin/ -type f \( -name "*.php" -o -name "*.json" \)) \
	$(find ./vendor/blockera/blocks/ -type f \( -name "*.php" -o -name "*.json" \)) \
  $(find ./vendor/blockera/bootstrap/ -type f \( -name "*.php" -o -name "*.json" \)) \
  $(find ./vendor/blockera/data/ -type f \( -name "*.php" -o -name "*.json" \)) \
  $(find ./vendor/blockera/data-editor/ -type f \( -name "*.php" -o -name "*.json" \)) \
  $(find ./vendor/blockera/exceptions/ -type f \( -name "*.php" -o -name "*.json" \)) \
  $(find ./vendor/blockera/http/ -type f \( -name "*.php" -o -name "*.json" \)) \
  $(find ./vendor/blockera/editor/ -type f \( -name "*.php" -o -name "*.json" \)) \
  $(find ./vendor/blockera/utils/ -type f \( -name "*.php" -o -name "*.json" \)) \
  $(find ./vendor/blockera/wordpress/ -type f \( -name "*.php" -o -name "*.json" \)) \
  && echo "blockera.zip created successfully ✅" || echo "blockera.zip creation failed ❌"

status "Cleaning up... 🧹"

# Reset `blockera.php`.
git checkout blockera.php

# Reset `readme.txt`.
git checkout readme.txt

success "Done ✅ You've built Blockera! 🎉 "
