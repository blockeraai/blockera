<?php

namespace Blockera\Data\Cache;

use Blockera\Bootstrap\Application;

/**
 * Cache class for managing post meta, options, and transient caching.
 * 
 * This class provides separated methods for each cache type:
 * - Post Meta: For per-post cached data (stored in wp_postmeta).
 * - Options: For global cached data without expiration (stored in wp_options).
 * - Transients: For global cached data with expiration (uses WP transient API).
 */
class Cache {

	/**
	 * The product id.
	 *
	 * @var string
	 */
	protected string $product_id;

	/**
	 * Cache key prefix (computed once).
	 *
	 * @var string
	 */
	protected string $cache_prefix;

	/**
	 * Cache constructor.
	 *
	 * @param array $args The arguments.
	 *
	 * @throws \Exception Exception for any occurred errors.
	 */
	public function __construct( array $args = [] ) {
		if ( ! isset( $args['product_id'] ) ) {
			throw new \Exception( __( 'Product ID is required on Cache class constructor', 'blockera' ) );
		}

		if ( ! is_string( $args['product_id'] ) ) {
			throw new \Exception( __( 'Invalid product ID format: expected string value on Cache class constructor', 'blockera' ) );
		}

		$this->product_id   = $args['product_id'];
		$this->cache_prefix = 'blockera_' . $this->product_id . '_product_data_';
	}

	/**
	 * Get the prefix key for the cache.
	 *
	 * @param string $key The key.
	 *
	 * @return string
	 */
	public function getCacheKey( string $key = '' ): string {
		return $this->cache_prefix . $key;
	}

	// =========================================================================
	// POST META CACHE METHODS
	// =========================================================================

	/**
	 * Set cache in post meta.
	 *
	 * @param int    $post_id The post ID (required, must be > 0).
	 * @param string $key     The cache key.
	 * @param mixed  $cache   The cache data.
	 *
	 * @throws \Exception Exception for invalid arguments.
	 *
	 * @return bool True on success, false on failure.
	 */
	public function setMetaCache( int $post_id, string $key, $cache ): bool {
		if ( $post_id <= 0 ) {
			throw new \Exception( __( 'Valid post ID is required for meta cache', 'blockera' ) );
		}

		if ( '' === $key ) {
			throw new \Exception( __( 'Key is required on setMetaCache method', 'blockera' ) );
		}

		// update_post_meta returns int|bool; cast to bool for consistency.
		return (bool) update_post_meta( $post_id, $this->getCacheKey( $key ), $cache );
	}

	/**
	 * Get cache from post meta.
	 *
	 * @param int    $post_id The post ID.
	 * @param string $key     The cache key.
	 *
	 * @return mixed The cached data or empty string if not found.
	 */
	public function getMetaCache( int $post_id, string $key ) {
		if ( $post_id <= 0 ) {
			return '';
		}

		return get_post_meta( $post_id, $this->getCacheKey( $key ), true );
	}

	/**
	 * Delete cache from post meta.
	 *
	 * @param int    $post_id The post ID.
	 * @param string $key     The cache key.
	 *
	 * @return bool True on success, false on failure.
	 */
	public function deleteMetaCache( int $post_id, string $key ): bool {
		if ( $post_id <= 0 ) {
			return false;
		}

		return delete_post_meta( $post_id, $this->getCacheKey( $key ) );
	}

	// =========================================================================
	// OPTIONS CACHE METHODS
	// =========================================================================

	/**
	 * Set cache in options table.
	 * 
	 * Use for global data that doesn't need expiration.
	 * Note: Options are stored with autoload=no to avoid loading on every request.
	 *
	 * @param string $key   The cache key.
	 * @param mixed  $cache The cache data.
	 *
	 * @throws \Exception Exception for invalid arguments.
	 *
	 * @return bool True on success, false on failure.
	 */
	public function setOptionCache( string $key, $cache ): bool {
		if ( '' === $key ) {
			throw new \Exception( __( 'Key is required on setOptionCache method', 'blockera' ) );
		}

		$cache_key = $this->getCacheKey( $key );

		// Append hash to key if present in cache data for versioning.
		if ( is_array( $cache ) && ! empty( $cache['hash'] ) ) {
			$cache_key = $cache_key . '_' . $cache['hash'];
		}

		// Use autoload=false to avoid loading this cache on every request.
		return update_option( $cache_key, $cache, false );
	}

