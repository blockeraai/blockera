<?php

namespace Blockera\Setup\Compatibility\Plugins\CBT;

use Blockera\Setup\Compatibility\JSONResolver;

/**
 * Theme Create compatibility class for Create Block Theme plugin.
 * 
 * Provides Blockera-compatible implementations for theme creation operations.
 *
 * @package Blockera\Setup\Compatibility\Plugins\CBT
 */
class ThemeCreate {

	const ALLOWED_SCREENSHOT_TYPES = array(
		'png' => 'image/png',
	);

	/**
	 * Create a child theme.
	 *
	 * @param array $theme      Theme data array.
	 * @param array $screenshot Screenshot file data (optional).
	 * @return void|\WP_Error
	 */
	public static function create_child_theme( $theme, $screenshot ) {
		// Create theme directory.
		$new_theme_path = get_theme_root() . DIRECTORY_SEPARATOR . $theme['slug'];

		if ( file_exists( $new_theme_path ) ) {
			return new \WP_Error( 'theme_already_exists', __( 'Theme already exists.', 'blockera' ) );
		}

		wp_mkdir_p( $new_theme_path );

		// Add readme.txt.
		if ( class_exists( '\CBT_Theme_Readme' ) ) {
			file_put_contents(
				$new_theme_path . DIRECTORY_SEPARATOR . 'readme.txt',
				\CBT_Theme_Readme::create( $theme )
			);
		}

		// Add style.css.
		$theme['template'] = wp_get_theme()->get( 'TextDomain' );
		$css_contents      = static::build_style_css( $theme );
		file_put_contents(
			$new_theme_path . DIRECTORY_SEPARATOR . 'style.css',
			$css_contents
		);

		// Add templates using Blockera's ThemeTemplates.
		ThemeTemplates::add_templates_to_local( 'user', $new_theme_path, $theme['slug'] );
		
		// Add theme.json using Blockera's JSONResolver.
		file_put_contents(
			$new_theme_path . DIRECTORY_SEPARATOR . 'theme.json',
			JSONResolver::export_theme_data( 'variation' )
		);

		// Add Screenshot.
		if ( static::is_valid_screenshot( $screenshot ) ) {
			file_put_contents(
				$new_theme_path . DIRECTORY_SEPARATOR . 'screenshot.png',
				file_get_contents( $screenshot['tmp_name'] )
			);
		} else {
			// Try to copy from CBT plugin assets if available.
			$source = '';
			if ( defined( 'WP_PLUGIN_DIR' ) ) {
				$source = WP_PLUGIN_DIR . 'create-block-theme/assets/boilerplate/screenshot.png';
			} elseif ( class_exists( '\CBT_Theme_Create' ) ) {
				// Fallback: try to get from CBT plugin directory.
				$reflection = new \ReflectionClass( '\CBT_Theme_Create' );
				$plugin_dir = dirname( dirname( $reflection->getFileName() ) );
				$source     = $plugin_dir . '/assets/boilerplate/screenshot.png';
			}
			
			if ( $source && file_exists( $source ) ) {
				copy( $source, $new_theme_path . DIRECTORY_SEPARATOR . 'screenshot.png' );
			}
		}

		switch_theme( $theme['slug'] );
	}

	/**
	 * Clone current theme.
	 *
	 * @param array $theme Theme data array.
	 * @return void|\WP_Error
	 */
	public static function clone_current_theme( $theme ) {
		// Default values for cloned themes.
		$theme['is_cloned_theme'] = true;
		$theme['version']         = '1.0';
		$theme['tags_custom']     = implode( ', ', wp_get_theme()->get( 'Tags' ) );

		// Create theme directory.
		$new_theme_path = get_theme_root() . DIRECTORY_SEPARATOR . $theme['slug'];

		if ( file_exists( $new_theme_path ) ) {
			return new \WP_Error( 'theme_already_exists', __( 'Theme already exists.', 'blockera' ) );
		}

		wp_mkdir_p( $new_theme_path );

		// Persist font settings for cloned theme (using CBT class as it's CBT-specific).
		if ( class_exists( '\CBT_Theme_Fonts' ) ) {
			\CBT_Theme_Fonts::persist_font_settings();
		}

		// Copy theme files using CBT_Theme_Utils (CBT-specific functionality).
		if ( class_exists( '\CBT_Theme_Utils' ) ) {
			\CBT_Theme_Utils::clone_theme_to_folder( $new_theme_path, $theme['slug'], $theme['name'] );
		}

		// Copy templates using Blockera's ThemeTemplates.
		$template_options = array(
			'localizeText'   => false,
			'removeNavRefs'  => false,
			'localizeImages' => false,
		);
		ThemeTemplates::add_templates_to_local( 'all', $new_theme_path, $theme['slug'], $template_options );
		
		// Add theme.json using Blockera's JSONResolver.
		file_put_contents(
			path_join( $new_theme_path, 'theme.json' ),
			JSONResolver::export_theme_data( 'all' )
		);

		// Add readme.txt.
		if ( class_exists( '\CBT_Theme_Readme' ) ) {
			file_put_contents(
				path_join( $new_theme_path, 'readme.txt' ),
				\CBT_Theme_Readme::create( $theme )
			);
		}

		// Update style.css using Blockera's ThemeStyles.
		$style_css_path = path_join( $new_theme_path, 'style.css' );
		if ( file_exists( $style_css_path ) ) {
			$style_css = file_get_contents( $style_css_path );
			$style_css = ThemeStyles::update_style_css( $style_css, $theme );
			file_put_contents( $style_css_path, $style_css );
		}

		switch_theme( $theme['slug'] );
	}

