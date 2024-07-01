#!/usr/bin/env php
<?php
/**
 * Generates the production (plugin build) version of `blockera.php`,
 * containing alternate `define` statements from the development version.
 *
 * @package blockera-build
 */

$f = fopen( dirname( __DIR__ ) . '/.env.example', 'r' );

$plugin_version = null;
$inside_defines = false;

/**
 * Prints `define` statements for the production version of `blockera.php`
 * (the plugin entry point).
 */
function print_production_defines() {

	global $plugin_version;

	echo "VERSION=$plugin_version";
}

$exclude_lines = [
	'WP_TESTS_DIR',
	'DB'
];

while ( true ) {
	$line = fgets( $f );

	if ( false === $line ) {
		break;
	}

	if ( preg_match( '/(' . implode( '|', $exclude_lines ) . ')=.*/', $line ) ) {

		echo '';

		continue;
	}

	if (
		! $plugin_version &&
		preg_match( '/VERSION=.*/', $line, $matches )
	) {
		echo $matches[0];

		continue;
	}

	if (empty(trim($line))){

		echo '';

		continue;
	}

	echo $line;
}

fclose( $f );
