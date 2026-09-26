#!/usr/bin/env php
<?php
/**
 * Generates the production (plugin build) version of `./bin/build-plugin-zip.sh`.
 *
 * GP vendor paths come from composer.json `require` (`blockera/*`), not every
 * package directory on disk after a submodule bump.
 *
 * @package blockera-build
 */

$root   = dirname( __DIR__ );
$helper = __DIR__ . '/declared-vendor-packages.php';

if ( ! is_readable( $helper ) ) {
	$helper = $root . '/packages/global-packages/packages/dev-tools/php/Zip/DeclaredVendorPackages.php';
}

require_once $helper;

$f = fopen( $root . '/bin/build-plugin-zip.sh', 'r' );

$split              = \Blockera\DevTools\Zip\DeclaredVendorPackages::partition(
	\Blockera\DevTools\Zip\DeclaredVendorPackages::fromComposerRequire( $root )
);
$internal_packages = $split['internal'];
$sdks               = $split['sdks'];

$inside_pattern_block      = false;
$inside_third_party_block = false;

while ( true ) {
	$line = fgets( $f );
	if ( false === $line ) {
		break;
	}

	switch ( trim( $line ) ) {

		case '### END AUTO-GENERATED THIRD-PARTY VENDOR PATH PATTERN':
			$inside_third_party_block = false;
			break;

		case '### BEGIN AUTO-GENERATED THIRD-PARTY VENDOR PATH PATTERN':
			$inside_third_party_block = true;
			echo implode( PHP_EOL, \Blockera\DevTools\Zip\DeclaredVendorPackages::thirdPartyZipPathLines( $root ) ) . PHP_EOL;
			break;

		case '### END AUTO-GENERATED VENDOR PACKAGES PATH PATTERN':
			$inside_pattern_block = false;
			break;

		case '### BEGIN AUTO-GENERATED VENDOR PACKAGES PATH PATTERN':
			$inside_pattern_block = true;

			$zip_paths = array();

			foreach ( $internal_packages as $name ) {
				$zip_paths[] = sprintf(
					'	$(find ./vendor/blockera/%1$s/ -type f ! -path "*/tests/*" \( -name "*.php" -o -name "*.json" -o -name "*.css" \)) \\',
					$name
				);
			}

			foreach ( $sdks as $name ) {
				$zip_paths[] = sprintf(
					'	$(find ./vendor/blockera/%1$s/ ! -path "*/tests/*") \\',
					$name
				);
			}

			if ( empty( $zip_paths ) ) {
				$zip_paths[] = '	$(true) \\';
			}

			echo implode( PHP_EOL, $zip_paths ) . PHP_EOL;

			break;

		default:
			if ( ! $inside_pattern_block && ! $inside_third_party_block ) {
				echo $line;
			}
			break;
	}
}

fclose( $f );
