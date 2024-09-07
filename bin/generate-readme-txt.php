#!/usr/bin/env php
<?php
/**
 * Generates the production (plugin build) version of `readme.txt`,
 * containing the final changes to readme file from the development version.
 *
 * @package blockera-build
 */

require_once __DIR__ . '/plugin-helpers.php';

$f = fopen( dirname( __DIR__ ) . '/readme.txt', 'r' );

$plugin_version   = get_plugin_version();
$php_version      = get_php_version();
$tested_version   = get_tested_version();
$required_version = get_required_version();
$short_desc       = get_short_description();

$skip_line = false;

if ( ! function_exists( 'str_starts_with' ) ) {
	/**
	 * Polyfill for `str_starts_with()` function added in PHP 8.0.
	 *
	 * Performs a case-sensitive check indicating if
	 * the haystack begins with needle.
	 *
	 * @param string $haystack The string to search in.
	 * @param string $needle   The substring to search for in the `$haystack`.
	 *
	 * @return bool True if `$haystack` starts with `$needle`, otherwise false.
	 */
	function str_starts_with( $haystack, $needle ) {

		if ( '' === $needle ) {
			return true;
		}

		return 0 === strpos( $haystack, $needle );
	}
}

while ( true ) {
	$line = fgets( $f );

	if ( false === $line ) {
		break;
	}

	switch ( trim( $line ) ) {

		// All strings starts with an empty string
		case '':
		case "\n":
			echo $line;
			break;

		case '### AUTO-GENERATED CHANGELOG':
			print_changelog();
			break;

		case str_starts_with( trim( $line ), 'Stable tag:' ):
			echo "Stable tag: $plugin_version\n";
			break;

		case str_starts_with( trim( $line ), 'Requires PHP:' ):
			echo "Requires PHP: $php_version\n";
			break;

		case str_starts_with( trim( $line ), 'Tested up to:' ):
			echo "Tested up to: $tested_version\n";
			break;

		case str_starts_with( trim( $line ), 'Requires at least:' ):
			echo "Requires at least: $required_version\n";
			break;

		case str_starts_with( trim( $line ), 'Short Description:' ):
			echo "$short_desc\n";
			break;

		default:
			echo $line;
			break;
	}
}

fclose( $f );
