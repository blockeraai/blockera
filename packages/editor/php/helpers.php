<?php

use Blockera\Exceptions\BaseException;

if ( ! function_exists( 'blockera_get_unique_classname' ) ) {
	/**
	 * Retrieve css classname with suffix string.
	 *
	 * @param string $suffix suffix for use in create css classname.
	 *
	 * @return string the unique css classname.
	 */
	function blockera_get_unique_classname( string $suffix ): string {

		$suffix = str_replace( '/', '-', $suffix );

		return $suffix . uniqid( '-' );
	}
}

if ( ! function_exists( 'blockera_is_valid_breakpoint_px' ) ) {

	/**
	 * Check if a breakpoint media value is a usable pixel value.
	 *
	 * @param string $value The breakpoint min/max value.
	 *
	 * @return bool
	 */
	function blockera_is_valid_breakpoint_px( string $value ): bool {

		if ( '' === $value || false !== strpos( $value, 'func' ) ) {
			return false;
		}

		$numeric = preg_replace( '/[^0-9]/', '', $value );

		return '' !== $numeric && is_numeric( $numeric );
	}
}

if ( ! function_exists( 'blockera_parse_breakpoint_px' ) ) {

	/**
	 * Parse a breakpoint pixel value into an integer.
	 *
	 * @param string $value The breakpoint min/max value.
	 *
	 * @return int
	 */
	function blockera_parse_breakpoint_px( string $value ): int {

		return (int) preg_replace( '/[^0-9]/', '', $value ) ? (int) preg_replace( '/[^0-9]/', '', $value ) : 0;
	}
}

if ( ! function_exists( 'blockera_format_breakpoint_px' ) ) {

	/**
	 * Format an integer pixel value for breakpoint media queries.
	 *
	 * @param int $value The pixel value.
	 *
	 * @return string
	 */
	function blockera_format_breakpoint_px( int $value ): string {

		return $value . 'px';
	}
}

if ( ! function_exists( 'blockera_resolve_breakpoint_media_settings' ) ) {

	/**
	 * Resolve min/max media settings for all non-base breakpoints.
	 *
	 * Explicit min/max pairs are kept as-is. Missing bounds are inferred from
	 * neighboring breakpoints so each range is as specific as possible.
	 *
	 * @param array $breakpoints The configured breakpoints.
	 *
	 * @return array<string, array{min: string, max: string}>
	 */
	function blockera_resolve_breakpoint_media_settings( array $breakpoints): array {

		// Request-level memo: StyleEngine calls this per breakpoint with the same list.
		static $cache = [];

		// Fingerprint only media-relevant fields (type/base/min/max).
		$key = '';
		foreach ( $breakpoints as $breakpoint ) {
			if ( ! is_array( $breakpoint ) ) {
				continue;
			}

			$key .= ( $breakpoint['type'] ?? '' ) . "\0"
				. ( empty( $breakpoint['base'] ) ? '0' : '1' ) . "\0"
				. ( $breakpoint['settings']['min'] ?? '' ) . "\0"
				. ( $breakpoint['settings']['max'] ?? '' ) . "\1";
		}

		if ( isset( $cache[ $key ] ) ) {
			return $cache[ $key ];
		}

		/**
		 * Validate + parse px once (same rules as is_valid/parse helpers).
		 *
		 * @return array{0:bool,1:int} [valid, px]
		 */
		$parse_px = static function ( string $value ): array {
			if ( '' === $value || false !== strpos( $value, 'func' ) ) {
				return [ false, 0 ];
			}

			// Fast path: "123px" (default Blockera config).
			$len = strlen( $value );
			if ( $len > 2 && 'p' === $value[ $len - 2 ] && 'x' === $value[ $len - 1 ] ) {
				$num = substr( $value, 0, $len - 2 );
				if ( '' !== $num && ctype_digit( $num ) ) {
					return [ true, (int) $num ];
				}
			}

			$numeric = preg_replace( '/[^0-9]/', '', $value );
			if ( '' === $numeric || ! is_numeric( $numeric ) ) {
				return [ false, 0 ];
			}

			return [ true, (int) $numeric ];
		};

		$resolved = [];
		$max_only = []; // List of [px, type, max].
		$min_only = []; // List of [px, type, min].
		$fallback = []; // List of [type, min, max].

		foreach ( $breakpoints as $breakpoint ) {
			if ( empty( $breakpoint['type'] ) || ! empty( $breakpoint['base'] ) ) {
				continue;
			}

			$type = $breakpoint['type'];
			$min  = $breakpoint['settings']['min'] ?? '';
			$max  = $breakpoint['settings']['max'] ?? '';

			if ( $min && $max ) {
				$resolved[ $type ] = [
					'min' => $min,
					'max' => $max,
				];
				continue;
			}

			if ( ! $min ) {
				[ $max_valid, $max_px ] = $parse_px( $max );
				if ( $max_valid ) {
					$max_only[] = [ $max_px, $type, $max ];
					continue;
				}
			}

			if ( ! $max ) {
				[ $min_valid, $min_px ] = $parse_px( $min );
				if ( $min_valid ) {
					$min_only[] = [ $min_px, $type, $min ];
					continue;
				}
			}

			if ( $min || $max ) {
				$fallback[] = [ $type, $min, $max ];
			}
		}

		$max_n = count( $max_only );
		if ( $max_n > 1 ) {
			$px_col = [];
			for ( $i = 0; $i < $max_n; $i++ ) {
				$px_col[ $i ] = $max_only[ $i ][0];
			}
			array_multisort( $px_col, SORT_DESC, SORT_NUMERIC, $max_only );
		}

		for ( $i = 0; $i < $max_n; $i++ ) {
			$next = $max_only[ $i + 1 ] ?? null;
			// Neighbor max values are already validated; min is next.max+1 or 0px.
			$min = ( null !== $next )
				? ( $next[0] + 1 ) . 'px'
				: '0px';

			$resolved[ $max_only[ $i ][1] ] = [
				'min' => $min,
				'max' => $max_only[ $i ][2],
			];
		}

		$min_n = count( $min_only );
		if ( $min_n > 1 ) {
			$px_col = [];
			for ( $i = 0; $i < $min_n; $i++ ) {
				$px_col[ $i ] = $min_only[ $i ][0];
			}
			array_multisort( $px_col, SORT_ASC, SORT_NUMERIC, $min_only );
		}

		for ( $i = 0; $i < $min_n; $i++ ) {
			$next = $min_only[ $i + 1 ] ?? null;
			$max  = ( null !== $next )
				? ( $next[0] - 1 ) . 'px'
				: '';

			$resolved[ $min_only[ $i ][1] ] = [
				'min' => $min_only[ $i ][2],
				'max' => $max,
			];
		}

		foreach ( $fallback as $row ) {
			if ( ! isset( $resolved[ $row[0] ] ) ) {
				$resolved[ $row[0] ] = [
					'min' => $row[1] ? $row[1] : '',
					'max' => $row[2] ? $row[2] : '',
				];
			}
		}

		$cache[ $key ] = $resolved;

		return $resolved;
	}
}

if ( ! function_exists( 'blockera_get_css_media_queries' ) ) {

	/**
	 * Get css media queries from configured breakpoints.
	 * 
	 * @param array $breakpoints The breakpoints.
	 *
	 * @return array
	 */
	function blockera_get_css_media_queries( array $breakpoints): array {

		$queries        = [];
		$media_settings = blockera_resolve_breakpoint_media_settings( $breakpoints );

		foreach ( $breakpoints as $breakpoint ) {

			// skip invalid breakpoint.
			if ( empty( $breakpoint['type'] ) ) {

				continue;
			}

			if ( ! empty( $breakpoint['base'] ) ) {
				$queries[ $breakpoint['type'] ] = '';

				continue;
			}

			$min   = $media_settings[ $breakpoint['type'] ]['min'] ?? '';
			$max   = $media_settings[ $breakpoint['type'] ]['max'] ?? '';
			$media = '';

			if ( $min && $max ) {

				$media = "@media screen and (max-width: $max) and (min-width: $min)";

			} elseif ( $min ) {

				$media = "@media screen and (min-width: $min)";

			} elseif ( $max ) {

				$media = "@media screen and (max-width: $max)";
			}

			$queries[ $breakpoint['type'] ] = $media;
		}

		return $queries;
	}
}

if ( ! function_exists( 'blockera_block_state_validate' ) ) {

	/**
	 * Is block state validate?
	 *
	 * @param array  $states The block states.
	 * @param string $state  The state name.
	 *
	 * @return array The block state.
	 */
	function blockera_block_state_validate( array $states, string $state ): array {

		if ( ! $state || empty( $states ) || empty( $states[ $state ] ) ) {

			return [];
		}

		return $states[ $state ];
	}
}

