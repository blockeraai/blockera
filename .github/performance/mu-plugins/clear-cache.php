<?php
/**
 * CI-only cache clear endpoint for performance iterations.
 *
 * Adapted from WordPress core tests/performance/wp-content/mu-plugins/clear-cache.php
 *
 * @package Blockera
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! defined( 'BLOCKERA_PERF_BENCHMARK' ) || ! BLOCKERA_PERF_BENCHMARK ) {
	return;
}

add_action(
	'plugins_loaded',
	static function () {
		if ( ! isset( $_GET['clear_cache'] ) ) { // phpcs:ignore WordPress.Security.NonceVerification.Recommended
			return;
		}

		if ( function_exists( 'opcache_reset' ) ) {
			opcache_reset();
		}

		if ( function_exists( 'apcu_clear_cache' ) ) {
			apcu_clear_cache();
		}

		wp_cache_flush();

		delete_expired_transients( true );

		clearstatcache( true );

		status_header( 202 );

		die;
	},
	1
);