	/**
	 * Get cache from options table.
	 *
	 * @param string $key     The cache key.
	 * @param mixed  $default Default value if option not found.
	 *
	 * @return mixed The cached data or default value.
	 */
	public function getOptionCache( string $key, $default = false ) {
		return get_option( $this->getCacheKey( $key ), $default );
	}

	/**
	 * Delete cache from options table.
	 *
	 * @param string $key The cache key.
	 *
	 * @return bool True on success, false on failure.
	 */
	public function deleteOptionCache( string $key ): bool {
		return delete_option( $this->getCacheKey( $key ) );
	}

	// =========================================================================
	// TRANSIENT CACHE METHODS
	// =========================================================================

	/**
	 * Set cache using transients.
	 * 
	 * Use for data that should expire after a certain time.
	 * Transients work with object cache if available.
	 *
	 * @param string $key        The cache key.
	 * @param mixed  $cache      The cache data.
	 * @param int    $expiration Time until expiration in seconds (default: 1 hour).
	 *
	 * @throws \Exception Exception for invalid arguments.
	 *
	 * @return bool True on success, false on failure.
	 */
	public function setTransientCache( string $key, $cache, int $expiration = HOUR_IN_SECONDS ): bool {
		if ( '' === $key ) {
			throw new \Exception( __( 'Key is required on setTransientCache method', 'blockera' ) );
		}

		return set_transient( $this->getCacheKey( $key ), $cache, $expiration );
	}

	/**
	 * Get cache from transients.
	 *
	 * @param string $key The cache key.
	 *
	 * @return mixed The cached data or false if not found/expired.
	 */
	public function getTransientCache( string $key ) {
		return get_transient( $this->getCacheKey( $key ) );
	}

	/**
	 * Delete cache from transients.
	 *
	 * @param string $key The cache key.
	 *
	 * @return bool True on success, false on failure.
	 */
	public function deleteTransientCache( string $key ): bool {
		return delete_transient( $this->getCacheKey( $key ) );
	}

	// =========================================================================
	// LEGACY/BACKWARD COMPATIBLE METHODS
	// =========================================================================

	/**
	 * Set cache (backward compatible method).
	 * 
	 * Routes to meta cache if post_id provided, otherwise to option cache.
	 *
	 * @param int    $post_id The post id (0 for option-based cache).
	 * @param string $key     The key.
	 * @param mixed  $cache   The cache data.
	 * 
	 * @deprecated 1.12.1 Use setMetaCache or setOptionCache instead.
	 *
	 * @throws \Exception Exception for any occurred errors.
	 *
	 * @return bool True on success, false on failure.
	 */
	public function setCache( int $post_id, string $key, $cache ): bool {
		if ( '' === $key ) {
			throw new \Exception( __( 'Key #2 Argument is required on setCache method of Cache class', 'blockera' ) );
		}

		if ( empty( $cache ) ) {
			throw new \Exception( __( 'Cache #3 Argument is required on setCache method of Cache class', 'blockera' ) );
		}

		if ( $post_id > 0 ) {
			return $this->setMetaCache( $post_id, $key, $cache );
		}

		return $this->setOptionCache( $key, $cache );
	}

	/**
	 * Get cache (backward compatible method).
	 * 
	 * Routes to meta cache if post_id provided, otherwise to option cache.
	 *
	 * @param int    $post_id The post id (0 for option-based cache).
	 * @param string $key     The key.
	 *
	 * @deprecated 1.12.1 Use getMetaCache or getOptionCache instead.
	 *
	 * @return mixed The cache data for the key.
	 */
	public function getCache( int $post_id, string $key ) {
		if ( $post_id > 0 ) {
			return $this->getMetaCache( $post_id, $key );
		}

		return $this->getOptionCache( $key );
	}

