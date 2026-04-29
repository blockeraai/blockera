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
	function blockera_get_experimental( array $support_path ) {
		static $blockera_experimental_config_cache = null;

		if ( null === $blockera_experimental_config_cache ) {
			$plugin_root              = dirname( __DIR__, 3 );
			$experimental_config_file = $plugin_root . '/experimental.config.json';

			### BEGIN DEV-ONLY LOCAL EXPERIMENTAL CONFIG
			if ( defined( 'BLOCKERA_SB_MODE' ) && 'development' === BLOCKERA_SB_MODE ) {
				$local_experimental_config_file = $plugin_root . '/local.experimental.config.json';

				if ( is_readable( $local_experimental_config_file ) ) {
					$experimental_config_file = $local_experimental_config_file;
				} elseif ( ! is_readable( $experimental_config_file ) ) {
					$blockera_experimental_config_cache = false;
					return false;
				}
			}
			### END DEV-ONLY LOCAL EXPERIMENTAL CONFIG

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