if ( ! function_exists( 'blockera_append_selector_prefix' ) ) {

	/**
	 * Appending "blockera/" prefix at block type name.
	 *
	 * @param string $block_type the block type name.
	 *
	 * @return string the block type name with "blockera/" prefix.
	 */
	function blockera_append_selector_prefix( string $block_type ): string {

		return "blockera/{$block_type}";
	}
}

if ( ! function_exists( 'blockera_is_bare_html_element_selector' ) ) {

	/**
	 * Whether a selector is a bare HTML element tag (e.g. `p`, `h1`).
	 *
	 * @param string $selector The selector to check.
	 *
	 * @return bool
	 */
	function blockera_is_bare_html_element_selector( string $selector ): bool {

		return (bool) preg_match( '/^[a-z][a-z0-9-]*$/i', trim( $selector ) );
	}
}

if ( ! function_exists( 'blockera_merge_unique_selector_into_inner_block_root' ) ) {

	/**
	 * Scope an inner-block root to the Blockera unique class.
	 *
	 * @param string $root             The block-type root selector.
	 * @param string $unique_selector  The Blockera unique class selector.
	 * @param array  $args             Selector arguments.
	 *
	 * @return string
	 */
	function blockera_merge_unique_selector_into_inner_block_root( string $root, string $unique_selector, array $args ): string {

		if ( blockera_is_bare_html_element_selector( $root ) ) {
			return $unique_selector;
		}

		$block_part = blockera_resolve_block_css_part( $root, $unique_selector, $args );

		if ( null !== $block_part ) {
			return \Blockera\Utils\Utils::modifySelectorPos(
				$root,
				$block_part,
				[
					'prefix' => $unique_selector,
					'suffix' => '',
				]
			);
		}

		return $unique_selector;
	}
}

if ( ! function_exists( 'blockera_get_inner_block_state_selector' ) ) {

	/**
	 * Retrieve inner block state suitable selector.
	 *
	 * @param string $selector the picked selector from WordPress api.
	 * @param array  $args     the extra arguments to generate unique css selectors.
	 *
	 * @throws BaseException Exception for invalid selector.
	 *
	 * @return string the unique selector for current inner block state.
	 */
	function blockera_get_inner_block_state_selector( string $selector, array $args = [] ): string {

		$is_global_style             = $args['is-global-style'] ?? false;
		$master_block_state          = $args['pseudo-class'] ?? 'normal';
		$pseudo_class                = $args['inner-pseudo-class'] ?? 'normal';
		$current_state_has_selectors = $args['current_state_has_selectors'] ?? false;
		// Filters standard css pseudo classes.
		$parent_pseudo_class = in_array(
			$master_block_state,
			[
				'normal',
				'parent-class',
				'custom-class',
			],
			true
		) ? '' : $master_block_state;

		// Create root selector.
		$root = ! isset($args['root']) || empty($args['root']) ? $args['blockera-unique-selector'] : $args['root'];

		// If the selector starts with a space, we should add the blockera unique selector to the selector.
		if (str_starts_with($root, ' ')) {
			$root = $args['blockera-unique-selector'] . $root;
		}

		/*
		 * Block-type roots (e.g. `p`, `.wp-block-button .wp-block-button__link`, `.wp-block-list > li`)
		 * describe element shape only. Inner block styles must scope to the blockera unique class on
		 * the instance being edited:
		 * - bare tags (core/paragraph `p`): use the unique class as the :where() root
		 * - compound `>` roots: unique class on wrapper or last compound (list-item, table)
		 * - class/descendant roots: merge unique class into the wp-block segment (core/button, etc.)
		 */
		$unique_selector = $args['blockera-unique-selector'] ?? '';
		if ( '' !== trim( $unique_selector ) && ! str_contains( $root, $unique_selector ) ) {
			if ( preg_match( '/\s>\s/', $root ) ) {
				$block_name = (string) ( $args['block-name'] ?? '' );

				if ( blockera_compound_root_classes_on_wrapper(
					[
						'root'            => $root,
						'full-block-name' => $block_name,
						'block-name'      => str_replace( [ 'core/', '/' ], [ '', '-' ], $block_name ),
					]
				) ) {
					$compound_parts = preg_split( '/\s>\s/', $root, 2 );
					$wrapper        = trim( (string) ( $compound_parts[0] ?? '' ) );
					$child          = trim( (string) ( $compound_parts[1] ?? '' ) );

					$root = $wrapper . $unique_selector . ( '' !== $child ? ' > ' . $child : '' );
				} else {
					$parts = preg_split( '/(?:::|:)/', $root, 2 );
					$root  = $parts[0] . $unique_selector;
				}
			} else {
				$root = blockera_merge_unique_selector_into_inner_block_root(
					$root,
					$unique_selector,
					[
						'block-name' => str_replace( '/', '-', str_replace( 'core/', '', $args['block-name'] ?? '' ) ),
					]
				);
			}
		}

		// Overriding selectors based on supported pseudo-class in css. Supported pseudo-classes with css: hover, active, visited, before, after.
		if ( $pseudo_class && 'normal' !== $pseudo_class ) {

			$parsedValue = [ $selector ];

			// Check if selector contains pseudo-class functions like :is(), :where(), :not(), etc.
			// These functions can contain multiple selectors separated by commas, which should not be split.
			if (! preg_match( blockera_regex_pseudo_class_functions_pattern(), $selector, $matches ) ) {
				
				$parsedValue = explode( ',', trim( $selector ) );
			}

			// Assume current selector is multiple.
			if ( count( $parsedValue ) > 1 ) {

				// Add pseudo custom css class as suffix into selectors value for current key.
				return implode(
					', ',
					array_map(
						static function ( string $item ) use ( $root, $args, $parent_pseudo_class, $is_global_style, $pseudo_class, $current_state_has_selectors ): string {

							return blockera_get_css_selector_format(
								$root,
								trim( $item ),
								compact( 'pseudo_class', 'parent_pseudo_class', 'is_global_style', 'current_state_has_selectors' )
							);
						},
						$parsedValue
					)
				);

			} else {

				// Add pseudo custom css class as suffix into selectors value for current key.
				return blockera_get_css_selector_format(
					$root,
					$selector,
					compact( 'pseudo_class', 'parent_pseudo_class', 'is_global_style', 'current_state_has_selectors' )
				);
			}
		}

		// inner block in normal state.
		if ( $master_block_state ) {
			// Add pseudo custom css class as suffix into selectors value for current key.
			return blockera_get_css_selector_format(
				$root,
				$selector,
				compact( 'parent_pseudo_class', 'is_global_style', 'current_state_has_selectors' )
			);
		}

		return trim(
			sprintf( '%s %s', trim( $root ), $selector )
		);
	}
}

if ( ! function_exists( 'blockera_get_master_block_state_selector' ) ) {

	/**
	 * Retrieve block state selectors.
	 *
	 * @param string $selector the picked selector for master blockera from WordPress api.
	 * @param array  $args     the extra arguments to generate unique css selectors.
	 *
	 * @return string the unique selector for block current state.
	 */
	function blockera_get_master_block_state_selector( string $selector, array $args = [] ): string {

		if ( empty( trim( $selector ) ) ) {

			return $selector;
		}

		$block_settings = $args['block-settings'] ?? [];
		$pseudo_class   = $args['pseudo-class'] ?? 'normal';

		// Imagine the $block_settings variable is not empty.
		if ( ! empty( $block_settings ) ) {

			$custom_classname = $block_settings['blockeraBlockStates'][ $pseudo_class ]['css-class'] ?? null;

			$has_css_class = in_array( $pseudo_class, [ 'custom-class', 'parent-class' ], true );

			// Overriding master block selectors with provided custom-class.
			// Included all selectors without inner blocks selectors.
			if ( $has_css_class && ! empty( $custom_classname ) ) {

				$normalized_root = blockera_get_normalized_selector( $custom_classname );
				$normalized_root = str_ends_with( $normalized_root, ' ' ) ? $normalized_root : $normalized_root . ' ';

				// Add pseudo custom css class as suffix into selectors value for current key.
				return $normalized_root . $selector;
			}
		}

		// Overriding selector based on supported pseudo-class in css. Supported pseudo-classes with css: hover, active, visited, before, after.
		if ( $pseudo_class && 'normal' !== $pseudo_class ) {

			$parsed = explode( ',', $selector );

			if ( count( $parsed ) > 1 ) {

				// Add pseudo custom css class as suffix into selectors value for current key.
				$selector = implode(
					', ',
					array_map(
						static function ( string $item ) use ( $pseudo_class, $args ): string {
							// Imagine the item is a pseudo-class function like :is(), :where(), :not(), etc.
							// We should not add blockera pseudo classes suffix to the item at the end of string.
							// It should add as a suffix to the root selector.
							if (preg_match(blockera_regex_pseudo_class_functions_pattern(false), $item)) {

								if (! empty($args['current_state_has_selectors'])) {
									return $item;
								}

								$extract = explode(' ', $item);

								if (1 < count($extract)) {
									$extract[0] = blockera_set_selector_pseudo_class($extract[0], $pseudo_class);

									return implode(' ', $extract);
								}

								return $item;
							}

							if (str_ends_with($item, ')')) {
								return $item;
							}

							return ! empty($args['current_state_has_selectors']) ? $item : blockera_set_selector_pseudo_class( $item, $pseudo_class );
						},
						$parsed
					)
				);

			} else {

				// Add pseudo custom css class as suffix into selectors value for current key.
				$selector = ! empty($args['current_state_has_selectors']) ? $selector : blockera_set_selector_pseudo_class( $selector, $pseudo_class );
			}
		}

		return $selector;
	}
}

