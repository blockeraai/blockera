<?php
/**
 * Cache functions.
 *
 * @package packages/data
 * @subpackage php/functions
 * @since 1.12.3
 */

if (! function_exists('blockera_init_cache')) {
	/**
	 * Initialize cache mechanism and handle version-based cache invalidation.
	 *
	 * This function checks if the plugin version has changed and invalidates
	 * the cache accordingly. It uses the Version class to manage versioning.
	 * 
	 * @param array $params The parameters for the cache instance. Default is empty array.
	 *
	 * @since 1.12.3
	 *
	 * @return bool True if cache is valid, false if cache was invalidated.
	 */
	function blockera_init_cache( array $params = []): bool {
		// Use the new invalidateIfVersionChanged method which handles everything.
		return ! blockera_get_cache($params)->invalidateIfVersionChanged( BLOCKERA_SB_VERSION );
	}
}

if (! function_exists('blockera_get_cache')) {
	/**
	 * Get the Blockera version cache instance.
	 * 
	 * @param array $params The parameters for the cache instance. Default is empty array.
	 *
	 * @since 1.12.3
	 *
	 * @return \Blockera\Data\Cache\Version The version cache instance.
	 */
	function blockera_get_cache( array $params = []): \Blockera\Data\Cache\Version {
		static $version_cache = null;

		// Fallback parameters.
		if (empty($params)) {
			$params = [ 'product_id' => 'blockera' ];
		}
		
		if ( null === $version_cache ) {
			$version_cache = new \Blockera\Data\Cache\Version( $params );
		}

		return $version_cache;
	}
}
