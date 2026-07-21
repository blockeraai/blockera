<?php
/**
 * Blockera Storage — site-scoped browser storage helpers.
 *
 * Generates a short per-blog install key so localStorage/sessionStorage keys
 * do not leak across multisite blogs or survive site reinstalls.
 *
 * @package    Blockera
 * @subpackage Storage
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! function_exists( 'blockera_generate_storage_site_key' ) ) {
	/**
	 * Generate a compact storage site key (10 hex chars).
	 *
	 * @return string
	 */
	function blockera_generate_storage_site_key(): string {
		return bin2hex( random_bytes( 5 ) );
	}
}

if ( ! function_exists( 'blockera_get_storage_site_key' ) ) {
	/**
	 * Get or create the stable storage site key for the current blog.
	 *
	 * Stored in wp_options (blog-scoped on multisite). A reinstall wipes
	 * options and yields a new key, so browser keys no longer match.
	 *
	 * @return string 10-character hex site key.
	 */
	function blockera_get_storage_site_key(): string {
		static $cached = null;

		if ( null !== $cached ) {
			return $cached;
		}

		$option_key = 'blockera_storage_site_key';
		$site_key   = get_option( $option_key, '' );

		// Accept only compact keys; rewrite legacy UUIDs to 10-char hex.
		if ( ! is_string( $site_key ) || ! preg_match( '/^[0-9a-f]{10}$/', $site_key ) ) {
			$site_key = blockera_generate_storage_site_key();

			if ( false === get_option( $option_key, false ) ) {
				add_option( $option_key, $site_key, '', 'no' );
			} else {
				update_option( $option_key, $site_key, 'no' );
			}
		}

		$cached = $site_key;

		return $cached;
	}
}

if ( ! function_exists( 'blockera_get_scoped_storage_key' ) ) {
	/**
	 * Build a site + user scoped browser storage key.
	 *
	 * Format must match JS getStorageKey(): `{baseKey}__{siteKey}_u{userId}`
	 *
	 * @param string   $base_key Logical (unscoped) storage key.
	 * @param int|null $user_id  User ID; defaults to current user.
	 * @return string Scoped storage key.
	 */
	function blockera_get_scoped_storage_key( string $base_key, ?int $user_id = null ): string {
		$site_key = blockera_get_storage_site_key();
		$user_id  = null !== $user_id ? $user_id : (int) get_current_user_id();

		return $base_key . '__' . $site_key . '_u' . $user_id;
	}
}
