#!/usr/bin/env php
<?php
/**
 * Generates the production (plugin build) version of `readme.txt`,
 * containing the final changes to readme file from the development version.
 *
 * @package blockera-build
 */

$f = fopen( dirname( __DIR__ ) . '/readme.txt', 'r' );

$plugin_version = get_plugin_version();
$php_version = get_php_version();
$tested_version = get_tested_version();
$required_version = get_required_version();

/**
 * Prints the changelog
 */
function print_changelog() {

	$content = file_get_contents(__DIR__ . '/../changelog.txt');

	echo $content;
}

/**
 * Fetch current plugin version from `blockera.php` file.
 */
function get_plugin_version(){
	
	$content = file_get_contents(__DIR__ . '/../blockera.php');

	if (preg_match( '/\s*\*\s*Version:\s*([0-9.]+)/m', $content, $matches )) {
		return $matches[1];
	}

	return null;
}

/**
 * Fetch required PHP version from `blockera.php` file.
 */
function get_php_version(){
	
	$content = file_get_contents(__DIR__ . '/../blockera.php');

	if (preg_match( '/\s*\*\s*Requires PHP:\s*([0-9.]+)/m', $content, $matches )) {
		return $matches[1];
	}

	return null;
}

/**
 * Fetch required version from `blockera.php` file.
 */
function get_required_version(){
	
	$content = file_get_contents(__DIR__ . '/../blockera.php');

	if (preg_match( '/\s*\*\s*Requires at least:\s*([0-9.]+)/m', $content, $matches )) {
		return $matches[1];
	}

	return null;
}

/**
 * Fetch tested up to version from `blockera.php` file.
 */
function get_tested_version(){
	
	$content = file_get_contents(__DIR__ . '/../blockera.php');

	if (preg_match( '/\s*\*\s*Tested up to:\s*([0-9.]+)/m', $content, $matches )) {
		return $matches[1];
	}

	return null;
}

$skip_line = false;

while ( true ) {
	$line = fgets( $f );

	if ( false === $line ) {
		break;
	}

	switch ( trim( $line ) ) {

		case '### AUTO-GENERATED CHANGELOG':
			echo print_changelog();
			break;

		case str_starts_with(trim( $line ), 'Stable tag:'):
			echo "Stable tag: $plugin_version\n";
			break;

		case str_starts_with(trim( $line ), 'Requires PHP:'):
			echo "Requires PHP: $php_version\n";
			break;

		case str_starts_with(trim( $line ), 'Tested up to:'):
			echo "Tested up to: $tested_version\n";
			break;

		case str_starts_with(trim( $line ), 'Requires at least:'):
			echo "Requires at least: $required_version\n";
			break;

		case '':
		default:
			echo $line;
			break;
	}
}

fclose( $f );
