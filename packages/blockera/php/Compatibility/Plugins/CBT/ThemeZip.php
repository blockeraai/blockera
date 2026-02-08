<?php

namespace Blockera\Setup\Compatibility\Plugins\CBT;

use Blockera\Setup\Compatibility\JSONResolver;

/**
 * Theme Zip compatibility class for Create Block Theme plugin.
 * 
 * Extends CBT_Theme_Zip to provide Blockera-compatible implementations
 * with support for generating block style variation files.
 *
 * @package Blockera\Setup\Compatibility\Plugins\CBT
 */
class ThemeZip extends \CBT_Theme_Zip {

	/**
	 * Add block style variation files to ZIP archive.
	 * 
	 * Generates block style variation files for variations defined in theme.json
	 * but missing from the theme's styles/blocks directory structure.
	 *
	 * @param \CBT_Zip_Archive $zip              ZIP archive instance.
	 * @param string           $theme_json_string Theme.json as JSON string.
	 * @return \CBT_Zip_Archive ZIP archive instance.
	 */
	public static function add_block_style_variations_to_zip( $zip, $theme_json_string ) {
		$theme_json = json_decode( $theme_json_string, true );

		if ( ! is_array( $theme_json ) || ! isset( $theme_json['styles']['blocks'] ) ) {
			return $zip;
		}

		$blocks = $theme_json['styles']['blocks'] ?? array();

		foreach ( $blocks as $block_type => $block_data ) {
			if ( ! isset( $block_data['variations'] ) || ! is_array( $block_data['variations'] ) ) {
				continue;
			}

			$variations_dir = 'styles/blocks';

			foreach ( $block_data['variations'] as $variation_name => $variation_data ) {
				// Check if variation file already exists in theme.
				$variation_file_path        = get_stylesheet_directory() . "/styles/blocks/{$variation_name}.json";
				$parent_variation_file_path = get_template_directory() . "/styles/blocks/{$variation_name}.json";

				// Skip if file already exists.
				if ( file_exists( $variation_file_path ) || file_exists( $parent_variation_file_path ) ) {
					continue;
				}

				// Prepare variation data for file.
				$variation_file_data = static::prepare_block_variation_file_data( $variation_data, $block_type, $variation_name );

				// Add variation file to ZIP.
				$variation_json = JSONResolver::stringify( $variation_file_data );
				$zip->addFromStringToTheme(
					"{$variations_dir}/{$variation_name}.json",
					$variation_json
				);
			}
		}

		return $zip;
	}

	/**
	 * Prepare block style variation data for file export.
	 *
	 * @param array  $variation_data Variation data from theme.json.
	 * @param string $block_type     Block type (e.g., 'core/button').
	 * @param string $variation_name Variation name.
	 * @return array Prepared variation data for file.
	 */
	private static function prepare_block_variation_file_data( $variation_data, $block_type, $variation_name ) {
		// Get schema version.
		global $wp_version;
		$theme_json_version = 'wp/' . substr( $wp_version, 0, 3 );
		if ( defined( 'IS_GUTENBERG_PLUGIN' ) ) {
			$theme_json_version = 'trunk';
		}
		$schema = 'https://schemas.wp.org/' . $theme_json_version . '/theme.json';

		// Prepare variation file structure.
		$variation_file = array(
			'$schema' => $schema,
			'title'   => static::generate_variation_title( $variation_name ),
			'slug' => $variation_name,
			'version' => 3,
			'blockTypes' => array( $block_type ),
			'styles'  => array(),
		);

		// Extract styles for this variation.
		if ( ! empty( $variation_data ) ) {
			$variation_file['styles'] = $variation_data;
		}

		return $variation_file;
	}

	/**
	 * Generate a human-readable title for a variation.
	 *
	 * @param string $variation_name Variation name.
	 * @return string Formatted title.
	 */
	private static function generate_variation_title( $variation_name ) {
		// Convert kebab-case or snake_case to Title Case.
		$title = str_replace( array( '-', '_' ), ' ', $variation_name );
		$title = ucwords( $title );
		return $title;
	}
}
