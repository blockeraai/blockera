<?php

namespace Blockera\Data\Cache;

use Blockera\Bootstrap\Application;

class Cache {

    /**
     * The product id.
     *
     * @var string
     */
    protected string $product_id;

    /**
     * Store the app instance.
     *
     * @var Application
     */
    protected Application $app;

    /**
     * Cache constructor.
     *
     * @param Application $app The app instance.
     * @param array       $args The arguments.
	 * 
	 * @throws \Exception Exception for any occurred errors.
     */
    public function __construct( Application $app, array $args = []) {
        $this->app = $app;

        if (! isset($args['product_id'])) {
            throw new \Exception(__('Product ID is required on Cache class constructor', 'blockera'));
        }

        if (! is_string($args['product_id'])) {
            throw new \Exception(__('Invalid product ID format: expected string value on Cache class constructor', 'blockera'));
        }

        $this->product_id = $args['product_id'];
    }

    /**
     * Get the prefix key for the cache.
     *
     * @param string $key The key.
     *
     * @return string
     */
    public function getCacheKey( string $key = ''): string {
        return 'blockera_' . $this->product_id . '_product_data_' . $key;
    }

    /**
     * Set the cache.
     *
     * @param int    $post_id The post id.
     * @param string $key The key.
     * @param mixed  $cache The cache.
	 * 
	 * @throws \Exception Exception for any occurred errors.
     *
     * @return bool true on success, false on failure!
     */
    public function setCache( int $post_id, string $key, $cache): bool {
		if (empty($key)) {
			throw new \Exception(__('Key #2 Argument is required on setCache method of Cache class', 'blockera'));
		}

		if (empty($cache)) {
			throw new \Exception(__('Cache #3 Argument is required on setCache method of Cache class', 'blockera'));
		}

        if ($post_id) {
            return update_post_meta($post_id, $this->getCacheKey($key), $cache);
        }

		if (! empty($cache['hash'])) {
			$key = $key . '_' . $cache['hash'];
		}

        return update_option($this->getCacheKey($key), $cache);
    }

    /**
     * Get the cache.
     *
     * @param string $post_id The product id.
     * @param string $key The key.
     *
     * @return mixed the cache data for the key.
     */
    public function getCache( string $post_id, string $key) {
		if ($post_id) {
            return get_post_meta($post_id, $this->getCacheKey($key), true);
		}

        return get_option($this->getCacheKey($key));
    }

    /**
     * Delete the cache.
     *
     * @param string $key The key.
     *
     * @return void
     */
    public function deleteCache( string $key): void {
        delete_option($this->getCacheKey($key));
    }

    /**
     * Clear cache for product data.
     *
     * @return bool true on success, false on failure!
     */
    public function clear(): bool {
        global $wpdb;

		// Deleting all options related with the blockera product id.
        $deleted_cache_keys = $wpdb->query(
            $wpdb->prepare(
                "DELETE FROM $wpdb->options WHERE option_name LIKE %s",
                $this->getCacheKey() . '%'
            )
        );
		
		// Deleting all options related with the blockera style engine v1.
		$deleted_style_engine_v1_cache_keys = $wpdb->query(
            $wpdb->prepare(
                "DELETE FROM $wpdb->options WHERE option_name LIKE %s",
                '%wp_block_%'
            )
		);

		// Deleting all post meta data related with the blockera product id.
        $deleted_post_meta_cache_keys = $wpdb->query(
            $wpdb->prepare(
                "DELETE FROM $wpdb->postmeta WHERE meta_key LIKE %s",
                $this->getCacheKey() . '%'
            )
        );

		if (is_int($deleted_cache_keys)) {
			$deleted_cache_keys = true;
		}

		if (is_int($deleted_style_engine_v1_cache_keys)) {
			$deleted_style_engine_v1_cache_keys = true;
		}

		if (is_int($deleted_post_meta_cache_keys)) {
			$deleted_post_meta_cache_keys = true;
		}

		return $deleted_cache_keys && $deleted_style_engine_v1_cache_keys && $deleted_post_meta_cache_keys;
    }
}
