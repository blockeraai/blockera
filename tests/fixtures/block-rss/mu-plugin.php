<?php
/**
 * Temporary mu-plugin for RSS block testing.
 * This file is automatically loaded by WordPress on every request.
 * Intercepts RSS feed requests and returns static feed content to prevent test failures
 * due to changing feed data.
 *
 * @phpstan-ignore-next-line
 */

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
	// Only intercept requests to the wpbeginner.com feed URL used in tests.
	if ( ! is_string( $url ) || strpos( $url, 'www.wpbeginner.com/feed' ) === false ) {
		return $preempt;
	}

	// When PHPUnit copies this file into WPMU_PLUGIN_DIR, __FILE__ points at mu-plugins/, not
	// tests/fixtures/{design}/ — helpers sets $GLOBALS['blockera_test_mu_plugin_fixture_dir'] before require.
	$fixture_dir = '';
	if ( isset( $GLOBALS['blockera_test_mu_plugin_fixture_dir'] ) && is_string( $GLOBALS['blockera_test_mu_plugin_fixture_dir'] ) && $GLOBALS['blockera_test_mu_plugin_fixture_dir'] !== '' ) {
		$fixture_dir = $GLOBALS['blockera_test_mu_plugin_fixture_dir'];
	}
	if ( $fixture_dir === '' ) {
		$fixture_dir = dirname( __FILE__ );
	}
	$feed_file = $fixture_dir . '/feed.xml';

	// Check if the static feed file exists.
	if ( ! file_exists( $feed_file ) ) {
		return $preempt;
	}

	// Read the static feed content.
	$feed_content = file_get_contents( $feed_file );
	if ( false === $feed_content ) {
		return $preempt;
	}

	// Return a successful HTTP response with the static feed content.
	return array(
		'headers'  => array(
			'content-type' => 'application/rss+xml; charset=UTF-8',
		),
		'body'     => $feed_content,
		'response' => array(
			'code'    => 200,
			'message' => 'OK',
		),
		'cookies'   => array(),
		'filename' => null,
	);
}

// Hook into pre_http_request to intercept RSS feed requests.
add_filter( 'pre_http_request', 'blockera_intercept_rss_feed_request', 10, 3 );
