<?php

if ( ! function_exists( 'blockera_get_block_type' ) ) {

	/**
	 * Get WordPress block type instance by name.
	 *
	 * @param string $name The block type name.
	 *
	 * @return WP_Block_Type | null The WP_Block_Type instance object.
	 */
	function blockera_get_block_type( string $name ): ?WP_Block_Type {

		return WP_Block_Type_Registry::get_instance()->get_registered( $name );
	}
}

if ( ! function_exists( 'blockera_get_block_type_property' ) ) {

	/**
	 * Retrieve block type mapped selectors array.
	 *
	 * @param string $name          the block name.
	 * @param string $property_name the block property name.
	 *
	 * @return mixed the block type property value.
	 */
	function blockera_get_block_type_property( string $name, string $property_name ) {

		$registered = blockera_get_block_type( $name );

		if ( null === $registered || ! property_exists( $registered, $property_name ) ) {

			return [];
		}

		return $registered->$property_name;
	}
}

if ( ! function_exists( 'blockera_is_supported_block' ) ) {

	/**
	 * Block is supported by Blockera?
	 *
	 * @param array $block the block array.
	 *
	 * @return bool true on success, false on otherwise!
	 */
	function blockera_is_supported_block( array $block ): bool {

		return ! empty( $block['attrs']['blockeraPropsId'] ) && ! empty( $block['attrs']['blockeraId'] );
	}
}

if ( ! function_exists( 'blockera_get_block_hash' ) ) {

	/**
	 * Get blockera block unique hash.
	 *
	 * @param array $block the block array.
	 *
	 * @return string the block hash.
	 */
	function blockera_get_block_hash( array $block ): string {

		$block_content_raw = serialize( $block['innerHTML'] );
		$block_name        = str_replace( [ '/', '-' ], '_', $block['blockName'] );

		return 'wp_block_' . $block_name . '_' . md5( serialize( $block['attrs'] ) . $block_content_raw );
	}
}

if ( ! function_exists( 'blockera_get_block_cache_key' ) ) {

	/**
	 * Get blockera block cache key.
	 *
	 * @param array $block the block array.
	 *
	 * @return string
	 */
	function blockera_get_block_cache_key( array $block ): string {

		// Extract block attributes and content.
		$attributes = $block['attrs'];
		$block_name = str_replace( [ '/', '-' ], '_', $block['blockName'] );

		// Create and return a unique cache key.
		return 'wp_block_' . $block_name . '_' . md5( $attributes['blockeraId'] );
	}
}

if ( ! function_exists( 'blockera_get_block_cache' ) ) {

	/**
	 * Get block cache data,
	 * Skip cache mechanism when application debug mode is on.
	 *
	 * @return array array with "css" index on success retrieved data, empty array on otherwise!
	 */
	function blockera_get_block_cache( $cache_key ): array {

		// Check debug mode status.
		if ( blockera_core_config( 'app.debug' ) ) {

			return [];
		}

		// Preparing cache data.
		$cache = get_transient( $cache_key );

		// Validate cache data!
		if ( ! empty( $cache ) && array_intersect( [ 'css' ], array_keys( $cache ) ) ) {

			return $cache;
		}

		return [];
	}
}

if ( ! function_exists( 'blockera_set_block_cache' ) ) {

	/**
	 * Sets blockera block data into related cache key.
	 * merge previous cache data with new collected data.
	 *
	 * @param string $cache_key the cache key.
	 * @param array  $data      the cache data.
	 *
	 * @return void
	 */
	function blockera_set_block_cache( string $cache_key, array $data ): void {

		// Skip cache mechanism when application debug mode is on.
		if ( blockera_core_config( 'app.debug' ) ) {

			return;
		}

		set_transient( $cache_key, $data, HOUR_IN_SECONDS );
	}
}

if ( ! function_exists( 'blockera_delete_block_cache' ) ) {

	/**
	 * Deleting blockera block cache data.
	 *
	 * @param string $cache_key the cache key.
	 *
	 * @return bool True if the transient was deleted, false otherwise.
	 */
	function blockera_delete_block_cache( string $cache_key ): bool {

		return delete_transient( $cache_key );
	}
}

if ( ! function_exists( 'blockera_add_inline_css' ) ) {

	/**
	 * Adding computed css rules into inline css handle.
	 *
	 * @param string $css the provided css from outside.
	 *
	 * @return void
	 */
	function blockera_add_inline_css( string $css ): void {

		if ( empty( $css ) ) {

			return;
		}

		add_filter(
			'blockera/wordpress/register-block-editor-assets/add-inline-css-styles',
			function ( string $older_css ) use ( $css ): string {

				return $older_css . $css;
			}
		);
	}
}

if ( ! function_exists( 'blockera_convert_to_unique_hash' ) ) {

	/**
	 * Retrieve unique hash key.
	 *
	 * @param string $hash the target hash to convert unique hash.
	 *
	 * @throws \Random\RandomException Exception if an appropriate source of randomness cannot be found.
	 * @return string the unique hash key.
	 */
	function blockera_convert_to_unique_hash( string $hash ): string {

		// Generate a unique ID using uniqid (with more entropy for better uniqueness).
		$unique_id = uniqid( '', true );

		// Optionally, we can append some random data for even more uniqueness.
		$unique_id .= bin2hex( random_bytes( 10 ) ) . $hash;

		// Hash the unique ID using SHA-256 algorithm.
		return hash( 'sha256', $unique_id );
	}
}

if ( ! function_exists( 'blockera_get_small_random_hash' ) ) {

	/**
	 * Generates a shortened version of the given string by creating a hash and converting it to a base-36 random string.
	 *
	 * @param string $big_hash The input string to shorten.
	 *
	 * @return string The shortened string.
	 */
	function blockera_get_small_random_hash( string $big_hash ): string {

		$hash     = 0;
		$big_hash = blockera_convert_to_unique_hash( $big_hash );

		for ( $i = 0; $i < strlen( $big_hash ); $i++ ) {

			// Bitwise operations.
			$hash = ord( $big_hash[ $i ] ) + ( ( $hash << 5 ) - $hash );

			// Convert to 32bit integer.
			$hash = $hash & 0xFFFFFFFF;
		}

		// Convert to base-36 string.
		return base_convert( $hash, 10, 36 );
	}
}
