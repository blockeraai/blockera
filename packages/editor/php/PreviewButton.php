<?php

namespace Blockera\Editor;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Preview Button Handler for Blockera.
 *
 * Handles the in-editor preview functionality including:
 * - Hiding the admin bar when previewing in iframe.
 *
 * @package Blockera
 * @since 2.0.0
 */
class PreviewButton {

	/**
	 * Query argument used to identify preview requests that should hide the admin bar.
	 *
	 * @var string
	 */
	const HIDE_ADMIN_BAR_ARG = 'blockera-hide-admin-bar';

	/**
	 * Constructor - Initialize hooks.
	 */
	public function __construct() {
		// Hide admin bar when preview arg is present.
		add_filter( 'show_admin_bar', array( $this, 'maybe_hide_admin_bar' ) );

		// Also hide via body class for extra safety.
		add_filter( 'body_class', array( $this, 'add_preview_body_class' ) );

		// Add inline CSS to ensure admin bar is hidden.
		add_action( 'wp_head', array( $this, 'hide_admin_bar_styles' ), 100 );
	}

	/**
	 * Check if the current request is a Blockera preview iframe request.
	 *
	 * @return bool True if this is a preview request that should hide the admin bar.
	 */
	public function is_preview_iframe_request() {
		// phpcs:ignore WordPress.Security.NonceVerification.Recommended -- This is a display-only check.
		return isset( $_GET[ self::HIDE_ADMIN_BAR_ARG ] ) && '1' === $_GET[ self::HIDE_ADMIN_BAR_ARG ];
	}

	/**
	 * Filter callback to hide the admin bar for preview iframe requests.
	 *
	 * @param bool $show_admin_bar Whether to show the admin bar.
	 * @return bool False if this is a preview request, original value otherwise.
	 */
	public function maybe_hide_admin_bar( $show_admin_bar ) {
		if ( $this->is_preview_iframe_request() ) {
			return false;
		}

		return $show_admin_bar;
	}

	/**
	 * Add a body class when viewing in preview iframe.
	 *
	 * @param array $classes Array of body classes.
	 * @return array Modified array of body classes.
	 */
	public function add_preview_body_class( $classes ) {
		if ( $this->is_preview_iframe_request() ) {
			$classes[] = 'blockera-preview-iframe';
		}

		return $classes;
	}

	/**
	 * Output inline CSS to hide admin bar elements for preview iframe.
	 * This is a fallback in case the filter doesn't work in some edge cases.
	 */
	public function hide_admin_bar_styles() {
		if ( ! $this->is_preview_iframe_request() ) {
			return;
		}

		?>
		<style id="blockera-preview-hide-admin-bar">
			#wpadminbar,
			html.wp-toolbar {
				display: none !important;
				margin-top: 0 !important;
				padding-top: 0 !important;
			}
			html {
				margin-top: 0 !important;
			}
			body.admin-bar {
				margin-top: 0 !important;
				padding-top: 0 !important;
			}
		</style>
		<?php
	}
}
