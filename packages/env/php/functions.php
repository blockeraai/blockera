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
	 * @param array  $support_path the array of paths to access support configuration.
	 * @param string $plugin_slug the plugin slug.
	 *
	 * @return mixed the value of experimental support.
	 */
	function blockera_get_experimental( array $support_path, string $plugin_slug = 'blockera' ) {
		static $blockera_experimental_config_cache = null;

		if ( null === $blockera_experimental_config_cache ) {
			$experimental_config_file = WP_PLUGIN_DIR . '/' . $plugin_slug . '/experimental.config.json';

			if ( ! file_exists( $experimental_config_file ) ) {
				
				$blockera_experimental_config_cache = false;
				return false;
			}

			ob_start();
			include $experimental_config_file;
			$blockera_experimental_config_cache = json_decode( ob_get_clean(), true );
		}

		if ( false === $blockera_experimental_config_cache ) {
			return false;
		}

		return \Blockera\DataEditor\Utility::arrayGet( $blockera_experimental_config_cache, $support_path, false );
	}
}
