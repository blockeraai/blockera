<?php

/**
 * Prints the changelog
 */
function print_changelog() {

	$content = file_get_contents( __DIR__ . '/../changelog.txt' );

	echo $content;
}

/**
 * Fetch current plugin version from `blockera.php` file.
 */
function get_plugin_version() {

	$content = file_get_contents( __DIR__ . '/../blockera.php' );

	if ( preg_match( '/\s*\*\s*Version:\s*([0-9.]+)/m', $content, $matches ) ) {
		return $matches[1];
	}

	return null;
}

/**
 * Fetch required PHP version from `blockera.php` file.
 */
function get_php_version() {

	$content = file_get_contents( __DIR__ . '/../blockera.php' );

	if ( preg_match( '/\s*\*\s*Requires PHP:\s*([0-9.]+)/m', $content, $matches ) ) {
		return $matches[1];
	}

	return null;
}

/**
 * Fetch required version from `blockera.php` file.
 */
function get_required_version() {

	$content = file_get_contents( __DIR__ . '/../blockera.php' );

	if ( preg_match( '/\s*\*\s*Requires at least:\s*([0-9.]+)/m', $content, $matches ) ) {
		return $matches[1];
	}

	return null;
}

/**
 * Fetch tested up to version from `blockera.php` file.
 */
function get_tested_version() {

	$content = file_get_contents( __DIR__ . '/../blockera.php' );

	if ( preg_match( '/\s*\*\s*Tested up to:\s*([0-9.]+)/m', $content, $matches ) ) {
		return $matches[1];
	}

	return null;
}

/**
 * Fetch tested up to version from `blockera.php` file.
 */
function get_short_description() {

	$content = file_get_contents( __DIR__ . '/../blockera.php' );

	if ( preg_match( '/\s*\*\s*Description:\s*(.*)/', $content, $matches ) ) {
		return $matches[1];
	}

	return null;
}