if ( ! function_exists( 'blockera_set_selector_pseudo_class' ) ) {

	/**
	 * Set pseudo class to base selector.
	 *
	 * @param string $selector     the base css selector.
	 * @param string $pseudo_class the standard css pseudo class.
	 *
	 * @return string
	 */
	function blockera_set_selector_pseudo_class( string $selector, string $pseudo_class ): string {

		return trim( $selector ) . blockera_get_state_symbol( $pseudo_class ) . $pseudo_class;
	}
}

if ( ! function_exists( 'blockera_get_state_symbol' ) ) {

	/**
	 * Get state symbol.
	 *
	 * @param string $state The state.
	 *
	 * @return string
	 */
	function blockera_get_state_symbol( string $state ): string {

		return in_array( $state, [ 'marker', 'placeholder', 'before', 'after' ], true ) ? '::' : ':';
	}
}

if ( ! function_exists( 'blockera_get_css_selector_format' ) ) {

	/**
	 * Get css selector valid and standard format.
	 *
	 * @param string $root   the root selector.
	 * @param string $picked_selector the picked selector.
	 * @param array  $args            the extra arguments to format css selector.
	 *
	 * @throws BaseException Exception for invalid selector.
	 * @return string the standard formatted css selector.
	 */
	function blockera_get_css_selector_format( string $root, string $picked_selector, array $args ): string {

		$pseudo_class                = $args['pseudo_class'] ?? '';
		$is_global_style             = $args['is_global_style'] ?? false;
		$parent_pseudo_class         = $args['parent_pseudo_class'] ?? '';
		$current_state_has_selectors = $args['current_state_has_selectors'] ?? false;
		// Pre-calculate reused values.
		$has_parent_pseudo = ! empty( $parent_pseudo_class );
		$has_pseudo        = ! empty( $pseudo_class );
		$root_first_part   = '';
		
		// Get the first part of root selector for && pattern.
		if ( ! empty( $root ) ) {
			$root_parts      = explode( ' ', $root );
			$root_first_part = $root_parts[0];
		}

		$formatted_selectors = [];
		$selectors           = [ $picked_selector ];

		// Check if selector contains pseudo-class functions like :is(), :where(), :not(), etc.
		// These functions can contain multiple selectors separated by commas, which should not be split.
		if ( ! preg_match( blockera_regex_pseudo_class_functions_pattern(), $picked_selector, $matches ) ) {
		
			// Split the selector by commas.
			$selectors = explode( ', ', $picked_selector );
		}

		foreach ($selectors as $selector) {
			$new_selector = blockera_process_ampersand_selector_char($selector);
			$needs_space  = ! str_starts_with($selector, '&') && ! empty($root);

			// Handle && pattern.
			if ( str_starts_with( $selector, '&&' ) ) {

				if (! empty(trim($root))) {
					// Set specificities for root selector.
					if ($is_global_style) {
						$new_selector = ":root body :where($root_first_part)$new_selector";
					} else {
						$new_selector = "html:root body :where($root_first_part)$new_selector";
					}
				} else {
					$new_selector = $new_selector;
				}

				$merged_selector = $new_selector . 
					( $has_pseudo && ! $current_state_has_selectors ? blockera_get_state_symbol($pseudo_class) . $pseudo_class : '' );

				$formatted_selectors[] = blockera_create_standard_selector($new_selector, $pseudo_class, compact('merged_selector', 'has_pseudo'));
			} else {
				$merged_selector = $new_selector .
					( $has_pseudo && ! $current_state_has_selectors ? blockera_get_state_symbol( $pseudo_class ) . $pseudo_class : '' );

				if (! empty($root)) {
					// Set specificities for root selector.
					if ($is_global_style) {
						$origin_selector = ":root body :where($root)" . 
						( $has_parent_pseudo ? blockera_get_state_symbol( $parent_pseudo_class ) . $parent_pseudo_class : '' ) .
						( $needs_space ? ' ' : '' ) .
						$merged_selector;
					} else {
						$origin_selector = "html:root body :where($root)" . 
						( $has_parent_pseudo ? blockera_get_state_symbol( $parent_pseudo_class ) . $parent_pseudo_class : '' ) .
						( $needs_space ? ' ' : '' ) .
						$merged_selector;
					}
				} else {
					$origin_selector = ( $needs_space ? ' ' : '' ) . $merged_selector;
				}

				$formatted_selectors[] = blockera_create_standard_selector($new_selector, $pseudo_class, compact('merged_selector', 'origin_selector', 'has_pseudo'));
			}
		}

		return implode(', ', $formatted_selectors);
	}
}

if (! function_exists('blockera_create_standard_selector')) {
	/**
	 * Create standard css selector.
	 * If selector ends with a pseudo-class (:before or :after), combine it with the current state pseudo-class to create a valid CSS selector.
     * For example, an icon selector like "any:before" becomes "any:hover:before".
	 *
	 * @param string $selector The selector to create standard css selector.
	 * @param string $pseudo_state The pseudo state to create standard css selector.
	 * @param array  $args The extra arguments to create standard css selector. contains 'merged_selector' and 'origin_selector'.
	 *
	 * @return string the standard css selector.
	 */
	function blockera_create_standard_selector( string $selector, string $pseudo_state, array $args): string {

		$has_pseudo      = $args['has_pseudo'] ?? false;
		$merged_selector = $args['merged_selector'] ?? '';
		$origin_selector = $args['origin_selector'] ?? $args['merged_selector'] ?? '';

		if (preg_match('/:(before|after)$/', $selector, $matches) && $has_pseudo) {
			$pseudo_element = $matches[1];
			$selector       = str_replace($matches[0], '', $selector);
			$new_selector   = $selector . blockera_get_state_symbol( $pseudo_state ) . $pseudo_state . blockera_get_state_symbol( $pseudo_element ) . $pseudo_element;
			
			return str_replace($merged_selector, $new_selector, $origin_selector);
		}

		return $origin_selector;
	}
}

if ( ! function_exists( 'blockera_process_ampersand_selector_char' ) ) {

	/**
	 * Process ampersand selector character.
	 *
	 * @param string $selector The selector to process.
	 *
	 * @return string the processed selector.
	 */
	function blockera_process_ampersand_selector_char( string $selector ): string {

		// Remove the leading and trailing whitespace from the selector.
		// We imagine the selector is already trimmed. because it should be starts with single or double ampersand character.
		$selector = trim( $selector );

		// Handle && pattern.
		// It should be removed the double ampersand character and return the new selector.
		if (str_starts_with( $selector, '&&' )) {
			return substr( $selector, 2 );
		}

		// Handle & pattern.
		// It should be removed the ampersand character and return the new selector.
		return str_starts_with( $selector, '&' )
			? substr( $selector, 1 )
			: $selector;
	}
}

if ( ! function_exists( 'blockera_is_inner_block' ) ) {

	/**
	 * Check the current block is inner block?
	 *
	 * @param string $block_type the block type name.
	 *
	 * @return bool true on success, false on otherwise!
	 */
	function blockera_is_inner_block( string $block_type ): bool {

		return 'master' !== $block_type;
	}
}

