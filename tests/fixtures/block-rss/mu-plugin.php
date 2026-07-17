<?php
/**
 * Temporary mu-plugin for RSS block testing.
 * This file is automatically loaded by WordPress on every request.
 * Intercepts RSS feed requests and returns static feed content to prevent test failures
 * due to changing feed data.
 *
 * Playwright/Cypress copy only this PHP file into WPMU_PLUGIN_DIR — feed.xml stays in the
 * fixture folder under the Blockera plugin. Path resolution must not rely on dirname( __FILE__ ).
 *
 * @phpstan-ignore-next-line
 */

/**
 * Resolve the static feed.xml path for the block-rss fixture.
 *
 * @return string Absolute path to feed.xml, or empty string when not found.
 */
function blockera_rss_fixture_feed_path() {
	// PHPUnit sets this before require so the copied mu-plugin can find sibling assets.
	if ( isset( $GLOBALS['blockera_test_mu_plugin_fixture_dir'] ) && is_string( $GLOBALS['blockera_test_mu_plugin_fixture_dir'] ) && $GLOBALS['blockera_test_mu_plugin_fixture_dir'] !== '' ) {
		$from_global = $GLOBALS['blockera_test_mu_plugin_fixture_dir'] . '/feed.xml';
		if ( file_exists( $from_global ) ) {
			return $from_global;
		}
	}

	// Visual / e2e harness: mu-plugin lives in mu-plugins/, fixture stays in the plugin tree.
	if ( defined( 'WP_PLUGIN_DIR' ) ) {
		$from_plugin = WP_PLUGIN_DIR . '/blockera/tests/fixtures/block-rss/feed.xml';
		if ( file_exists( $from_plugin ) ) {
			return $from_plugin;
		}
	}

	// Last resort when this file still lives next to feed.xml (e.g. required from the fixture dir).
	$from_local = dirname( __FILE__ ) . '/feed.xml';
	if ( file_exists( $from_local ) ) {
		return $from_local;
	}

	return '';
}

/**
 * Whether the URL is the WPBeginner feed used by the block-rss fixture.
 *
 * @param string $url Request URL.
 * @return bool
 */
function blockera_is_rss_fixture_feed_url( $url ) {
	return is_string( $url ) && strpos( $url, 'www.wpbeginner.com/feed' ) !== false;
}

/**
 * Clear any previously cached live feed so SimplePie cannot skip HTTP (and our intercept).
 *
 * @return void
 */
function blockera_clear_rss_fixture_feed_cache() {
	$urls = array(
		'https://www.wpbeginner.com/feed/',
		'https://www.wpbeginner.com/feed',
	);

	foreach ( $urls as $url ) {
		$name = md5( $url );
		delete_site_transient( 'feed_' . $name );
		delete_site_transient( 'feed_mod_' . $name );
	}
}

/**
 * Disable SimplePie cache for the fixture feed URL.
 *
 * @param SimplePie\SimplePie $feed SimplePie feed object (passed by reference via do_action_ref_array).
 * @param string|string[]     $url  Feed URL(s).
 * @return void
 */
function blockera_disable_rss_fixture_feed_cache( $feed, $url ) {
	$match = false;
	if ( is_string( $url ) ) {
		$match = blockera_is_rss_fixture_feed_url( $url );
	} elseif ( is_array( $url ) ) {
		foreach ( $url as $single ) {
			if ( blockera_is_rss_fixture_feed_url( $single ) ) {
				$match = true;
				break;
			}
		}
	}

	if ( ! $match || ! is_object( $feed ) || ! method_exists( $feed, 'enable_cache' ) ) {
		return;
	}

	$feed->enable_cache( false );
}

/**
 * Intercept HTTP requests for RSS feeds and return static content.
 * This ensures consistent test results by preventing external feed changes.
 *
 * @param false|array|WP_Error $preempt Whether to preempt an HTTP request's return value. Default false.
 * @param array                 $args    HTTP request arguments.
 * @param string                $url     The request URL.
 * @return false|array|WP_Error Modified response or false to continue with normal request.
 */
function blockera_intercept_rss_feed_request( $preempt, $args, $url ) {
	if ( ! blockera_is_rss_fixture_feed_url( $url ) ) {
		return $preempt;
	}

	$feed_file = blockera_rss_fixture_feed_path();
	if ( $feed_file === '' ) {
		return $preempt;
	}

	$feed_content = file_get_contents( $feed_file );
	if ( false === $feed_content ) {
		return $preempt;
	}

	return array(
		'headers'  => array(
			'content-type' => 'application/rss+xml; charset=UTF-8',
		),
		'body'     => $feed_content,
		'response' => array(
			'code'    => 200,
			'message' => 'OK',
		),
		'cookies'  => array(),
		'filename' => null,
	);
}

// Bust stale live-feed cache from earlier runs, then always serve fixture via HTTP intercept.
blockera_clear_rss_fixture_feed_cache();
add_action( 'wp_feed_options', 'blockera_disable_rss_fixture_feed_cache', 10, 2 );
add_filter( 'pre_http_request', 'blockera_intercept_rss_feed_request', 10, 3 );
