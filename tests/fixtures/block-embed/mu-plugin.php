<?php
/**
 * Temporary mu-plugin for embed block visual snapshot tests.
 *
 * Mocks YouTube oEmbed so snapshot HTML stays stable without hitting the network.
 * This file is copied to wp-content/mu-plugins by the Playwright/PHPUnit snapshot harness.
 *
 * @phpstan-ignore-next-line
 */

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

	// Match the normalized snapshot shape (config.json also rewrites title/src as a safety net).
	return '<iframe loading="lazy" title="Video Title" width="500" height="281" src="https://example.com/video" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>';
}

add_filter( 'pre_oembed_result', 'blockera_mock_youtube_oembed_result', 5, 3 );