if ( ! function_exists( 'blockera_update_dynamic_inner_selectors' ) ) {
	/**
	 * Update dynamic inner selectors.
	 *
	 * @param array $selectors The selectors to update.
	 * @param array $args The arguments to update the selectors.
	 *
	 * @return array the updated selectors.
	 */
	function blockera_update_dynamic_inner_selectors( array $selectors, array $args ): array {

		$additional_selectors     = blockera_get_block_type($args['block-type'])->selectors;
		$additional_root_selector = $additional_selectors['root'] ?? '';

		if (empty($additional_root_selector)) {

			$additional_root_selector = blockera_generate_block_root_selector($args['block-type']);
		}

		// Ensure the additional root selector is set.
		$additional_selectors['root'] = $additional_root_selector;

		// Create the inner selector id.
		$inner_selector_id = blockera_append_selector_prefix($args['block-type']);

		// If the inner selector id exists, merge the additional selectors with the existing selectors.
		// Otherwise, create a new inner selector id with the additional selectors.
		if (isset($selectors[ $inner_selector_id ])) {

			$selectors[ $inner_selector_id ] = array_merge($additional_selectors, $selectors[ $inner_selector_id ]);
		} else {

			$selectors[ $inner_selector_id ] = $additional_selectors;
		}

		return $selectors;
	}
}

if ( ! function_exists( 'blockera_get_compatible_block_css_selector' ) ) {

	/**
	 * Calculation suitable block css selector for related support identifier.
	 *
	 * @param array  $selectors  The mapped css selectors block related.
	 * @param string $feature_id The feature identifier.
	 * @param array  $args       The extra arguments {@type string | null $fallbackId The feature fallback identifier.}.
	 *
	 * @return string the css selector.
	 */
	function blockera_get_compatible_block_css_selector( array $selectors, string $feature_id, array $args ): string {

		$block_type = blockera_get_block_type( $args['block-name'] );

		if ($block_type) {
			// Clone block type to avoid mutating the original block type.
			$cloned_block_type = clone $block_type;
		}

		$current_state_has_selectors = false;

		if (blockera_is_inner_block($args['block-type']) && $args['block-type'] !== $args['block-name'] && blockera_is_valid_block_type($args['block-type'])) {

			$selectors = blockera_update_dynamic_inner_selectors($selectors, $args);
		}

		if ( ! empty( $args['block-type'] ) && isset($cloned_block_type) ) {

			if (blockera_is_inner_block( $args['block-type'] )) {

				$block_selector_id = blockera_append_selector_prefix($args['block-type']);

				if (! empty($args['inner-pseudo-class']) && ! blockera_is_normal_on_base_breakpoint($args['inner-pseudo-class'], $args['breakpoint'])) {

					// The inner block type selectors reference.
					// Only set the selectors if the pseudo class is valid.
					if (isset($selectors[ $block_selector_id ]) && blockera_is_valid_css_pseudo_class($args['inner-pseudo-class'])) {
						$selectors = $selectors[ $block_selector_id ];
					}

					$selector_id = blockera_append_selector_prefix( 'states/' . $args['inner-pseudo-class'] );

					// Fallback way to create selectors reference for inner block type in pseudo state.
					if (isset($selectors[ $selector_id ])) {

						$cloned_block_type->selectors = $selectors[ $selector_id ];
						$current_state_has_selectors  = true;
					} else {

						$selector_id = blockera_append_selector_prefix($args['block-type']);

						$cloned_block_type->selectors = $selectors[ $selector_id ] ?? $selectors;
					}
				} else {

					$selector_id = $block_selector_id;

					$cloned_block_type->selectors = $selectors[ $selector_id ] ?? $selectors;
				}
			} elseif (isset($args['pseudo-class']) && ! blockera_is_normal_on_base_breakpoint($args['pseudo-class'], $args['breakpoint'])) {

				$selector_id = blockera_append_selector_prefix( 'states/' . $args['pseudo-class'] );

				// Hard code for before and after pseudo classes.
				// If the pseudo class is before or after, and not set the specific selector config for them.
				// We should set the selectors to the root because them are not supported specific selector config per feature id.
				if (in_array($args['pseudo-class'], [ 'before', 'after' ], true)) {
					$cloned_block_type->selectors = $selectors[ $selector_id ] ?? ( isset($selectors['root']) ? [ 'root' => $selectors['root'] ] : [] );
				} else {
					$cloned_block_type->selectors = $selectors[ $selector_id ] ?? $selectors;
				}

				$current_state_has_selectors = isset($selectors[ $selector_id ]);
			}
		}

		$args['current_state_has_selectors'] = $current_state_has_selectors;

		// Calculate the fallback status.
		$has_fallback = ! empty( $args['fallback'] );
		// Check if the feature id contains 'htmlEditable'.
		$feature_is_html_editable = str_contains($feature_id, 'htmlEditable');

		// Ensure the block type is not null and the block type name starts with 'core/'.
		if (isset($cloned_block_type) && ( str_starts_with($block_type->name, 'core/') || isset($cloned_block_type->selectors['root']) )) {

			// By default, the fallback is calculated in $has_fallback variable while feature id does not 'htmlEditable'.
			// Because the htmlEditable feature id is used to generate the html editable selector.
			// And the html editable selector is not used to generate the css selector.
			// So we need to disable the fallback for the html editable feature id.
			$selector = wp_get_block_css_selector($cloned_block_type, $feature_id, ! $feature_is_html_editable ? ! $has_fallback : false);

			if (! $selector && $has_fallback && ! $feature_is_html_editable) {

				if ( is_array($args['fallback']) ) {
					// Try to get the first fallback that is not empty.
					foreach ($args['fallback'] as $fallback) {
						$selector = wp_get_block_css_selector($cloned_block_type, $fallback, false);

						if ($selector) {
							break;
						}
					}
				} else {
					$selector = wp_get_block_css_selector($cloned_block_type, $args['fallback'], true);
				}

				// If no fallback is found, try to get the feature id with fallback forced.
				if (! $selector) {
					$selector = wp_get_block_css_selector($cloned_block_type, $feature_id, true);
				}
			}
		}

		// If the feature is "htmlEditable" and no selector is found, return an empty string.
		if ($feature_is_html_editable && ! $selector) {
			return '';
		}

		// Imagine the current block is master!
		if ( ! empty( $args['block-type'] ) && ! blockera_is_inner_block( $args['block-type'] ) ) {

			// Re-Generate picked css selector to handle current block state!
			$selector = blockera_get_master_block_state_selector( $selector ?? $args['blockera-unique-selector'] ?? '', $args );
		} else {
			// We should create selector by :is() pseudo class.
			// if the selector id starts with 'blockera/core/' and the selector is not set in the parent block type selectors.
			// This is a special case for the core/paragraph block which is a required tag name as a fallback selector in pseudo class.
			if ( isset($selector_id) && str_starts_with($selector_id, 'blockera/core/') && ! isset($block_type->selectors[ $selector_id ])) {
				if ('core/paragraph' === $args['block-type']) {
					$selector = sprintf(':is(%s, p)', $selector);
				}
			}

			// Re-Generate picked css selector to handle current inner block state!
			$selector = blockera_get_inner_block_state_selector( $selector ?? '', $args );
		}

		// We not needs append blockera root block css selector into inners selector.
		// because it's already appended in the inner block selector.
		if (
			! $feature_id
			|| str_starts_with( $feature_id, 'blockera/' )
			|| ( ! empty( $args['block-type'] ) && blockera_is_inner_block( $args['block-type'] ) )
		) {

			return ! empty( $selector ) ? $selector : $args['blockera-unique-selector'];
		}

		$root = $args['blockera-unique-selector'];

		return blockera_append_root_block_css_selector(
			$selector,
			$root,
			[
				'root'=> $args['root'] ?? '',
				'block-type' => $args['block-type'],
				'is-global-style' => $args['is-global-style'] ?? false,
				'block-name' => str_replace( '/', '-', str_replace( 'core/', '', $args['block-name'] ) ),
				'full-block-name' => $args['block-name'],
			]
		);
	}
}