	/**
	 * Delete cache (backward compatible method).
	 * 
	 * Deletes from meta cache if post_id provided, always deletes from options.
	 *
	 * @param string $key     The key.
	 * @param int    $post_id The post id (optional).
	 *
	 * @deprecated 1.12.1 Use deleteMetaCache or deleteOptionCache instead.
	 *
	 * @return void
	 */
	public function deleteCache( string $key, int $post_id = 0 ): void {
		if ( $post_id > 0 ) {
			$this->deleteMetaCache( $post_id, $key );
		}

		$this->deleteOptionCache( $key );
	}

	// =========================================================================
	// BULK CLEAR METHODS
	// =========================================================================

	/**
	 * Clear all post meta cache for this product.
	 *
	 * @return bool True if any rows deleted, false otherwise.
	 */
	public function clearMetaCache(): bool {
		global $wpdb;

		$result = $wpdb->query(
			$wpdb->prepare(
				"DELETE FROM $wpdb->postmeta WHERE meta_key LIKE %s",
				$wpdb->esc_like( $this->cache_prefix ) . '%'
			)
		);

		return false !== $result && $result > 0;
	}

	/**
	 * Clear all option cache for this product.
	 *
	 * @return bool True if any rows deleted, false otherwise.
	 */
	public function clearOptionCache(): bool {
		global $wpdb;

		// Get all option names matching our prefix first.
		$option_names = $wpdb->get_col(
			$wpdb->prepare(
				"SELECT option_name FROM $wpdb->options WHERE option_name LIKE %s",
				$wpdb->esc_like( $this->cache_prefix ) . '%'
			)
		);

		if ( empty( $option_names ) ) {
			return false;
		}

		$deleted_count = 0;

		// Use delete_option() for each to properly clear WordPress object cache.
		foreach ( $option_names as $option_name ) {
			if ( delete_option( $option_name ) ) {
				++$deleted_count;
			}
		}

		return $deleted_count > 0;
	}

	/**
	 * Clear style engine v1 cache (legacy cleanup).
	 *
	 * @return bool True if any rows deleted, false otherwise.
	 */
	public function clearStyleEngineCache(): bool {
		global $wpdb;

		$result = $wpdb->query(
			$wpdb->prepare(
				"DELETE FROM $wpdb->options WHERE option_name LIKE %s",
				'%' . $wpdb->esc_like( 'wp_block_' ) . '%'
			)
		);

		return false !== $result && $result > 0;
	}

	/**
	 * Clear all transient cache for this product.
	 * 
	 * Note: This clears transients from the options table.
	 * On sites with object cache, transients may also be stored there.
	 *
	 * @return bool True if any rows deleted, false otherwise.
	 */
	public function clearTransientCache(): bool {
		global $wpdb;

		$transient_prefix = '_transient_' . $this->cache_prefix;

		// Get all transient option names matching our prefix.
		$transient_names = $wpdb->get_col(
			$wpdb->prepare(
				"SELECT option_name FROM $wpdb->options WHERE option_name LIKE %s",
				$wpdb->esc_like( $transient_prefix ) . '%'
			)
		);

		$deleted_count = 0;

		// Use delete_transient() for each to properly clear WordPress object cache.
		foreach ( $transient_names as $option_name ) {
			// Extract the transient key from option_name (remove '_transient_' prefix).
			$transient_key = substr( $option_name, strlen( '_transient_' ) );

			if ( delete_transient( $transient_key ) ) {
				++$deleted_count;
			}
		}

		return $deleted_count > 0;
	}

	/**
	 * Clear all cache for product data (meta, options, transients, and style engine).
	 *
	 * @return bool True on success (at least one type cleared), false on failure.
	 */
	public function clear(): bool {
		$meta_cleared         = $this->clearMetaCache();
		$options_cleared      = $this->clearOptionCache();
		$style_engine_cleared = $this->clearStyleEngineCache();
		$transients_cleared   = $this->clearTransientCache();

		// Return true if at least one cache type was successfully cleared.
		return $meta_cleared || $options_cleared || $style_engine_cleared || $transients_cleared;
	}
}
