<?php
/**
 * PHPUnit bootstrap file
 *
 * @package .dev/tests/phpunit/bootstrap.php
 */

$root_dir = dirname(__DIR__, 3);

require 'config.php';

// Require dependencies.
require_once $root_dir . '/vendor/wp-phpunit/wp-phpunit/__loaded.php';
require_once $root_dir . '/vendor/yoast/phpunit-polyfills/phpunitpolyfills-autoload.php';

// If we're running in WP's build directory, ensure that WP knows that, too.
if ('build' === getenv('LOCAL_DIR')) {
    define('WP_RUN_CORE_TESTS', true);
}

// Determine the tests directory (from a WP dev checkout).
// Try the WP_TESTS_DIR environment variable first.
$_tests_dir = $_ENV['WP_TESTS_DIR'] ?? getenv('WP_TESTS_DIR');

// Next, try the WP_PHPUNIT composer package if we're inside wp-env.
if (! $_tests_dir && 'tests-mysql' === getenv('WORDPRESS_DB_HOST')) {
    $_tests_dir = getenv('WP_PHPUNIT__DIR');
}

// Fallback.
if (! $_tests_dir) {
    $_tests_dir = rtrim(sys_get_temp_dir(), '/\\') . '/wordpress-tests-lib';
}

if (! file_exists($_tests_dir . '/includes/functions.php')) {
    echo "Could not find $_tests_dir/includes/functions.php, have you run bin/install-wp-tests.sh ?" . PHP_EOL; // WPCS: XSS ok.
	/* @debug-ignore */
    exit(1);
}

// Give access to tests_add_filter() function.
require_once $_tests_dir . '/includes/functions.php';

// Snapshot tests copy fixture MU-plugins into wp-content/mu-plugins.
// If a previous run crashed early, stale MU-plugin files can remain and fatally redeclare helpers
// before the test harness has a chance to update them. Clean them up before WP bootstraps.
if ( 'tests-mysql' === getenv( 'WORDPRESS_DB_HOST' ) ) {
	$mu_plugin_dirs = [];

	$env_mu_dir = getenv( 'WPMU_PLUGIN_DIR' );
	if ( is_string( $env_mu_dir ) && '' !== $env_mu_dir ) {
		$mu_plugin_dirs[] = rtrim( $env_mu_dir, "/\\\n\r\t " );
	}

	// Default wp-env location.
	$mu_plugin_dirs[] = '/var/www/html/wp-content/mu-plugins';

	foreach ( $mu_plugin_dirs as $dir ) {
		if ( ! is_dir( $dir ) ) {
			continue;
		}

		foreach ( glob( $dir . '/blockera-test-*.php', GLOB_NOSORT ) ?: [] as $file ) {
			if ( is_file( $file ) ) {
				@unlink( $file );
			}
		}
	}
}

tests_add_filter('muplugins_loaded', function () use ($root_dir) {

	define( '__PACKAGES_DIR__', dirname( __DIR__, 2 ) );
	define( 'BLOCKERA_DEVELOPMENT', true );

	include trailingslashit($root_dir) . 'tests/phpunit/bootstrap.php';
} );

// Start up the WP testing environment.
require $_tests_dir . '/includes/bootstrap.php';