if ( ! function_exists( 'blockera_is_valid_css_pseudo_class' ) ) {
	/**
	 * Check if the pseudo class is valid.
	 *
	 * @param string $pseudo_class The pseudo class to check.
	 *
	 * @return bool true on success, false on otherwise!
	 */
	function blockera_is_valid_css_pseudo_class( string $pseudo_class ): bool {

		static $valid_pseudo_classes = null;

		if ( null === $valid_pseudo_classes ) {
			$valid_pseudo_classes = [
				// Pseudo-elements.
				'before'                => true,
				'after'                 => true,
				'first-letter'          => true,
				'first-line'            => true,
				'selection'             => true,
				'backdrop'              => true,
				'placeholder'           => true,
				'marker'                => true,
				'spelling-error'        => true,
				'grammar-error'         => true,
				'file-selector-button'  => true,
				// Pseudo-classes.
				'hover'                 => true,
				'active'                => true,
				'focus'                 => true,
				'focus-visible'         => true,
				'focus-within'          => true,
				'visited'               => true,
				'link'                  => true,
				'target'                => true,
				'target-within'         => true,
				'scope'                 => true,
				'current'               => true,
				'past'                  => true,
				'future'                => true,
				'playing'               => true,
				'paused'                => true,
				'seeking'               => true,
				'buffering'             => true,
				'stalled'               => true,
				'muted'                 => true,
				'volume-locked'         => true,
				'autofill'              => true,
				'enabled'               => true,
				'disabled'              => true,
				'read-only'             => true,
				'read-write'            => true,
				'placeholder-shown'     => true,
				'default'               => true,
				'checked'               => true,
				'indeterminate'         => true,
				'blank'                 => true,
				'valid'                 => true,
				'invalid'               => true,
				'in-range'              => true,
				'out-of-range'          => true,
				'required'              => true,
				'optional'              => true,
				'user-valid'            => true,
				'user-invalid'          => true,
				'root'                  => true,
				'empty'                 => true,
				'first-child'           => true,
				'last-child'            => true,
				'only-child'            => true,
				'first-of-type'         => true,
				'last-of-type'          => true,
				'only-of-type'          => true,
				'nth-child'             => true,
				'nth-last-child'        => true,
				'nth-of-type'           => true,
				'nth-last-of-type'      => true,
				'nth-col'               => true,
				'nth-last-col'          => true,
				'is'                    => true,
				'not'                   => true,
				'where'                 => true,
				'has'                   => true,
				'dir'                   => true,
				'lang'                  => true,
				'any-link'              => true,
				'local-link'            => true,
				'host'                  => true,
				'host-context'          => true,
				'fullscreen'            => true,
				'modal'                 => true,
				'picture-in-picture'    => true,
				'popover-open'          => true,
				'defined'               => true,
				'left'                  => true,
				'right'                 => true,
			];
		}

		return isset( $valid_pseudo_classes[ $pseudo_class ] );
	}
}

if ( ! function_exists( 'blockera_append_css_selector_suffix' ) ) {

	/**
	 * Concat block css selector with suffix.
	 *
	 * @param string $selector The css selector.
	 * @param string $suffix   The suffix string to concat with received selector.
	 *
	 * @return string the css selector.
	 */
	function blockera_append_css_selector_suffix( string $selector, string $suffix ): string {

		$selector_trimmed = trim( $selector );
        $suffix_trimmed   = trim( $suffix );

        if ( '' === $selector_trimmed || '' === $suffix_trimmed ) {

            return $selector;
        }

        $selectors = explode( ',', $selector_trimmed );
        $result    = [];

        foreach ( $selectors as $item ) {

            $result[] = trim( $item ) . $suffix_trimmed;
        }

        return implode( ', ', $result );
    }
}

if ( ! function_exists( 'blockera_is_pseudo_only_block_selector' ) ) {

	/**
	 * Check whether a selector is pseudo-only (no block class compound).
	 *
	 * @param string $selector The css selector.
	 *
	 * @return bool
	 */
	function blockera_is_pseudo_only_block_selector( string $selector ): bool {

		if ( preg_match( '/\.\bwp-block-/', $selector ) ) {
			return false;
		}

		return (bool) preg_match( '/^[\s>+~]*(?:::|:)/', $selector );
	}
}

if ( ! function_exists( 'blockera_get_block_name_segments' ) ) {

	/**
	 * Build progressively shorter block name segments for smart wp-block matching.
	 *
	 * Example: `list-item` => [ 'list-item', 'list' ].
	 *
	 * @param string $block_name The block type slug (without `core/`).
	 *
	 * @return string[] Ordered from most specific to least specific.
	 */
	function blockera_get_block_name_segments( string $block_name ): array {

		$segments = [ $block_name ];
		$parts    = explode( '-', $block_name );

		while ( count( $parts ) > 1 ) {
			array_pop( $parts );
			$segments[] = implode( '-', $parts );
		}

		return $segments;
	}
}

if ( ! function_exists( 'blockera_get_block_css_part_pattern' ) ) {

	/**
	 * Build a regex pattern for a wp-block class part segment.
	 *
	 * @param string $block_name_segment The block name segment.
	 *
	 * @return string The regex pattern.
	 */
	function blockera_get_block_css_part_pattern( string $block_name_segment ): string {

		return '/\.\b' . preg_quote( 'wp-block-' . $block_name_segment, '/' ) . '\b(?!\w+|-|_)/';
	}
}

if ( ! function_exists( 'blockera_resolve_block_css_part' ) ) {

	/**
	 * Resolve the wp-block class part for the current block type.
	 *
	 * Tries the full block name first, then shorter hyphen segments so blocks like
	 * `core/list-item` can match `.wp-block-list` inside `.wp-block-list > li`.
	 *
	 * Performance: hot path during style-engine selector building. Profiling showed
	 * nearly all time in `preg_match` (pattern rebuilt via `preg_quote` per segment).
	 * We use `strpos` + an ASCII boundary check (equivalent to the old regex) and
	 * request-level static caches for segments and resolved results.
	 *
	 * Flow:
	 * 1. Search `$selector` for `.wp-block-{segment}` (most-specific segment first).
	 * 2. If not found and the selector is pseudo-only (`::marker`, `::before`, …),
	 *    fall back to `$root` then `$args['root']` — those carry the real wp-block class.
	 *
	 * @param string $selector The prepared support selector.
	 * @param string $root     The blockera unique root selector.
	 * @param array  $args     The append arguments.
	 *
	 * @return string|null The resolved block class part, or null when not found.
	 */
	function blockera_resolve_block_css_part( string $selector, string $root, array $args ): ?string {

		// Per-request memoization: same selector/root/block combo repeats often while
		// generating CSS for many supports/states on one block.
		static $result_cache   = [];
		static $segments_cache = [];

		$block_name = $args['block-name'] ?? '';

		if ( '' === trim( $block_name ) ) {
			return null;
		}

		$args_root = $args['root'] ?? '';
		$cache_key = $selector . "\0" . $root . "\0" . $block_name . "\0" . $args_root;

		if ( isset( $result_cache[ $cache_key ] ) ) {
			return $result_cache[ $cache_key ];
		}

		// e.g. list-item → [ 'list-item', 'list' ]; cached so we don't rebuild per call.
		if ( ! isset( $segments_cache[ $block_name ] ) ) {
			$segments_cache[ $block_name ] = blockera_get_block_name_segments( $block_name );
		}

		$segments = $segments_cache[ $block_name ];

		// Phase 1: search the support selector. Phase 2 (pseudo-only only): search roots.
		$haystacks = [ $selector ];

		/*
		 * Equivalent to `/\.\bwp-block-{segment}\b(?!\w+|-|_)/` without the regex engine:
		 * find `.wp-block-{segment}`, then require the next char is NOT ASCII alnum, '-',
		 * or '_' so `.wp-block-list` does not false-match inside `.wp-block-list-item`.
		 */
		for ( $phase = 0; $phase < 2; $phase++ ) {
			foreach ( $segments as $segment ) {
				$needle = '.wp-block-' . $segment;
				$len    = strlen( $needle );

				foreach ( $haystacks as $haystack ) {
					$offset = 0;
					$pos    = strpos( $haystack, $needle, $offset );

					while ( false !== $pos ) {
						$end = $pos + $len;

						// End of string ⇒ valid class-part boundary.
						if ( ! isset( $haystack[ $end ] ) ) {
							$result_cache[ $cache_key ] = $needle;

							return $needle;
						}

						$ord = ord( $haystack[ $end ] );

						// Still inside a longer token (e.g. list→list-item) ⇒ keep searching.
						if (
							( $ord >= 48 && $ord <= 57 )
							|| ( $ord >= 65 && $ord <= 90 )
							|| ( $ord >= 97 && $ord <= 122 )
							|| 45 === $ord
							|| 95 === $ord
						) {
							$offset = $pos + 1;
							$pos    = strpos( $haystack, $needle, $offset );
							continue;
						}

						$result_cache[ $cache_key ] = $needle;

						return $needle;
					}
				}
			}

			// After phase 1 miss: only pseudo-only selectors may borrow the wp-block class
			// from the blockera root or the block-type root (e.g. `.wp-block-list > li`).
			if ( 0 === $phase ) {
				if ( ! blockera_is_pseudo_only_block_selector( $selector ) ) {
					$result_cache[ $cache_key ] = null;

					return null;
				}

				$haystacks = [];

				if ( '' !== trim( $root ) ) {
					$haystacks[] = $root;
				}

				if ( '' !== trim( $args_root ) ) {
					$haystacks[] = $args_root;
				}

				if ( [] === $haystacks ) {
					$result_cache[ $cache_key ] = null;

					return null;
				}
			}
		}

		$result_cache[ $cache_key ] = null;

		return null;
	}
}

