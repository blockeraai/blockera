<?php

namespace Blockera\Setup\Compatibility\Plugins\CBT;

/**
 * Theme Templates compatibility class for Create Block Theme plugin.
 * 
 * Provides Blockera-compatible implementations for template operations.
 *
 * @package Blockera\Setup\Compatibility\Plugins\CBT
 */
class ThemeTemplates {

	/**
	 * Copy the templates and template-parts (including user customizations)
	 * as well as any media to the theme filesystem.
	 *
	 * @param string $export_type The type of export to perform. 'all', 'current', or 'user'.
	 * @param string $path        The path to the theme folder. If null it is assumed to be the current theme.
	 * @param string $slug        The slug of the theme. If null it is assumed to be the current theme.
	 * @param array  $options     An array of options to use when exporting the templates.
	 * @param array  $templates_to_export List of specific templates to export. If null it will be fetched.
	 * @return void
	 */
	public static function add_templates_to_local( $export_type, $path = null, $slug = null, $options = null, $templates_to_export = null ) {
		// Use CBT's implementation for template operations as it handles complex template processing.
		// This maintains compatibility with CBT's template handling while using Blockera for JSON operations.
		if ( class_exists( '\CBT_Theme_Templates' ) ) {
			\CBT_Theme_Templates::add_templates_to_local( $export_type, $path, $slug, $options, $templates_to_export );
		}
	}

	/**
	 * Clear all user templates customizations.
	 * This will remove all user templates from the database.
	 */
	public static function clear_user_templates_customizations() {
		$templates = get_block_templates();
		foreach ( $templates as $template ) {
			if ( 'custom' !== $template->source ) {
				continue;
			}
			wp_delete_post( $template->wp_id, true );
		}
	}

	/**
	 * Clear all user template-parts customizations.
	 * This will remove all user template-parts from the database.
	 */
	public static function clear_user_template_parts_customizations() {
		$template_parts = get_block_templates( array(), 'wp_template_part' );
		foreach ( $template_parts as $template ) {
			if ( 'custom' !== $template->source ) {
				continue;
			}
			wp_delete_post( $template->wp_id, true );
		}
	}
}
