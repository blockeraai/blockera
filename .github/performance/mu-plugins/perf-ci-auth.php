<?php
/**
 * CI-only helpers for Blockera performance benchmarks.
 *
 * Loaded only when wp-env maps this directory and BLOCKERA_PERF_BENCHMARK is true.
 * - Auto-authenticates as user ID 1 so admin URLs and Server-Timing headers work
 *   with stock wpp-research (autocannon has no Cookie/header CLI flag).
 * - Enables Performance Lab Server-Timing output buffering for wp-total metrics.
 * - Disables core/plugin/theme update checks so outbound api.wordpress.org traffic
 *   does not pollute Server-Timing measurements.
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

/**
 * Expose Blockera active state on every response so warm-up can assert the web
 * container matches the intended with/without-plugin phase.
 *
 * Uses the active_plugins option (not is_plugin_active) so this works on
 * front-end and admin without loading wp-admin includes. Sent on `init` because
 * `wp_headers` does not run for all wp-admin screens.
 *
 * @return void
 */
add_action(
	'init',
	static function () {
		if ( headers_sent() ) {
			return;
		}

		$active = (array) get_option( 'active_plugins', array() );
		$value  = in_array( 'blockera/blockera.php', $active, true ) ? '1' : '0';
		header( 'X-Blockera-Perf-Active: ' . $value, false );
	},
	1
);

/**
 * Stub a "freshly checked, no updates" site transient so WordPress skips the
 * HTTP round-trip to api.wordpress.org during benchmark requests.
 *
 * Returning null/false from pre_site_transient_* can still force a check;
 * a last_checked timestamp within the refresh window prevents that.
 *
 * @return object
 */
function blockera_perf_stub_update_transient() {
	$stub               = new stdClass();
	$stub->last_checked = time();
	$stub->checked      = array();
	$stub->response     = array();
	$stub->translations = array();
	$stub->no_update    = array();
	// Core uses ->updates; plugins/themes use ->response. Both stay empty.
	$stub->updates = array();
	if ( isset( $GLOBALS['wp_version'] ) ) {
		$stub->version_checked = $GLOBALS['wp_version'];
	}

	return $stub;
}

add_filter( 'pre_site_transient_update_core', 'blockera_perf_stub_update_transient' );
add_filter( 'pre_site_transient_update_plugins', 'blockera_perf_stub_update_transient' );
add_filter( 'pre_site_transient_update_themes', 'blockera_perf_stub_update_transient' );

add_filter( 'automatic_updater_disabled', '__return_true' );

/**
 * Drop scheduled/admin update-check callbacks once hooks are registered.
 *
 * @return void
 */
add_action(
	'init',
	static function () {
		remove_action( 'init', 'wp_schedule_update_checks' );
		remove_action( 'wp_version_check', 'wp_version_check' );
		remove_action( 'wp_update_plugins', 'wp_update_plugins' );
		remove_action( 'wp_update_themes', 'wp_update_themes' );
		remove_action( 'admin_init', '_maybe_update_core' );
		remove_action( 'admin_init', '_maybe_update_plugins' );
		remove_action( 'admin_init', '_maybe_update_themes' );
	},
	0
);

/**
 * Short-circuit remaining outbound update-check HTTP as a safety net.
 *
 * @param false|array|WP_Error $pre  Preemptive return value.
 * @param array                $args Request arguments.
 * @param string               $url  Request URL.
 * @return false|array|WP_Error
 */
add_filter(
	'pre_http_request',
	static function ( $pre, $args, $url ) {
		if ( ! is_string( $url ) ) {
			return $pre;
		}

		$needles = array(
			'api.wordpress.org/core/version-check',
			'api.wordpress.org/plugins/update-check',
			'api.wordpress.org/themes/update-check',
			'api.wordpress.org/translations/core',
			'api.wordpress.org/translations/plugins',
			'api.wordpress.org/translations/themes',
		);

		foreach ( $needles as $needle ) {
			if ( false !== strpos( $url, $needle ) ) {
				return array(
					'headers'  => array(),
					'body'     => '',
					'response' => array(
						'code'    => 200,
						'message' => 'OK',
					),
					'cookies'  => array(),
					'filename' => null,
				);
			}
		}

		return $pre;
	},
	10,
	3
);