if ( ! function_exists( 'blockera_get_prefer_source_for_block_part' ) ) {

	/**
	 * Pick the variation-free source selector for pseudo-only block part merging.
	 *
	 * Priority:
	 * 1. Blockera root without variations when it already contains the resolved wp-block part.
	 * 2. Block type root from `$args['root']` without variations (e.g. `.wp-block-list > li`).
	 * 3. Blockera root without variations as a fallback.
	 *
	 * Non pseudo-only selectors are returned unchanged.
	 *
	 * @param string $selector   The prepared support selector.
	 * @param string $root       The blockera unique root selector.
	 * @param string $block_part The resolved wp-block class part.
	 * @param array  $args       The append arguments.
	 *
	 * @return string
	 */
	function blockera_get_prefer_source_for_block_part( string $selector, string $root, string $block_part, array $args ): string {

		if ( ! blockera_is_pseudo_only_block_selector( $selector ) ) {
			return $selector;
		}

		$root_without_variations = \Blockera\Utils\Utils::stripBlockVariationClasses(
			\Blockera\Utils\Utils::stripTrailingPseudos( $root )
		);

		if ( '' !== trim( $root ) && str_contains( $root, $block_part ) ) {
			return $root_without_variations;
		}

		$block_type_root = $args['root'] ?? '';

		if ( '' !== trim( $block_type_root ) && str_contains( $block_type_root, $block_part ) ) {
			return \Blockera\Utils\Utils::stripBlockVariationClasses(
				\Blockera\Utils\Utils::stripTrailingPseudos( $block_type_root )
			);
		}

		return $root_without_variations;
	}
}

if ( ! function_exists( 'blockera_root_contains_block_part' ) ) {

	/**
	 * Check whether a root selector already includes a resolved wp-block class part.
	 *
	 * @param string $root       The root selector.
	 * @param string $block_part The resolved wp-block class part.
	 *
	 * @return bool
	 */
	function blockera_root_contains_block_part( string $root, string $block_part ): bool {

		return '' !== trim( $root ) && '' !== trim( $block_part ) && str_contains( $root, $block_part );
	}
}

if ( ! function_exists( 'blockera_compound_root_classes_on_wrapper' ) ) {

	/**
	 * Whether Blockera unique classes live on the wrapper (first compound) of a `>` root.
	 *
	 * Blocks like core/table use `.wp-block-table > table` for visual styles but render
	 * `className` on the figure (`.wp-block-table`), with spacing selectors targeting that wrapper.
	 * core/list-item is the opposite: classes belong on the last compound (`li`).
	 *
	 * @param array $args The append arguments (expects `root` block-type root and `block-name`).
	 *
	 * @return bool
	 */
	function blockera_compound_root_classes_on_wrapper( array $args ): bool {

		$block_type_root = trim( (string) ( $args['root'] ?? '' ) );

		if ( ! preg_match( '/\s>\s/', $block_type_root ) ) {
			return false;
		}

		$block_name = (string) ( $args['full-block-name'] ?? $args['block-name'] ?? '' );

		if ( '' === $block_name ) {
			return false;
		}

		if ( ! str_contains( $block_name, '/' ) ) {
			$block_name = 'core/' . $block_name;
		}

		$wrapper_parts = preg_split( '/\s>\s/', $block_type_root, 2 );
		$wrapper       = trim( (string) ( $wrapper_parts[0] ?? '' ) );

		if ( '' === $wrapper ) {
			return false;
		}

		$selectors          = blockera_get_block_type_property( $block_name, 'selectors' ) ?? [];
		$spacing_candidates = [];

		if ( isset( $selectors['spacing'] ) ) {
			$spacing_candidates[] = is_array( $selectors['spacing'] )
				? ( $selectors['spacing']['root'] ?? '' )
				: $selectors['spacing'];
		}

		if ( isset( $selectors['blockeraBoxSpacing'] ) ) {
			$spacing_candidates[] = is_array( $selectors['blockeraBoxSpacing'] )
				? ( $selectors['blockeraBoxSpacing']['root'] ?? '' )
				: $selectors['blockeraBoxSpacing'];
		}

		foreach ( $spacing_candidates as $candidate ) {
			if ( is_string( $candidate ) && trim( $candidate ) === $wrapper ) {
				return true;
			}
		}

		return false;
	}
}

if ( ! function_exists( 'blockera_append_root_block_css_selector' ) ) {

	/**
	 * Appending blockera block root css selector inside received selector.
	 *
	 * @param string $selector The received block css selector.
	 * @param string $root     The root block css selector.
	 * @param array  $args     The arguments {@type string $block -name The block type name}.
	 *
	 * @return string the combined block prepared css selector with root.
	 */
	function blockera_append_root_block_css_selector( string $selector, string $root, array $args = [] ): string {

		// Assume received selector is invalid.
		if ( empty( trim( $selector ) ) ) {

			return $root;
		}

		$wrap_with_global_style = static function ( string $selector ) use ( $args, $root ) {
			if (isset($args['is-global-style']) && $args['is-global-style']) {
				return ":root body :where($root)";
			}

			return $selector;
		};

		// We should remove the ampersand character from beginning of the selector if it exists, because it's a indicate root selector and we provided it in next process.
		if (preg_match( '/^&[^\s|^&]/', $selector )) {
			
			$selector = substr( $selector, 1 );
		}

		// If root is the same as selector or selector contains root string, we should remove the root.
		if ($root === $selector || str_contains($selector, $root)) {

			$root = '';
		}

		$is_child_selector = false;

		// Check if selector is a child of root.
		if ( preg_match( '/^\s|[\s>+~]/', $selector ) ) {

			$is_child_selector = true;
		}

		$variations              = \Blockera\Utils\Utils::extractBlockVariationClasses( $root );
		$block_part              = blockera_resolve_block_css_part( $selector, $root, $args );
		$is_pseudo_only_selector = blockera_is_pseudo_only_block_selector( $selector );

		// Assume received selector is another reference to root, so we should concat together.
		if ( null !== $block_part ) {
			$resolved_block_part = $block_part;
			$prefer_source       = blockera_get_prefer_source_for_block_part( $selector, $root, $block_part, $args );
			$preferred_root      = null;

			/*
			 * Pseudo-only selectors (e.g. `::marker`, `::before`) have no wp-block compound of their own.
			 *
			 * 1. Pick a variation-free preferred root via blockera_get_prefer_source_for_block_part().
			 * 2. When variations exist, re-append them on the full preferred root (not only the resolved
			 *    wp-block class segment). Example: `.wp-block-list > li.is-style-x`, not `.wp-block-list.is-style-x > li` when the $is_pseudo_only_selector is true.
			 * 3. If the blockera root already contains the resolved wp-block part, the varied preferred root
			 *    is final. Otherwise compound child selectors append the root on the last compound (list-item);
			 *    simple selectors merge the blockera prefix via modifySelectorPos().
			 * 4. Without variations, preferContainedRootSelector() handles roots that already contain the target.
			 */
			if ( $is_pseudo_only_selector && ! empty( $variations ) ) {
				$prefer_source = \Blockera\Utils\Utils::appendVariationsToSelector(
					$prefer_source,
					$prefer_source,
					$variations
				);
				$variations    = [];

				if ( blockera_root_contains_block_part( $root, $resolved_block_part ) ) {
					$preferred_root = $prefer_source;
				}
			} else {
				$preferred_root = \Blockera\Utils\Utils::preferContainedRootSelector(
					$prefer_source,
					$root,
					$block_part,
					[
						'wrap' => $wrap_with_global_style,
					]
				);
			}

			if ( null !== $preferred_root ) {
				return $is_pseudo_only_selector ? $preferred_root . $selector : $preferred_root;
			}

			/*
			 * Compound selectors with a direct child combinator (`>`).
			 *
			 * - core/list-item (`.wp-block-list > li`): classes live on the child `li`.
			 * - core/table (`.wp-block-table > table`): classes live on the wrapper figure.
			 */
			if ( preg_match( '/\s>\s/', $prefer_source ) ) {
				/*
				 * Pseudo-only selectors (e.g. `::marker`): prefer_source may already include variation
				 * classes while $root carries them too — use the block-type compound root as base.
				 */
				$compound_source = $prefer_source;
				if (
					$is_pseudo_only_selector
					&& isset( $args['root'] )
					&& preg_match( '/\s>\s/', (string) $args['root'] )
				) {
					$compound_source = (string) $args['root'];
				}

				if ( blockera_compound_root_classes_on_wrapper( $args ) ) {
					$merged_selector = $wrap_with_global_style(
						\Blockera\Utils\Utils::modifySelectorPos(
							$prefer_source,
							$resolved_block_part,
							[
								'prefix'     => $root,
								'suffix'     => '',
								'variations' => $variations,
							]
						)
					);

					return $is_pseudo_only_selector ? $merged_selector . $selector : $merged_selector;
				}

				$parts         = preg_split( '/(?:::|:)/', $compound_source, 2 );
				$base          = $parts[0];
				$inline_pseudo = isset( $parts[1] )
					? ( str_contains( $compound_source, '::' ) ? '::' : ':' ) . $parts[1]
					: '';

				$merged_selector = $wrap_with_global_style( "{$base}{$root}" ) . $inline_pseudo;

				return $is_pseudo_only_selector ? $merged_selector . $selector : $merged_selector;
			}

			$merged_selector = $wrap_with_global_style(
				\Blockera\Utils\Utils::modifySelectorPos(
					$prefer_source,
					$resolved_block_part,
					[
						'prefix'     => $root,
						'suffix'     => '',
						'variations' => $variations,
					]
				)
			);

			return $is_pseudo_only_selector ? $merged_selector . $selector : $merged_selector;
		}

		// Handle cases where selector and root are identical or when dealing with inner blocks.
		if ( $selector === $root || blockera_is_inner_block( $args['block-type'] ) ) {

			// If a custom root is provided in args, replace it with the combined root selectors and should not start with a space because it's a child selector and we should not add it before the root.
			if (isset($args['root']) && ! str_starts_with($args['root'], ' ')) {

				// Replace the custom root with itself plus the standard root selector.
				return $wrap_with_global_style( str_replace($args['root'], "{$args['root']}{$root}", $selector) );
			}

			// Return selector unchanged if no custom root.
			return $wrap_with_global_style("{$root} {$selector}");
		}

		// If selector is a child of root or starts with a tag name and should not start with a space because it's a child selector and we should not add it before the root.
		if (! str_starts_with($selector, ' ') && ( $is_child_selector || preg_match( '/^[a-z]/', $selector ) )) {

			// If selector contains pseudo-classes or combinators, keep them intact and append root.
			$parts  = preg_split('/(?:::|:)/', $selector, 2);
			$base   = $parts[0];
			$pseudo = isset($parts[1]) ? ( strpos($selector, '::') !== false ? '::' : ':' ) . $parts[1] : '';

			// If the style is global style for block, we should append the selector to the root body for specificity reasons.
			if (isset($args['is-global-style']) && $args['is-global-style']) {
				return "{$wrap_with_global_style($root)}{$pseudo}";
			}
			
			// Return selector with root for block level style.
			return "{$wrap_with_global_style("{$base}{$root}")}{$pseudo}";
		}

		// If root contains selector, we should return the root.
		if ( str_contains( $root, $selector ) ) {
			return $wrap_with_global_style($root);
		}

		// If selector started with dot or any other classname of child elements, we imagine it's other classname of root or child of root.
		return $wrap_with_global_style("{$root}{$selector}");
	}
}

