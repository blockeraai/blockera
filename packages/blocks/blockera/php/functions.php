<?php

if (! function_exists('blockera_enqueue_blocks_editor_styles')) {
	/**
	 * Enqueue the blockera blocks editor styles.
	 * 
	 * @param string $base_url The base url of the plugin.
	 * @param string $version The version of the plugin.
	 *
	 * @return void
	 */
	function blockera_enqueue_blocks_editor_styles( string $base_url, string $version) {

		wp_enqueue_style(
			'blockera-blocks-editor-styles',
			$base_url . 'blockera/blocks-blockera/php/blockera-editor-general-styles.css',
			[],
			$version
		);
	}
}
