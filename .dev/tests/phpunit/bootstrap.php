<?php
/**
 * PHPUnit bootstrap file
 *
 * @package PublisherCore
 */

$root_dir = dirname( __DIR__, 3 );

require 'config.php';

// Require dependencies.
require_once $root_dir . '/vendor/wp-phpunit/wp-phpunit/__loaded.php';
require_once $root_dir . '/vendor/yoast/phpunit-polyfills/phpunitpolyfills-autoload.php';

// If we're running in WP's build directory, ensure that WP knows that, too.
if ( 'build' === getenv( 'LOCAL_DIR' ) ) {
	define( 'WP_RUN_CORE_TESTS', true );
}

// Determine the tests directory (from a WP dev checkout).
// Try the WP_TESTS_DIR environment variable first.
$_tests_dir = pb_core_env( 'WP_TESTS_DIR' ) ?? getenv( 'WP_TESTS_DIR' );

// Next, try the WP_PHPUNIT composer package if we're inside wp-env.
if ( ! $_tests_dir && 'tests-mysql' === getenv( 'WORDPRESS_DB_HOST' ) ) {
	$_tests_dir = getenv( 'WP_PHPUNIT__DIR' );
}

// Fallback.
if ( ! $_tests_dir ) {
	$_tests_dir = rtrim( sys_get_temp_dir(), '/\\' ) . '/wordpress-tests-lib';
}

if ( ! file_exists( $_tests_dir . '/includes/functions.php' ) ) {
	echo "Could not find $_tests_dir/includes/functions.php, have you run bin/install-wp-tests.sh ?" . PHP_EOL; // WPCS: XSS ok.
	exit( 1 );
}

// Give access to tests_add_filter() function.
require_once $_tests_dir . '/includes/functions.php';

tests_add_filter( 'muplugins_loaded', function () use ( $root_dir ) {
	
	define( 'PB_CORE_PATH', $root_dir );
	define( '__PB_TEST_DIR__', __DIR__ );
	define( 'PB_CORE_VERSION', pb_core_env( 'PB_CORE_VERSION' ) ?? getenv( 'PB_CORE_VERSION' ) );
	define( 'PB_CORE_URI', plugins_url( pb_core_env( 'PUBLISHER_DIR' ) ?? getenv( '__PUBLISHER_DIR__' ) ) );
} );

// Start up the WP testing environment.
require $_tests_dir . '/includes/bootstrap.php';
