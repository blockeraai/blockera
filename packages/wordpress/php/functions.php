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

		return ! empty( $block['attrs']['blockeraPropsId'] );
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
		return 'wp_block_' . $block_name . '_' . md5( $attributes['blockeraPropsId'] );
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

		set_transient( $cache_key, $data );
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

if ( ! function_exists( 'blockera_get_small_random_hash' ) ) {

	/**
	 * Generates a fast random unique ID (10 characters in base-36) for the block.
	 * CPU-optimized implementation using native random_bytes and bitwise operations.
	 *
	 * @return string A random base-36 string of exactly 10 characters.
	 */
	function blockera_get_small_random_hash(): string {

		// CPU-optimized: Use 6 random bytes (48 bits) converted via fast bit-shift to integer.
		// Then convert to base-36 for exactly 10 characters. Bitwise operations are fastest.
		$bytes = random_bytes( 6 );
		$num   = ( ord( $bytes[0] ) << 40 ) | ( ord( $bytes[1] ) << 32 ) | ( ord( $bytes[2] ) << 24 ) | ( ord( $bytes[3] ) << 16 ) | ( ord( $bytes[4] ) << 8 ) | ord( $bytes[5] );

		return base_convert( $num, 10, 36 );
	}
}

if ( ! function_exists( 'blockera_get_unique_class_name_regex' ) ) {

	/**
	 * Retrieve regex pattern to detect unique classname.
	 *
	 * @return string the regular expression to detect blockera unique classname.
	 */
	function blockera_get_unique_class_name_regex(): string {

		return '/\b(blockera-block\s+blockera-block-[^\s]+)/';
	}
}

if (! function_exists('blockera_get_wp_classname_details')) {

	/**
	 * Retrieve details of WordPress classname.
	 * 
	 * @param string $classname the search classname.
	 *
	 * @return array array. Array with "is_matched" and "matches" index on success retrieved data, empty array on otherwise!
	 */
	function blockera_get_wp_classname_details( string $classname): array {

		if (empty(trim($classname))) {
			return [];
		}

		$is_matched = (bool) preg_match(blockera_block_get_wp_classname_regex(), $classname, $matches);

		return compact('is_matched', 'matches');
	}
}

if (! function_exists('blockera_block_get_wp_classname_regex')) {

	/**
	 * Retrieve regex pattern to detect WordPress classname.
	 * 
	 * @return string the regular expression to detect WordPress classname.
	 */
	function blockera_block_get_wp_classname_regex(): string {

		return '/wp-(block|element|elements)/i';
	}
}

if (! function_exists('blockera_pick_specific_classname')) {

	/**
	 * Pick specific classname from the given classname.
	 *
	 * @param array $classnames the classnames.
	 *
	 * @return string the specific classname.
	 */
	function blockera_pick_specific_classname( array $classnames): string {
		$picked = [];

		foreach ($classnames as $classname) {

			// Priority 1: Look for blockera unique classes.
			if (preg_match(blockera_get_unique_class_name_regex(), $classname)) {
				return $classname;
			}

			// Priority 2: Look for classes with numbers (likely unique identifiers).
			if (preg_match('/\d+/', $classname)) {
				$picked[] = $classname;
			}

			// Return the picked classnames if more than one found.
			if (count($picked) > 1) {
				return implode(' ', $picked);
			}
		}

		// Fallback: Return first classname if no specific classname found.
		return $classnames[0] ?? '';
	}
}

if ( ! function_exists( 'blockera_create_css_selector' ) ) {

	/**
	 * Create css selector.
	 *
	 * @param string $classname the target element picked classnames which separated by space.
	 *
	 * @return string the css selector.
	 */
	function blockera_create_css_selector( string $classname ): string {

		// Handle empty classname.
		if ( empty( trim( $classname ) ) ) {
			return '';
		}

		// Check if classname contains pseudo-class functions like :is(), :where(), :not(), etc.
		// These should be preserved as-is.
		if ( preg_match( '/:(is|where|not|has|host|host-context|any)\(/', $classname ) ) {
			// Split by space but preserve pseudo-class functions.
			$parts = preg_split( '/\s+(?![^(]*\))/', $classname );

			return trim(
				implode(
					'',
					array_map(
						function ( string $_selector ): string {
							$_selector = trim( $_selector );
							
							if ( empty( $_selector ) ) {
								return '';
							}
							
							// If already starts with . or contains pseudo-class, return as-is.
							if ( '.' === $_selector[0] || strpos( $_selector, ':' ) !== false ) {
								return $_selector;
							}
							
							return '.' . $_selector;
						},
						$parts
					)
				)
			);
		}

		// Standard processing for simple selectors.
		$selectors = explode( ' ', $classname );

		return trim(
			implode(
				'',
				array_map(
					function ( string $_selector ): string {

						$_selector = trim( $_selector );

						if ( empty( $_selector ) ) {
							return '';
						}

						// Already has a class prefix.
						if ( '.' === $_selector[0] ) {
							return $_selector;
						}

						// Contains pseudo-class or pseudo-element.
						if ( strpos( $_selector, ':' ) !== false ) {
							// Check if it needs a class prefix before the pseudo-class.
							if ( preg_match( '/^([a-zA-Z0-9_-]+)(:.+)$/', $_selector, $matches ) ) {
								return '.' . $matches[1] . $matches[2];
							}
							return $_selector;
						}

						return '.' . $_selector;
					},
					$selectors
				)
			)
		);
	}
}

if (! function_exists('blockera_block_is_dynamic')) {

	/**
	 * Check if the block is dynamic.
	 *
	 * @param array $block The block array.
	 * 
	 * @return bool true if the block is dynamic, false otherwise.
	 */
	function blockera_block_is_dynamic( array $block ): bool {

		$registered_block = WP_Block_Type_Registry::get_instance()->get_registered( $block['blockName'] ?? '' );

		if ( ! $registered_block ) {

			return true;
		}

		return $registered_block->is_dynamic();
	}
}

if (! function_exists('blockera_block_is_loop')) {
	
	/**
	 * Check if the block is a loop block.
	 * 
	 * @param string $block_name The name of the block.
	 *
	 * @return bool true on success, false otherwise.
	 */
	function blockera_block_is_loop( string $block_name): bool {

		if (empty($block_name)) {
			return false;
		}

		$blocks = [
			// WordPress core blocks.
			'core/query',
			'core/terms-query',
			'core/post-template',
			'core/term-template',
			'core/comments',
			// TODO: Add Woocommerce blocks.
			'woocommerce/product-query',
			'woocommerce/product-collection',
			// Blocksy blocks.
			'blocksy/query',
			'blocksy/tax-query',
			'blocksy/tax-template',
			'blocksy/post-template',
		];

		return in_array($block_name, $blocks, true);
	}
}
