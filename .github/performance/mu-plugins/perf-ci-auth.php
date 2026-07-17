<?php
/**
 * CI-only helpers for Blockera performance benchmarks.
 *
 * Loaded only when wp-env maps this directory and BLOCKERA_PERF_BENCHMARK is true.
 * - Auto-authenticates as user ID 1 so admin URLs and Server-Timing headers work
 *   with stock wpp-research (no Cookie CLI flag).
 * - Enables Performance Lab Server-Timing output buffering for wp-total metrics.
 *
 * @package Blockera
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! defined( 'BLOCKERA_PERF_BENCHMARK' ) || ! BLOCKERA_PERF_BENCHMARK ) {
	return;
}

/**
 * Log in as the primary admin for every request in the perf CI environment.
 */
add_action(
	'plugins_loaded',
	static function (): void {
		if ( is_user_logged_in() ) {
			return;
		}

		wp_set_current_user( 1 );
	},
	0
);

/**
 * Enable Perf Lab template output buffering so wp-template / wp-total are emitted.
 *
 * @see https://make.wordpress.org/performance/handbook/measuring-performance/benchmarking-php-performance-with-server-timing/
 */
add_filter( 'perflab_server_timing_use_output_buffer', '__return_true' );
