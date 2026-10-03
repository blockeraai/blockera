<?php
/**
 * Temporary mu-plugin for embed block visual snapshot tests.
 *
 * Mocks YouTube oEmbed so snapshot HTML stays stable without hitting the network.
 * Serves a static iframe document from embed-video.html instead of example.com.
 * This file is copied to wp-content/mu-plugins by the Playwright/PHPUnit snapshot harness.
 *
 * @phpstan-ignore-next-line
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Query argument used to serve the static embed iframe fixture.
 */
if ( ! defined( 'BLOCKERA_TEST_EMBED_VIDEO_QUERY_VAR' ) ) {
	define( 'BLOCKERA_TEST_EMBED_VIDEO_QUERY_VAR', 'blockera_test_embed_video' );
}

/**
 * Absolute path to the static embed iframe HTML fixture.
 *
 * @return string
 */
function blockera_test_embed_video_fixture_path() {
	$fixture_dir = isset( $GLOBALS['blockera_test_mu_plugin_fixture_dir'] )
		? (string) $GLOBALS['blockera_test_mu_plugin_fixture_dir']
		: '';

	if ( '' === $fixture_dir ) {
		return '';
	}

	$file = trailingslashit( $fixture_dir ) . 'embed-video.html';

	return is_readable( $file ) ? $file : '';
}

/**
 * Public URL for the static embed iframe fixture.
 *
 * @return string
 */
function blockera_test_embed_video_fixture_url() {
	return home_url( '/?' . BLOCKERA_TEST_EMBED_VIDEO_QUERY_VAR . '=1' );
}

/**
 * Serve the static embed iframe HTML fixture.
 *
 * @return void
 */
function blockera_test_serve_embed_video_fixture() {
	if ( ! isset( $_GET[ BLOCKERA_TEST_EMBED_VIDEO_QUERY_VAR ] ) ) {
		return;
	}

	$file = blockera_test_embed_video_fixture_path();
	if ( '' === $file ) {
		status_header( 404 );
		exit;
	}

	header( 'Content-Type: text/html; charset=utf-8' );
	header( 'X-Robots-Tag: noindex, nofollow', true );

	// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- static fixture file contents.
	echo file_get_contents( $file );
	exit;
}

add_action( 'template_redirect', 'blockera_test_serve_embed_video_fixture', 0 );

/**
 * Return a stable iframe for YouTube URLs used in the block-embed fixture.
 *
 * @param null|string     $result The oEmbed HTML result. Default null.
 * @param string          $url    The URL being fetched.
 * @param string|array    $args   Additional arguments for oEmbed.
 * @return null|string Mock iframe HTML for YouTube, otherwise $result.
 */
function blockera_mock_youtube_oembed_result( $result, $url, $args ) {
	if ( ! is_string( $url ) ) {
		return $result;
	}

	if ( false === strpos( $url, 'youtube.com' ) && false === strpos( $url, 'youtu.be' ) ) {
		return $result;
	}

	$src = esc_url( blockera_test_embed_video_fixture_url() );

	// Match the normalized snapshot shape (config.json also rewrites title/src as a safety net).
	return '<iframe loading="lazy" title="Video Title" width="500" height="281" src="' . $src . '" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>';
}

add_filter( 'pre_oembed_result', 'blockera_mock_youtube_oembed_result', 5, 3 );
