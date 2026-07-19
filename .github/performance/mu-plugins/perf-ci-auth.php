<?php
/**
 * CI-only helpers for Blockera performance benchmarks.
 *
 * Loaded only when wp-env maps this directory and BLOCKERA_PERF_BENCHMARK is true.
 * - Disables core/plugin/theme update checks so outbound api.wordpress.org traffic
 *   does not pollute Server-Timing measurements.
 * Admin authentication is handled by Playwright storageState (not MU-plugin spoofing).
 * Server-Timing metrics are emitted by server-timing.php.
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