	/**
	 * Create blank theme.
	 *
	 * @param array $theme      Theme data array.
	 * @param array $screenshot Screenshot file data (optional).
	 * @return void|\WP_Error
	 */
	public static function create_blank_theme( $theme, $screenshot ) {
		// Get boilerplate source path.
		$source = '';
		if ( defined( 'WP_PLUGIN_DIR' ) ) {
			$source = WP_PLUGIN_DIR . 'create-block-theme/assets/boilerplate';
		} elseif ( class_exists( '\CBT_Theme_Create' ) ) {
			// Fallback: try to get from CBT plugin directory.
			$reflection = new \ReflectionClass( '\CBT_Theme_Create' );
			$plugin_dir = dirname( dirname( $reflection->getFileName() ) );
			$source     = $plugin_dir . '/assets/boilerplate';
		}

		if ( ! $source || ! file_exists( $source ) ) {
			return new \WP_Error( 'boilerplate_not_found', __( 'Boilerplate files not found.', 'blockera' ) );
		}

		$blank_theme_path = get_theme_root() . DIRECTORY_SEPARATOR . $theme['slug'];

		if ( file_exists( $blank_theme_path ) ) {
			return new \WP_Error( 'theme_already_exists', __( 'Theme already exists.', 'blockera' ) );
		}

		wp_mkdir_p( $blank_theme_path );

		// Add readme.txt.
		if ( class_exists( '\CBT_Theme_Readme' ) ) {
			file_put_contents(
				$blank_theme_path . DIRECTORY_SEPARATOR . 'readme.txt',
				\CBT_Theme_Readme::create( $theme )
			);
		}

		// Add new metadata.
		$css_contents = static::build_style_css( $theme );

		// Add style.css.
		file_put_contents(
			$blank_theme_path . DIRECTORY_SEPARATOR . 'style.css',
			$css_contents
		);

		// Copy boilerplate files.
		$iterator = new \RecursiveIteratorIterator(
			new \RecursiveDirectoryIterator( $source, \RecursiveDirectoryIterator::SKIP_DOTS ),
			\RecursiveIteratorIterator::SELF_FIRST
		);

		foreach ( $iterator as $item ) {
			if ( $item->isDir() ) {
				wp_mkdir_p( $blank_theme_path . DIRECTORY_SEPARATOR . $iterator->getSubPathname() );
			} else {
				copy( $item, $blank_theme_path . DIRECTORY_SEPARATOR . $iterator->getSubPathname() );
			}
		}

		// Overwrite default screenshot if one is provided.
		if ( static::is_valid_screenshot( $screenshot ) ) {
			file_put_contents(
				$blank_theme_path . DIRECTORY_SEPARATOR . 'screenshot.png',
				file_get_contents( $screenshot['tmp_name'] )
			);
		}

		// Update theme.json schema version if needed.
		$theme_json_path = $blank_theme_path . DIRECTORY_SEPARATOR . 'theme.json';
		if ( file_exists( $theme_json_path ) && ! defined( 'IS_GUTENBERG_PLUGIN' ) ) {
			global $wp_version;
			$theme_json_version = 'wp/' . substr( $wp_version, 0, 3 );
			$schema             = '"$schema": "https://schemas.wp.org/' . $theme_json_version . '/theme.json"';
			$theme_json_string  = file_get_contents( $theme_json_path );
			$theme_json_string  = str_replace( '"$schema": "https://schemas.wp.org/trunk/theme.json"', $schema, $theme_json_string );
			file_put_contents( $theme_json_path, $theme_json_string );
		}

		switch_theme( $theme['slug'] );
	}

	/**
	 * Build a style.css file for themes.
	 *
	 * @param array $theme Theme data array.
	 * @return string Style.css content.
	 */
	private static function build_style_css( $theme ) {
		$name        = stripslashes( $theme['name'] );
		$description = stripslashes( $theme['description'] );
		$uri         = $theme['uri'];
		$author      = stripslashes( $theme['author'] );
		$author_uri  = $theme['author_uri'];
		$requires_wp = ( '' === $theme['requires_wp'] ) ? static::get_current_wordpress_version() : $theme['requires_wp'];
		$wp_version  = static::get_current_wordpress_version();
		$text_domain = sanitize_title( $name );
		$template    = isset( $theme['template'] ) ? $theme['template'] : '';
		$version     = isset( $theme['version'] ) ? $theme['version'] : '1.0';
		$tags        = static::theme_tags_list( $theme );

		$style_css = "/*
Theme Name: {$name}
Theme URI: {$uri}
Author: {$author}
Author URI: {$author_uri}
Description: {$description}
Requires at least: {$requires_wp}
Tested up to: {$wp_version}
Requires PHP: 5.7
Version: {$version}
License: GNU General Public License v2 or later
License URI: http://www.gnu.org/licenses/gpl-2.0.html
";

		if ( ! empty( $template ) ) {
			$style_css .= "Template: {$template}\n";
		}

		$style_css .= "Text Domain: {$text_domain}
Tags: {$tags}
*/

";

		return $style_css;
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

	/**
	 * Check if screenshot is valid.
	 *
	 * @param array $file Screenshot file data.
	 * @return bool True if valid, false otherwise.
	 */
	private static function is_valid_screenshot( $file ) {
		if ( ! $file ) {
			return false;
		}
		$filetype = wp_check_filetype( $file['name'], self::ALLOWED_SCREENSHOT_TYPES );
		if ( is_uploaded_file( $file['tmp_name'] ) && in_array( $filetype['type'], self::ALLOWED_SCREENSHOT_TYPES, true ) && $file['size'] < 2097152 ) {
			return true;
		}
		return false;
	}
}
