<?php

namespace Blockera\Setup\Compatibility\Plugins\CBT;

use Blockera\Setup\Compatibility\JSONResolver;
use Blockera\Setup\Http\Controllers\Theme\GlobalStylesController;

/**
 * Theme Styles compatibility class for Create Block Theme plugin.
 * 
 * Provides Blockera-compatible implementations for theme style operations.
 *
 * @package Blockera\Setup\Compatibility\Plugins\CBT.
 */
class ThemeStyles {

	/**
	 * Update a style CSS file with given values.
	 *
	 * @param string $style_css The current style.css content.
	 * @param array  $theme     Theme data array.
	 * @return string Updated style.css content.
	 */
	public static function update_style_css( $style_css, $theme ) {
		$style_data = get_file_data(
			get_stylesheet_directory() . '/style.css',
			array(
				'License'    => 'License',
				'LicenseURI' => 'License URI',
			)
		);

		$current_theme = wp_get_theme();
		$css_contents  = trim( substr( $style_css, strpos( $style_css, '*/' ) + 2 ) );
		$name          = stripslashes( $theme['name'] );
		$description   = stripslashes( $theme['description'] );
		$uri           = $theme['uri'];
		$author        = stripslashes( $theme['author'] );
		$author_uri    = $theme['author_uri'];
		$wp_version    = static::get_current_wordpress_version();
		$requires_wp   = ( '' === $theme['requires_wp'] ) ? static::get_current_wordpress_version() : $theme['requires_wp'];
		$version       = $theme['version'];
		$requires_php  = $current_theme->get( 'RequiresPHP' );
		$text_domain   = $theme['slug'];
		$template      = $current_theme->get( 'Template' ) ? "\n" . 'Template: ' . $current_theme->get( 'Template' ) : '';
		$license       = $style_data['License'] ? $style_data['License'] : 'GNU General Public License v2 or later';
		$license_uri   = $style_data['LicenseURI'] ? $style_data['LicenseURI'] : 'http://www.gnu.org/licenses/gpl-2.0.html';
		$tags          = static::theme_tags_list( $theme );
		$css_contents  = $css_contents ? "\n\n" . $css_contents : '';
		$copyright     = '';
		preg_match( '/^\s*\n((?s).*?)\*\/\s*$/m', $style_css, $matches );
		if ( isset( $matches[1] ) ) {
			$copyright = "\n" . $matches[1];
		}

		return "/*
Theme Name: {$name}
Theme URI: {$uri}
Author: {$author}
Author URI: {$author_uri}
Description: {$description}
Requires at least: {$requires_wp}
Tested up to: {$wp_version}
Requires PHP: {$requires_php}
Version: {$version}
License: {$license}
License URI: {$license_uri}{$template}
Text Domain: {$text_domain}
Tags: {$tags}
{$copyright}*/{$css_contents}
";
	}

	/**
	 * Clear all user styles customizations.
	 * 
	 * Uses Blockera's JSONResolver and GlobalStylesController for compatibility.
	 */
	public static function clear_user_styles_customizations() {
		// Get user global styles post ID using JSONResolver.
		$user_custom_post_type_id = JSONResolver::get_user_global_styles_post_id();
		
		if ( ! $user_custom_post_type_id ) {
			return;
		}

		// Use Blockera's GlobalStylesController for updating.
		$global_styles_controller = new GlobalStylesController();
		$update_request           = new \WP_REST_Request( 'PUT', '/wp/v2/global-styles/' );
		$update_request->set_param( 'id', $user_custom_post_type_id );
		$update_request->set_param( 'settings', array() );
		$update_request->set_param( 'styles', array() );
		$global_styles_controller->update_item( $update_request );
		
		// Clear transients.
		delete_transient( 'global_styles' );
		delete_transient( 'global_styles_' . get_stylesheet() );
		delete_transient( 'gutenberg_global_styles' );
		delete_transient( 'gutenberg_global_styles_' . get_stylesheet() );
		
		// Clear Blockera's cached data.
		JSONResolver::clean_cached_data();
	}

	/**
	 * Build theme tags list for style.css.
	 *
	 * @param array $theme Theme data.
	 * @return string Comma-separated list of tags.
	 */
	private static function theme_tags_list( $theme ) {
		$checkbox_tags_merged = array_merge(
			$theme['tags-subject'] ?? array(),
			$theme['tags-layout'] ?? array(),
			$theme['tags-features'] ?? array(),
		);
		$custom_tags          = array_map( 'trim', explode( ',', $theme['tags_custom'] ?? '' ) );
		$tags                 = array_unique( array_merge( $checkbox_tags_merged, $custom_tags ) );

		return implode( ', ', $tags );
	}

	/**
	 * Get current WordPress version.
	 *
	 * @return string WordPress version.
	 */
	private static function get_current_wordpress_version() {
		global $wp_version;
		return $wp_version;
	}
}
