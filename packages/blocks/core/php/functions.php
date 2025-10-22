<?php

if ( ! function_exists( 'blockera_get_available_blocks' ) ) {
	/**
	 * Retrieve available blocks in blockera editor.
	 *
	 * @return array the available blocks stack.
	 */
	function blockera_get_available_blocks(): array {

		$available_blocks = [];
		$config_files     = glob( blockera_core_config( 'app.vendor_path' ) . 'blockera/blocks-core/js/*-blocks-list.json' );

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
