<?php

if ( ! function_exists( 'blockera_get_available_blocks' ) ) {
	/**
	 * Retrieve available blocks in blockera editor.
	 *
	 * @return array the available blocks stack.
	 */
	function blockera_get_available_blocks(): array {

		$available_blocks = [];
		$config_files     = glob( blockera_core_config( 'app.vendor_path' ) . 'blockera/blocks-core/js/**/*-blocks-list.json' );

		foreach ( $config_files as $config_file ) {

			ob_start();

			require $config_file;

			$config = json_decode( ob_get_clean(), true );

			if ( empty( $config['supported'] ) ) {

				continue;
			}

			$available_blocks = array_merge(
				$available_blocks,
				array_map(
					function ( array $support ): string {

						return $support['name'];
					},
					$config['supported']
				)
			);
		}

		return $available_blocks;
	}
}

if ( ! function_exists( 'blockera_get_shared_block_attributes' ) ) {
	/**
	 * Get blockera shared block attributes.
	 *
	 * @return array the shared block attributes.
	 */
	function blockera_get_shared_block_attributes(): array {

		return blockera_load( 'shared.attributes', __DIR__ );
	}
}

if (! function_exists('blockera_enqueue_blocks_editor_styles')) {
	/**
	 * Enqueue the blockera blocks editor styles assets.
	 * 
	 * @param string $base_path The base path of the plugin.
	 * @param string $base_url The base url of the plugin.
	 * @param string $version The version of the plugin.
	 *
	 * @return void
	 */
	function blockera_enqueue_blocks_editor_styles( string $base_path, string $base_url, string $version) {

		$blocks = glob($base_path . 'block-*', GLOB_ONLYDIR);

		foreach ($blocks as $block_path) {

			$block_name = basename($block_path);

			$editor_styles = glob($block_path . '/src/editor-styles.css');

			if (empty($editor_styles)) {

				$editor_styles = glob($block_path . '/php/editor-styles.css');

				if (empty($editor_styles)) {

					continue;
				}
			}

			wp_enqueue_style(
				'blockera-block-' . $block_name . '-editor-styles',
				$base_url . $block_name . '/src/editor-styles.css',
				[],
				$version
			);
		}
	}
}
