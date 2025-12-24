<?php

namespace Blockera\Data\Cache;

use Blockera\Data\Cache\Contracts\CacheVersion;

/**
 * Version cache manager for handling product version-based cache invalidation.
 *
 * This class extends Cache and provides version validation functionality
 * to determine when cached data should be invalidated due to version changes.
 */
class Version extends Cache implements CacheVersion {

	/**
	 * Version cache key prefix (computed once).
	 *
	 * @var string
	 */
	protected string $version_cache_key;

	/**
	 * Version constructor.
	 *
	 * @param array $args The arguments (must include 'product_id').
	 *
	 * @throws \Exception Exception for any occurred errors.
	 */
	public function __construct( array $args = [] ) {
		parent::__construct( $args );

		$this->version_cache_key = 'blockera_' . $this->product_id . '_current_version';
	}

	/**
	 * Get the product version cache key.
	 *
	 * @return string The version cache key.
	 */
	public function getVersionCacheKey(): string {
		return $this->version_cache_key;
	}

	/**
	 * Validate the cache data based on the product version.
	 *
	 * If no version is stored, stores the provided version and returns true.
	 * If stored version matches provided version, returns true.
	 * If versions don't match, returns false (cache is invalid).
	 *
	 * @param string $product_version The product version to validate against.
	 *
	 * @return bool True if cache is valid (versions match or first run), false if invalid.
	 */
	public function validate( string $product_version ): bool {
		$stored_version = get_option( $this->version_cache_key, '' );

		// First run: no stored version, store it and return valid.
		if ( '' === $stored_version ) {
			$this->store( $product_version );

			return true;
		}

		return version_compare( $stored_version, $product_version, '==' );
	}

	/**
	 * Store the product version.
	 *
	 * @param string $product_version The product version to store.
	 *
	 * @return bool True on success, false on failure.
	 */
	public function store( string $product_version ): bool {
		// Use autoload=true for version since it's small and frequently accessed.
		return update_option( $this->version_cache_key, $product_version, true );
	}

	/**
	 * Get the stored product version.
	 *
	 * @return string The stored version or empty string if not set.
	 */
	public function getStoredVersion(): string {
		return get_option( $this->version_cache_key, '' );
	}

	/**
	 * Delete the stored version.
	 *
	 * @return bool True on success, false on failure.
	 */
	public function deleteVersion(): bool {
		return delete_option( $this->version_cache_key );
	}

	/**
	 * Invalidate cache if version has changed.
	 *
	 * This method checks if the version has changed and if so,
	 * clears all cache and updates the stored version.
	 *
	 * @param string $product_version The current product version.
	 *
	 * @return bool True if cache was invalidated, false if cache is still valid.
	 */
	public function invalidateIfVersionChanged( string $product_version ): bool {
		if ( $this->validate( $product_version ) ) {
			// Version matches, cache is still valid.
			return false;
		}

		// Version changed, clear all cache and update version.
		$this->clear();
		$this->store( $product_version );

		return true;
	}
}
