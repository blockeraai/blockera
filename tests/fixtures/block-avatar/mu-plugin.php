<?php
/**
 * Temporary mu-plugin for avatar block visual snapshot tests.
 * For user email hello@blockera.ai, replaces the Gravatar URL with a local
 * JPEG fixture so snapshots do not depend on secure.gravatar.com.
 *
 * This file is copied to wp-content/mu-plugins by the Playwright snapshot harness.
 *
 * @phpstan-ignore-next-line
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/** Relative path from the Blockera plugin root to the avatar JPEG fixture. */
if ( ! function_exists( 'blockera_test_block_avatar_fixture_rel_path' ) ) {
	function blockera_test_block_avatar_fixture_rel_path() {
		return 'packages/dev-cypress/js/fixtures/bg-extension-test.png';
	}
}

/**
 * Resolve an email from the value passed to get_avatar_data().
 *
 * @param mixed $id_or_email User ID, email string, WP_User, or comment-like object.
 * @return string Email or empty string.
 */
if ( ! function_exists( 'blockera_test_block_avatar_resolve_email' ) ) {
	function blockera_test_block_avatar_resolve_email( $id_or_email ) {
		if ( is_numeric( $id_or_email ) ) {
			$user = get_user_by( 'id', (int) $id_or_email );

			return $user ? (string) $user->user_email : '';
		}

		if ( is_string( $id_or_email ) && is_email( $id_or_email ) ) {
			return $id_or_email;
		}

		if ( is_object( $id_or_email ) ) {
			if ( isset( $id_or_email->user_email ) && is_string( $id_or_email->user_email ) ) {
				return $id_or_email->user_email;
			}
			// WP_Comment: core get_avatar_data() uses user_id before comment_author_email; comments
			// created with only user_id (e.g. Playwright setup.js) have empty comment_author_email.
			if ( isset( $id_or_email->user_id ) && (int) $id_or_email->user_id > 0 ) {
				$user = get_user_by( 'id', (int) $id_or_email->user_id );

				return $user ? (string) $user->user_email : '';
			}
			if ( isset( $id_or_email->comment_author_email ) && is_string( $id_or_email->comment_author_email ) ) {
				return $id_or_email->comment_author_email;
			}
		}

		return '';
	}
}

/**
 * Use the local fixture image instead of Gravatar for the test email.
 *
 * @param array $args        Avatar arguments including url, found, size.
 * @param mixed $id_or_email Same as get_avatar_data().
 * @return array
 */
if ( ! function_exists( 'blockera_test_block_avatar_filter_data' ) ) {
	function blockera_test_block_avatar_filter_data( $args, $id_or_email ) {
		$email = strtolower( trim( blockera_test_block_avatar_resolve_email( $id_or_email ) ) );
		if ( '' === $email || 'hello@blockera.ai' !== $email ) {
			return $args;
		}

		$rel  = blockera_test_block_avatar_fixture_rel_path();
		$root = WP_PLUGIN_DIR . '/blockera/';
		$file = $root . $rel;

		if ( ! is_readable( $file ) ) {
			return $args;
		}

		$plugin_file   = WP_PLUGIN_DIR . '/blockera/blockera.php';
		$args['url']   = plugins_url( $rel, $plugin_file );
		$args['found'] = true;

		return $args;
	}
}

if ( ! has_filter( 'get_avatar_data', 'blockera_test_block_avatar_filter_data' ) ) {
	add_filter( 'get_avatar_data', 'blockera_test_block_avatar_filter_data', 10, 2 );
}
