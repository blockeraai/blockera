<?php

namespace Blockera\Data\Cache;

use Blockera\Data\Cache\Contracts\CacheVersion;

class Version extends Cache implements CacheVersion {

    /**
     * Get the product version cache key.
     *
     * @return string
     */
    protected function getProductVersionCacheKey(): string {
        return 'blockera_' . $this->product_id . '_current_version_';
    }

    /**
     * Validate the cache data based on the product version.
     *
     * @param string $product_version The product version.
     *
     * @return bool true on success, false on failure!
     */
    public function validate( string $product_version): bool {
        $stored_version = get_option($this->getProductVersionCacheKey($this->product_id));

        if (! $stored_version) {
            $this->store($this->product_id, $product_version);

            return true;
        }

        return version_compare($stored_version, $product_version, '==');
    }

    /**
     * Store the cache data.
     *
     * @param string $product_version The product version.
     *
     * @return bool true on success, false on failure!
     */
    public function store( string $product_version): bool {
        return update_option($this->getProductVersionCacheKey(), $product_version);
    }
}
