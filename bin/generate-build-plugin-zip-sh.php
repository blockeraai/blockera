#!/usr/bin/env php
<?php
/**
 * Generates the production (plugin build) version of `./bin/build-plugin-zip.sh`,
 * containing alternate `define` statements from the development version.
 *
 * @package blockera-build
 */

$f = fopen( dirname( __DIR__ ) . '/bin/build-plugin-zip.sh', 'r' );

$packages = array_map(
	function ( string $package_name ) {

		$core_suffix = '-core';

		$package_name = str_replace( dirname( __DIR__ ) . '/packages/', '', $package_name );

		if ( 'blocks' === $package_name ) {
			$package_name .= '-core';
		}

		return $package_name;
	},
	array_filter(
		glob( dirname( __DIR__ ) . '/packages/*' ),
		function ( string $package_name ): string {

			// filter dev tools packages.
			if ( preg_match( '/dev-(.*)/', $package_name ) ) {

				return false;
			}

			// filter invalid packages.
			if ( ! is_dir( $package_name . '/php' ) && ! is_dir( $package_name . '/core/php' ) ) {

				return false;
			}

			return true;
		}
	)
);

$internal_packages = array_filter(
	$packages,
	function ( string $package_name ): string {

		if ( preg_match( '/-sdk$/', $package_name ) ) {
			return false;
		}

		return true;
	}
);

$sdks = array_diff( $packages, $internal_packages );

$inside_pattern_block = false;

while ( true ) {
	$line = fgets( $f );
	if ( false === $line ) {
		break;
	}

	switch ( trim( $line ) ) {

		case '### END AUTO-GENERATED VENDOR PACKAGES PATH PATTERN':
			$inside_pattern_block = false;
			break;

		case '### BEGIN AUTO-GENERATED VENDOR PACKAGES PATH PATTERN':
			$inside_pattern_block = true;

			echo implode( PHP_EOL, array_map( function ( string $name ): string {
				return sprintf(
					'	$(find ./vendor/blockera/%1$s/ -type f \( -name "*.php" -o -name "*.json" \)) \\',
					$name
				);
			}, $internal_packages ) );

			echo PHP_EOL;

			echo implode(
				PHP_EOL,
				array_map( function ( string $name ): string {

					return sprintf(
						'	$(find ./vendor/blockera/%1$s/) \\',
						$name
					);
				}, $sdks )
			);

			echo PHP_EOL;

			break;

		default:
			if ( ! $inside_pattern_block ) {

				echo $line;
			}
			break;
	}
}

fclose( $f );
