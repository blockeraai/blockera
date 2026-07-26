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
			$blockera_experimental_config_file = BLOCKERA_SB_PATH . 'experimental.config.json';

			### BEGIN DEV-ONLY LOCAL EXPERIMENTAL CONFIG
			if ( defined( 'BLOCKERA_SB_MODE' ) && 'development' === BLOCKERA_SB_MODE ) {
				$blockera_local_experimental_config_file = BLOCKERA_SB_PATH . 'local.experimental.config.json';

				if ( is_readable( $blockera_local_experimental_config_file ) ) {
					$blockera_experimental_config_file = $blockera_local_experimental_config_file;
				} elseif ( ! is_readable( $blockera_experimental_config_file ) ) {
					$blockera_experimental_config_cache = false;
					return false;
				}
			}
			### END DEV-ONLY LOCAL EXPERIMENTAL CONFIG

			if ( ! is_readable( $blockera_experimental_config_file ) ) {
				$blockera_experimental_config_cache = false;
			} else {
				ob_start();
				include $blockera_experimental_config_file;
				$blockera_experimental_config_cache = json_decode( ob_get_clean(), true );

				if ( ! is_array( $blockera_experimental_config_cache ) ) {
					$blockera_experimental_config_cache = false;
				}
			}
		}

		if ( false === $blockera_experimental_config_cache ) {
			return false;
		}

		return \Blockera\DataEditor\Utility::arrayGet( $blockera_experimental_config_cache, $support_path, false );
	}
}
