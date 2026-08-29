<?php
/**
 * Temporary mu-plugin for comments block visual snapshot tests.
 * Replaces every Gravatar URL with a local PNG fixture so editor/frontend
 * screenshots (and canvas iframe `load`) do not depend on secure.gravatar.com.
 *
 * This file is copied to wp-content/mu-plugins by the Playwright snapshot harness.
 *
 * @phpstan-ignore-next-line
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/** Relative path from the Blockera plugin root to the avatar JPEG fixture. */
if ( ! function_exists( 'blockera_test_block_comments_avatar_fixture_rel_path' ) ) {
	function blockera_test_block_comments_avatar_fixture_rel_path() {
		return 'packages/global-packages/packages/dev-cypress/js/fixtures/bg-extension-test.png';
	}
}

/**
 * Public URL for the local avatar fixture.
 *
 * @return string Empty when the file is unreadable.
 */
if ( ! function_exists( 'blockera_test_block_comments_avatar_fixture_url' ) ) {
	function blockera_test_block_comments_avatar_fixture_url() {
		static $url = null;

		if ( null !== $url ) {
			return $url;
		}

		$rel  = blockera_test_block_comments_avatar_fixture_rel_path();
		$file = WP_PLUGIN_DIR . '/blockera/' . $rel;

		if ( ! is_readable( $file ) ) {
			$url = '';

			return $url;
		}

		$plugin_file = WP_PLUGIN_DIR . '/blockera/blockera.php';
		$url         = plugins_url( $rel, $plugin_file );

		return $url;
	}
}

/**
 * Use the local fixture image instead of Gravatar for every avatar.
 *
 * Email-agnostic: comments created with only user_id, admin bar avatars, and
 * canvas iframe images must not hit secure.gravatar.com (pending requests
 * prevent the editor canvas blob iframe from firing `load`).
 *
 * @param array $args        Avatar arguments including url, found, size.
 * @param mixed $id_or_email Same as get_avatar_data().
 * @return array
 */
if ( ! function_exists( 'blockera_test_block_comments_avatar_filter_data' ) ) {
	function blockera_test_block_comments_avatar_filter_data( $args, $id_or_email ) { // phpcs:ignore Generic.CodeAnalysis.UnusedFunctionParameter
		$fixture_url = blockera_test_block_comments_avatar_fixture_url();
		if ( '' === $fixture_url ) {
			return $args;
		}

		$args['url']   = $fixture_url;
		$args['found'] = true;

		return $args;
	}
}

if ( ! has_filter( 'get_avatar_data', 'blockera_test_block_comments_avatar_filter_data' ) ) {
	add_filter( 'get_avatar_data', 'blockera_test_block_comments_avatar_filter_data', 10, 2 );
}