if ( ! function_exists( 'blockera_get_shorthand_css' ) ) {

	/**
	 * Retrieve the converted long css to shorthand css string.
	 *
	 * @param string $longCss The long css string.
	 *
	 * @return string The shorthanded css.
	 */
	function blockera_get_shorthand_css( string $longCss = '' ): string {

		$supportedProperty = [ 'margin', 'padding' ];
		$properties        = [];
		$shorthandCss      = '';
		$cssRules          = explode( ';', $longCss );

		foreach ( $cssRules as $cssRule ) {

			$cleanupCssRule = trim( $cssRule );

			if ( empty( $cleanupCssRule ) ) {

				continue;
			}

			$parsedCssRule = explode( ':', $cleanupCssRule );

			if ( count( $parsedCssRule ) < 2 ) {

				continue;
			}

			list( $property, $value ) = $parsedCssRule;

			list( $support, $subProperty ) = explode( '-', $property );

			if ( ! in_array( $support, $supportedProperty, true ) ) {

				continue;
			}

			if ( str_contains( $value, '!important' ) ) {

				$properties[ $support ]['important'] = true;
				$value                               = str_replace( '!important', '', $value );
			}

			if ( ! empty( $properties[ $support ] ) ) {

				$properties[ $support ] = array_merge(
					$properties[ $support ],
					[
						$subProperty => $value,
					]
				);

				continue;
			}

			$properties[ $support ] = [
				$subProperty => $value,
			];
		}

		$lastItem = array_key_last( $properties );

		foreach ( $properties as $property => $value ) {

			$whiteSpace = $lastItem === $property ? '' : ' ';

			$shorthandCss = sprintf(
				'%1$s%2$s: %3$s %4$s %5$s %6$s%7$s;%8$s',
				$shorthandCss,
				trim( $property ),
				trim( $value['top'] ?? '0' ),
				trim( $value['right'] ?? '0' ),
				trim( $value['bottom'] ?? '0' ),
				trim( $value['left'] ?? '0' ),
				empty( $value['important'] ) ? '' : ' !important',
				$whiteSpace,
			);
		}

		return $shorthandCss;
	}
}

if ( ! function_exists( 'blockera_combine_css' ) ) {

	/**
	 * Get combined css with receive complex css.
	 *
	 * @param array $css the complex css.
	 *
	 * @return array the flat css array to combined of css selectors and declarations.
	 */
	function blockera_combine_css( array $css ): array {

		$combinedCss = [];

		if ( empty( $css ) ) {

			return $combinedCss;
		}

		foreach ( $css as $generatedCss ) {

			foreach ( $generatedCss as $selector => $declarations ) {

				if ( ! empty( $combinedCss[ $selector ] ) ) {

					$combinedCss[ $selector ] = array_merge( $combinedCss[ $selector ], $declarations );

					continue;
				}

				$combinedCss[ $selector ] = $declarations;
			}
		}

		return $combinedCss;
	}
}

if ( ! function_exists( 'blockera_convert_css_declarations_to_css_valid_rules' ) ) {

	/**
	 * Convert array css rules to valid css rules list.
	 *
	 * @param array $css the css stack contains each item selector as key and css declarations as value.
	 *
	 * @return array the converted css rules.
	 */
	function blockera_convert_css_declarations_to_css_valid_rules( array $css ): array {

		$validCssRules = [];

		foreach ( $css as $selector => $declaration ) {

			// Imagine empty declaration, skip that.
			if ( is_array( $declaration ) && empty( $declaration ) ) {

				continue;
			}

			foreach ( $declaration as $property => $value ) {

				if ( is_array($value) || ( empty( trim($value) ) && '0' !== $value ) || is_int( $property ) || empty( trim($property) ) ) {

					continue;
				}

				if ( empty( $validCssRules[ $selector ] ) ) {

					$validCssRules[ $selector ] = sprintf( '%s: %s;', $property, $value );

					continue;
				}

				// value validating ...
				if ( is_array( $validCssRules[ $selector ] ) ) {

					continue;
				}

				$validCssRules[ $selector ] = sprintf( '%1$s%2$s: %3$s;', $validCssRules[ $selector ], $property, $value );
			}
		}

		return $validCssRules;
	}
}

if ( ! function_exists( 'blockera_get_normalized_selector' ) ) {

	/**
	 * Get normalized selector.
	 *
	 * @param string $selector the target css selector.
	 *
	 * @return string the normalized css selector.
	 */
	function blockera_get_normalized_selector( string $selector ): string {
		$selectors = explode( ' ', $selector );
		$result    = '';
		$count     = count( $selectors );
		
		for ( $i = 0; $i < $count; $i++ ) {
			$_selector = $selectors[ $i ];
			
			// Ignore external selectors (early exit for performance).
			if ( false === strpos( $_selector, 'blockera-block' ) ) {
				continue;
			}
			
			$_selector = trim( $_selector );
			
			// Empty after trim, skip.
			if ( '' === $_selector ) {
				continue;
			}
			
			// Add dot prefix if not present.
			if ( '.' !== $_selector[0] ) {
				$result .= '.' . $_selector;
			} else {
				$result .= $_selector;
			}
		}
		
		return $result;
	}
}

if ( ! function_exists( 'blockera_get_base_breakpoint' ) ) {

	/**
	 * Get blockera base breakpoint from entities or config.
	 *
	 * Optimized to use in-memory entities first to avoid database reads.
	 * Falls back to config if entities are not available.
	 * 
	 * FIXME: refactor this function to solve base breakpoint with read of database.
	 *
	 * @return string the base breakpoint name.
	 */
	function blockera_get_base_breakpoint(): string {

		// Static cache to avoid repeated processing.
		static $cached_base_breakpoint = null;

		if ( null !== $cached_base_breakpoint ) {

			return $cached_base_breakpoint;
		}

		$base_breakpoint = null;
		$breakpoints     = blockera_core_config( 'breakpoints' );

		if ( ! empty( $breakpoints['base'] ) && is_string( $breakpoints['base'] ) ) {

			// Fast path: base is directly specified as string.
			$base_breakpoint = $breakpoints['base'];

		} elseif ( ! empty( $breakpoints['list'] ) && is_array( $breakpoints['list'] ) ) {

			// Search through list for base breakpoint.
			foreach ( $breakpoints['list'] as $breakpoint ) {

				if ( ! empty( $breakpoint['base'] ) && ! empty( $breakpoint['status'] ) && ! empty( $breakpoint['type'] ) ) {

					$base_breakpoint = $breakpoint['type'];
					break;
				}
			}
		}

		// Fallback to default if not found.
		$cached_base_breakpoint = $base_breakpoint ? $base_breakpoint : 'desktop';

		return $cached_base_breakpoint;
	}
}

