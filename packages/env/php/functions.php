<?php

/**
 * The blockera/env package utils functions.
 *
 * @package packages/env/php/functions.php
 */

if ( ! function_exists( 'blockera_get_experimental' ) ) {

	/**
	 * Get the blockera experimental support configuration.
	 *
	 * @param array $support_path the array of paths to access support configuration.
	 *
	 * @return mixed the value of experimental support.
	 */
	function blockera_get_experimental( array $support_path ): mixed {

		$experimental_config_file = dirname( __DIR__, 3 ) . '/experimental.config.json';

		if ( ! file_exists( $experimental_config_file ) ) {

			return false;
		}

		ob_start();

		include $experimental_config_file;

		$experimental_config = json_decode( ob_get_clean(), true );

		return \Blockera\DataEditor\Utility::arrayGet( $experimental_config, $support_path, false );
	}
}
