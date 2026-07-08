#!/usr/bin/env bash
# Production build used by compressed-size-action for PR/base comparison.
set -euo pipefail

composer install --no-dev -o --apcu-autoloader -a

php ./bin/generate-build-plugin-zip-sh.php > ./bin/build-plugin-zip.temp.sh
chmod +x ./bin/build-plugin-zip.temp.sh

NO_CHECKS='true' \
NO_INSTALL_NPM='true' \
NO_INSTALL_COMPOSER='true' \
./bin/build-plugin-zip.temp.sh

rm -rf ./bin/build-plugin-zip.temp.sh
