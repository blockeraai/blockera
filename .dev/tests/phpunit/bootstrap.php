<?php
/**
 * PHPUnit bootstrap file
 *
 * @package PublisherCore
 */

$root_dir = dirname( __DIR__, 3 );

// Require dependencies.
require_once $root_dir . '/vendor/wp-phpunit/wp-phpunit/__loaded.php';
require_once $root_dir . '/vendor/yoast/phpunit-polyfills/phpunitpolyfills-autoload.php';

// If we're running in WP's build directory, ensure that WP knows that, too.
if ( 'build' === getenv( 'LOCAL_DIR' ) ) {
	define( 'WP_RUN_CORE_TESTS', true );
}

define( 'PB_CORE_URI', '' );
define( 'PB_CORE_PATH', $root_dir );
define( 'PB_CORE_VERSION', '' );

// Determine the tests directory (from a WP dev checkout).
// Try the WP_TESTS_DIR environment variable first.
$_tests_dir = getenv( 'WP_TESTS_DIR' );

// Next, try the WP_PHPUNIT composer package if we're inside wp-env.
if ( ! $_tests_dir && 'tests-mysql' === getenv( 'WORDPRESS_DB_HOST' ) ) {
	$_tests_dir = getenv( 'WP_PHPUNIT__DIR' );
}

// Fallback.
if ( ! $_tests_dir ) {
	$_tests_dir = rtrim( sys_get_temp_dir(), '/\\' ) . '/wordpress-tests-lib';
}

if ( ! file_exists( $_tests_dir . '/includes/functions.php' ) ) {
	echo "Could not find $_tests_dir/includes/functions.php, have you run .dev/bin/install-wp-tests.sh ?" . PHP_EOL; // WPCS: XSS ok.
	exit( 1 );
}

// Give access to tests_add_filter() function.
require_once $_tests_dir . '/includes/functions.php';

/**
 * Manually load the plugin being tested.
 */
//function _manually_load_plugin() {

//}
//tests_add_filter( 'muplugins_loaded', '_manually_load_plugin' );

// Start up the WP testing environment.
require $_tests_dir . '/includes/bootstrap.php';