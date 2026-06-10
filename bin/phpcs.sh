#!/usr/bin/env sh
# WPCS 2.x triggers Internal.Exception on PHP 8.4+ when deprecations are reported.
exec php -d error_reporting=24575 "$(dirname "$0")/../vendor/bin/phpcs" "$@"