if ( ! function_exists( 'blockera_is_normal_on_base_breakpoint' ) ) {

	/**
	 * Is normal state on base breakpoint?
	 *
	 * @return bool true on success, false on failure.
	 */
	function blockera_is_normal_on_base_breakpoint( string $current_state, $current_breakpoint ): bool {

		return 'normal' === $current_state && blockera_get_base_breakpoint() === $current_breakpoint;
	}
}

if (! function_exists('blockera_get_available_block_supports')) {

	/**
	 * Get all available block supports.
	 *
	 * Loads JSON schemas from editor block-supports directory, skips entries without
	 * a title, merges icon supports, and memoizes the final payload for the request.
	 *
	 * @return array the block supports.
	 */
	function blockera_get_available_block_supports(): array {
		// Static cache to avoid repeated file I/O and JSON parsing within the same request.
		static $cached_supports = null;

		if ( null !== $cached_supports ) {
			return $cached_supports;
		}

		$supports = [];
		$dir      = blockera_core_config( 'app.vendor_path' ) . 'blockera/editor/js/schemas/block-supports';
		$entries  = [];

		// opendir/readdir avoids glob() pattern compilation; sort keeps glob()-stable order.
		$handle = opendir( $dir );

		if ( $handle ) {
			$entry = readdir( $handle );

			while ( false !== $entry ) {
				if ( isset( $entry[0] ) && '.' !== $entry[0] && str_ends_with( $entry, '-block-supports-list.json' ) ) {
					$entries[] = $entry;
				}

				$entry = readdir( $handle );
			}

			closedir( $handle );
		}

		if ( $entries ) {
			sort( $entries, SORT_STRING );

			foreach ( $entries as $entry ) {
				// Direct read beats ob_start()/require for static JSON data files.
				$raw = file_get_contents( $dir . '/' . $entry );

				if ( false === $raw ) {
					continue;
				}

				$support = json_decode( $raw, true );

				// Skip invalid JSON / entries without a usable title key.
				if ( ! is_array( $support ) || empty( $support['title'] ) ) {
					continue;
				}

				$supports[ $support['title'] ] = $support;
			}
		}

		// Cache the final payload (including icon) so warm hits stay consistent.
		$cached_supports = blockera_add_icon_block_supports( $supports );

		return $cached_supports;
	}
}

if (! function_exists('blockera_get_block_supports_by_category')) {

	/**
	 * Get block supports by category.
	 *
	 * @param string $category the category name.
	 *
	 * @return array the block supports.
	 */
	function blockera_get_block_supports_by_category( string $category): array {

		$category = \Blockera\Utils\Utils::kebabCase( $category );

		return blockera_get_available_block_supports()[ $category ]['supports'];
	}
}

if ( ! function_exists( 'blockera_get_block_support' ) ) {

	/**
	 * Retrieve available block support properties by name.
	 *
	 * @param string $support_category the block support category name.
	 * @param string $name             the block support name.
	 * @param string $property         the block support property. default is empty.
	 *
	 * @return mixed The available block supports list as array, or string, boolean on success, null while failure!
	 */
	function blockera_get_block_support( string $support_category, string $name = '', string $property = '' ) {

		$supports = blockera_get_block_supports_by_category( $support_category);

		if ( empty( $supports ) || ! isset( $supports[ $name ] ) ) {

			return null;
		}

		$available_support = $supports[ $name ];

		if ( ! empty( $property ) && ! empty( $available_support[ $property ] ) ) {

			return $available_support[ $property ];
		}

		return $available_support;
	}
}

if ( ! function_exists( 'blockera_get_sanitize_block_attributes' ) ) {

	/**
	 * Retrieve sanitized block attributes.
	 *
	 * @param array $attributes the block attributes.
	 *
	 * @return array the sanitized block attributes.
	 */
	function blockera_get_sanitize_block_attributes( array $attributes ): array {

		$result = [];

		foreach ( $attributes as $key => $attribute ) {
			// Maintain exact behavior: check is_array() first, then isset() for 'value' key.
			$result[ $key ] = ( is_array( $attribute ) && isset( $attribute['value'] ) ) ? $attribute['value'] : $attribute;
		}
		
		return $result;
	}
}

if ( ! function_exists( 'blockera_is_wp_block_child_class' ) ) {

	/**
	 * Check if the block has a wp-block-child class.
	 *
	 * @param string $block_classname the block class name.
	 *
	 * @return bool true if the block has a wp-block-child class, false otherwise.
	 */
	function blockera_is_wp_block_child_class( string $block_classname ): bool {

		return preg_match('/wp-block-[a-zA-Z0-9-]+__[a-zA-Z0-9-]+/i', $block_classname);
	}
}

if (! function_exists('blockera_sort_breakpoints')) {

	/**
	 * Sorts breakpoints to ensure correct CSS media query priority for a desktop-first approach.
	 * The sorting order is:
	 * 1. The `base` breakpoint (which has no min/max).
	 * 2. Breakpoints with `max` width (for smaller screens), sorted largest to smallest.
	 * 3. Breakpoints with `min` width (for larger screens), sorted smallest to largest.
	 *
	 * @param array $breakpoints - The array containing breakpoint definitions.
	 * @return array An array of breakpoint objects sorted for CSS generation.
	 */
	function blockera_sort_breakpoints( array $breakpoints): array {
		// Helper function to parse a pixel value string (e.g., "1920px") into an integer.
		$parsePx = function ( $value) {
			return (int) preg_replace('/[^0-9]/', '', $value) ? (int) preg_replace('/[^0-9]/', '', $value) : 0;
		};

		// Convert the breakpoints array into a sortable array.
		$breakpointsArray = array_values($breakpoints);

		// Sort the array using a custom comparison function.
		usort(
            $breakpointsArray,
            function ( $a, $b) use ( $parsePx) {
				$aIsMin  = ! empty($a['settings']['min']);
				$bIsMin  = ! empty($b['settings']['min']);
				$aIsBase = empty($a['settings']['min']) && empty($a['settings']['max']);
				$bIsBase = empty($b['settings']['min']) && empty($b['settings']['max']);

				// Assign a group number to each breakpoint to control the primary sort order.
				// Group 1: The single `base` breakpoint (no min/max).
				// Group 2: `max-width` breakpoints (for smaller screens).
				// Group 3: `min-width` breakpoints (for larger screens).
				$aGroup = $aIsBase ? 1 : ( $aIsMin ? 3 : 2 );
				$bGroup = $bIsBase ? 1 : ( $bIsMin ? 3 : 2 );

				// If the breakpoints are in different groups, sort by the group number (1, then 2, then 3).
				if ($aGroup !== $bGroup) {
					return $aGroup - $bGroup;
				}

				// If the breakpoints are in the same group, get their pixel values.
				$aValue = $parsePx($a['settings']['min'] ?? $a['settings']['max'] ?? '');
				$bValue = $parsePx($b['settings']['min'] ?? $b['settings']['max'] ?? '');

				// For 'max-width' breakpoints (Group 2), sort descending (largest size first).
				if (2 === $aGroup) {
					return $bValue - $aValue;
				}

				// For 'min-width' breakpoints (Group 3), sort ascending (smallest size first).
				if (3 === $aGroup) {
					return $aValue - $bValue;
				}

				// No sorting needed for the base group as it only has one item.
				return 0;
			}
        );

		return $breakpointsArray;
	}
}

if (! function_exists('blockera_is_valid_block_type')) {

	/**
	 * Check if the block type is registered.
	 *
	 * @param string $block_type the block type.
	 *
	 * @return bool true if the block type is valid, false otherwise.
	 */
	function blockera_is_valid_block_type( string $block_type ): bool {

		return (bool) blockera_get_block_type($block_type);
	}
}

if (! function_exists('blockera_generate_block_root_selector')) {

	/**
	 * Generate block root selector.
	 *
	 * @param string $block_type the block type.
	 *
	 * @return string the block root selector.
	 */
	function blockera_generate_block_root_selector( string $block_type ): string {

		$prefix = '.wp-block-';

		return $prefix . str_replace('/', '-', str_replace('core/', '', $block_type));
	}
}
