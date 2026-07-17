<?php
/**
 * CI-only helpers for Blockera performance benchmarks.
 *
 * Loaded only when wp-env maps this directory and BLOCKERA_PERF_BENCHMARK is true.
 * - Auto-authenticates as user ID 1 so admin URLs and Server-Timing headers work
 *   with stock wpp-research (autocannon has no Cookie/header CLI flag).
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
 * Resolve admin (and ajax) requests as the primary admin user.
 *
 * `determine_current_user` runs when WordPress lazily initializes the current
 * user, so `is_user_logged_in()` and capability checks resolve to user 1
 * without any auth cookie being present. Gated to admin requests so front-end
 * scenarios are still measured as anonymous visitors (no admin bar / extra
 * queries), which is the realistic rendering path.
 */
add_filter(
	'determine_current_user',
	static function ( $user_id ) {
		if ( $user_id ) {
			return $user_id;
		}

		return is_admin() ? 1 : $user_id;
	},
	1
);

/**
 * Bypass the wp-admin login redirect in CI.
 *
 * `auth_redirect()` checks the auth cookie directly (not the current user), so
 * setting the current user is not enough to reach admin screens. `auth_redirect`
 * is a pluggable function; defining it here (mu-plugins load before
 * wp-includes/pluggable.php) overrides core and lets admin pages render for the
 * benchmark instead of redirecting to wp-login.php.
 */
if ( ! function_exists( 'auth_redirect' ) ) {
	/**
	 * No-op auth guard for the perf benchmark environment.
	 *
	 * @return void
	 */
	function auth_redirect() {
		if ( ! is_user_logged_in() ) {
			wp_set_current_user( 1 );
		}
	}
}

/**
 * Enable Perf Lab template output buffering so wp-template / wp-total are emitted.
 *
 * @see https://make.wordpress.org/performance/handbook/measuring-performance/benchmarking-php-performance-with-server-timing/
 */
add_filter( 'perflab_server_timing_use_output_buffer', '__return_true' );
