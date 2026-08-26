<?php
/**
 * Temporary mu-plugin for latest-comments block visual snapshot tests.
 * Replaces every Gravatar URL with the local Blockera logo PNG fixture so
 * editor/frontend screenshots do not depend on secure.gravatar.com.
 * Uses the filled PNG (not the outline SVG) so avatar width/height/border
 * styles still paint a solid square like a real gravatar.
 *
 * This file is loaded via a stub in wp-content/mu-plugins by the Playwright/PHPUnit harness.
 *
 * @phpstan-ignore-next-line
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/** Relative path from the Blockera plugin root to the avatar logo fixture. */
if ( ! function_exists( 'blockera_test_block_latest_comments_avatar_fixture_rel_path' ) ) {
	function blockera_test_block_latest_comments_avatar_fixture_rel_path() {
		return 'packages/global-packages/packages/dev-cypress/js/fixtures/bg-extension-test.png';
	}
}

/**
 * Resolve the absolute filesystem path of the avatar fixture.
 *
 * @return string Absolute path, or empty string when unreadable.
 */
if ( ! function_exists( 'blockera_test_block_latest_comments_avatar_fixture_abs_path' ) ) {
	function blockera_test_block_latest_comments_avatar_fixture_abs_path() {
		static $cached = null;

		if ( null !== $cached ) {
			return $cached;
		}

		$rel  = blockera_test_block_latest_comments_avatar_fixture_rel_path();
		$file = WP_PLUGIN_DIR . '/blockera/' . $rel;
		$cached = is_readable( $file ) ? $file : '';

		return $cached;
	}
}

/**
 * Public URL for the local Blockera logo avatar fixture.
 *
 * @return string
 */
if ( ! function_exists( 'blockera_test_block_latest_comments_avatar_fixture_url' ) ) {
	function blockera_test_block_latest_comments_avatar_fixture_url() {
		static $url = null;

		if ( null !== $url ) {
			return $url;
		}

		if ( '' === blockera_test_block_latest_comments_avatar_fixture_abs_path() ) {
			$url = '';

			return $url;
		}

		$rel         = blockera_test_block_latest_comments_avatar_fixture_rel_path();
		$plugin_file = WP_PLUGIN_DIR . '/blockera/blockera.php';
		$url         = plugins_url( $rel, $plugin_file );

		return $url;
	}
}

/**
 * Force comment avatars to the local Blockera logo for this fixture run.
 *
 * Email-agnostic on purpose: Latest Comments can surface the default Hello World
 * commenter (or other site comments), and Gravatar pixels are not screenshot-stable.
 *
 * @param array $args        Avatar arguments including url, found, size.
 * @param mixed $id_or_email Same as get_avatar_data().
 * @return array
 */
if ( ! function_exists( 'blockera_test_block_latest_comments_avatar_filter_data' ) ) {
	function blockera_test_block_latest_comments_avatar_filter_data( $args, $id_or_email ) { // phpcs:ignore Generic.CodeAnalysis.UnusedFunctionParameter
		$fixture_url = blockera_test_block_latest_comments_avatar_fixture_url();
		if ( '' === $fixture_url ) {
			return $args;
		}

		$args['url']   = $fixture_url;
		$args['found'] = true;

		return $args;
	}
}

if ( ! has_filter( 'get_avatar_data', 'blockera_test_block_latest_comments_avatar_filter_data' ) ) {
	add_filter( 'get_avatar_data', 'blockera_test_block_latest_comments_avatar_filter_data', 10, 2 );
}
