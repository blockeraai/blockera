<?php

use Blockera\Feature\Icon\IconStyleDefinition;

if (! function_exists('blockera_icon_style_definitions')) {
	/**
	 * Add icon style definition to the editor style definitions.
	 *
	 * @return void
	 */
	function blockera_add_icon_style_definitions(): void {
		add_filter(
			'blockera.editor.style.definitions',
			function( $styleDefinitions) {
				$styleDefinitions['IconStyleDefinition'] = IconStyleDefinition::class;

				return $styleDefinitions;
			},
			10
		);
	}
}

if (! function_exists('blockera_add_icon_block_supports')) {
	/**
     * Filter the block supports.
     *
     * @param array $supports The block supports.
     *
     * @return array The filtered block supports.
     */
	function blockera_add_icon_block_supports( array $supports = []): array {
		ob_start();

		include __DIR__ . '/icon-block-supports-list.json';

		$supports['icon'] = json_decode(ob_get_clean(), true);

		return $supports;
	}
}

if ( ! function_exists( 'blockera_register_core_icon_navigation_hooks' ) ) {
	/**
	 * Register core/icon navigation listable and render context hooks.
	 *
	 * @return void
	 */
	function blockera_register_core_icon_navigation_hooks(): void {
		blockera_core_icon_register_navigation_hooks();
	}
}
