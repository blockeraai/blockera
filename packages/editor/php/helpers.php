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

if ( ! function_exists( 'blockera_get_css_media_queries' ) ) {

	/**
	 * Get css media queries from configured breakpoints.
	 * 
	 * @param array $breakpoints The breakpoints.
	 *
	 * @return array
	 */
	function blockera_get_css_media_queries( array $breakpoints): array {

		$queries = [];

		foreach ( $breakpoints as $breakpoint ) {

			// skip invalid breakpoint.
			if ( empty( $breakpoint['type'] ) ) {

				continue;
			}

			[ 'min' => $min, 'max' => $max ] = $breakpoint['settings'];

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

		// Overriding selectors based on supported pseudo-class in css. Supported pseudo-classes with css: hover, active, visited, before, after.
		if ( $pseudo_class && 'normal' !== $pseudo_class ) {

			// Handle multiple selector where separated with comma.
			$parsedValue = explode( ',', trim( $selector ) );

			// Assume current selector is multiple.
			if ( count( $parsedValue ) > 1 ) {

				// Add pseudo custom css class as suffix into selectors value for current key.
				return implode(
					', ',
					array_map(
						static function ( string $item ) use ( $args, $parent_pseudo_class, $pseudo_class, $current_state_has_selectors ): string {

							return blockera_get_css_selector_format(
								$args['root'] ?? $args['blockera-unique-selector'] ?? '',
								trim( $item ),
								compact( 'pseudo_class', 'parent_pseudo_class', 'current_state_has_selectors' )
							);
						},
						$parsedValue
					)
				);

			} else {

				// Add pseudo custom css class as suffix into selectors value for current key.
				return blockera_get_css_selector_format(
					$args['root'] ?? $args['blockera-unique-selector'] ?? '',
					$selector,
					compact( 'pseudo_class', 'parent_pseudo_class', 'current_state_has_selectors' )
				);
			}
		}

		// inner block in normal state.
		if ( $master_block_state ) {

			// Add pseudo custom css class as suffix into selectors value for current key.
			return blockera_get_css_selector_format(
				$args['root'] ?? $args['blockera-unique-selector'] ?? '',
				$selector,
				compact( 'parent_pseudo_class', 'current_state_has_selectors' )
			);
		}

		return trim(
			sprintf( '%s %s', trim( $args['root'] ?? $args['blockera-unique-selector'] ?? '', ), $selector )
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
	 * @param string $root_selector   the root selector.
	 * @param string $picked_selector the picked selector.
	 * @param array  $args            the extra arguments to format css selector.
	 *
	 * @throws BaseException Exception for invalid selector.
	 * @return string the standard formatted css selector.
	 */
	function blockera_get_css_selector_format( string $root_selector, string $picked_selector, array $args ): string {

		if ( str_starts_with( $picked_selector, '&' ) && ! str_starts_with( $picked_selector, '&&' ) && ! preg_match( '/^\.|:/', substr( $picked_selector, 1 ) ) ) {

			throw new BaseException( "Invalid {$picked_selector} selector!", 500 );
		}

		$pseudo_class                = $args['pseudo_class'] ?? '';
		$parent_pseudo_class         = $args['parent_pseudo_class'] ?? '';
		$current_state_has_selectors = $args['current_state_has_selectors'] ?? false;
		// Pre-calculate reused values.
		$has_parent_pseudo = ! empty( $parent_pseudo_class );
		$has_pseudo        = ! empty( $pseudo_class );
		$root              = trim( $root_selector );
		$root_first_part   = '';
		
		// Get the first part of root selector for && pattern.
		if ( ! empty( $root ) ) {
			$root_parts      = explode( ' ', $root );
			$root_first_part = $root_parts[0];
		}
		
		$formatted_selectors = [];
		foreach (explode( ', ', $picked_selector ) as $selector) {
			$selector    = trim($selector);
			$needs_space = ! str_starts_with($selector, '&') && ! empty($root);
			
			// Handle && pattern.
			if ( str_starts_with( $selector, '&&' ) ) {
				$selector        = $root_first_part . substr( $selector, 2 );
				$merged_selector = $selector . 
					( $has_pseudo && ! $current_state_has_selectors ? blockera_get_state_symbol($pseudo_class) . $pseudo_class : '' );

				$formatted_selectors[] = blockera_create_standard_selector($selector, $pseudo_class, compact('merged_selector', 'has_pseudo'));
			} else {
				$merged_selector = blockera_process_ampersand_selector_char($selector) .
					( $has_pseudo && ! $current_state_has_selectors ? blockera_get_state_symbol( $pseudo_class ) . $pseudo_class : '' );

				$origin_selector = $root . 
					( $has_parent_pseudo ? blockera_get_state_symbol( $parent_pseudo_class ) . $parent_pseudo_class : '' ) .
					( $needs_space ? ' ' : '' ) .
					$merged_selector;

				$formatted_selectors[] = blockera_create_standard_selector($selector, $pseudo_class, compact('merged_selector', 'origin_selector', 'has_pseudo'));
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
			$selector       = blockera_process_ampersand_selector_char(str_replace($matches[0], '', $selector));
			$new_selector   = $selector . blockera_get_state_symbol( $pseudo_state ) . $pseudo_state . blockera_get_state_symbol( $pseudo_element ) . $pseudo_element;
			
			return str_replace($merged_selector, $new_selector, $origin_selector);
		}

		return $origin_selector;
	}
}

if ( ! function_exists( 'blockera_process_ampersand_selector_char' ) ) {

	/**
	 * Create standard css selector with processing by '&' character.
	 *
	 * @param string $selector The selector to process.
	 *
	 * @return string the processed selector.
	 */
	function blockera_process_ampersand_selector_char( string $selector ): string {

		return str_starts_with( trim( $selector ), '&' )
			? substr( trim( $selector ), 1 )
			: trim( $selector );
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

		if ( ! empty( $args['block-type'] ) && isset($cloned_block_type) ) {

			if (blockera_is_inner_block( $args['block-type'] )) {

				if (! empty($args['inner-pseudo-class']) && ! blockera_is_normal_on_base_breakpoint($args['inner-pseudo-class'], $args['breakpoint'])) {

					$selector_id = blockera_append_selector_prefix( 'states/' . $args['inner-pseudo-class'] );

					if (isset($selectors[ $selector_id ])) {

						$cloned_block_type->selectors = $selectors[ $selector_id ];
						$current_state_has_selectors  = true;
					} else {

						$selector_id = blockera_append_selector_prefix($args['block-type']);

						$cloned_block_type->selectors = $selectors[ $selector_id ] ?? $selectors;
					}
				} else {

					$selector_id = blockera_append_selector_prefix($args['block-type']);

					$cloned_block_type->selectors = $selectors[ $selector_id ] ?? $selectors;
				}
			} elseif (isset($args['pseudo-class']) && ! blockera_is_normal_on_base_breakpoint($args['pseudo-class'], $args['breakpoint'])) {

				$selector_id = blockera_append_selector_prefix( 'states/' . $args['pseudo-class'] );

				$cloned_block_type->selectors = $selectors[ $selector_id ] ?? $selectors;
				$current_state_has_selectors  = isset($selectors[ $selector_id ]);
			}
		}

		$args['current_state_has_selectors'] = $current_state_has_selectors;
		$has_fallback                        = ! empty( $args['fallback'] );

		// Ensure the block type is not null and the block type name starts with 'core/'.
		if (isset($cloned_block_type) && ( str_starts_with($block_type->name, 'core/') || isset($cloned_block_type->selectors['root']) )) {

			$selector = wp_get_block_css_selector($cloned_block_type, $feature_id, ! $has_fallback);

			if (! $selector && $has_fallback) {

				$selector = wp_get_block_css_selector($cloned_block_type, $args['fallback'], true);
			}
		}

		// Imagine the current block is master!
		if ( ! empty( $args['block-type'] ) && ! blockera_is_inner_block( $args['block-type'] ) ) {

			// Re-Generate picked css selector to handle current block state!
			$selector = blockera_get_master_block_state_selector( $selector ?? $args['blockera-unique-selector'] ?? '', $args );

		} else {

			// Re-Generate picked css selector to handle current inner block state!
			$selector = blockera_get_inner_block_state_selector( $selector ?? '', $args );
		}

		// We not needs append blockera root block css selector into inners selector.
		// Like => current $selector value is one of feature id of "elements/link" inner block selectors.
		if ( ! $feature_id || str_starts_with( $feature_id, 'blockera/' ) ) {

			return ! empty( $selector ) ? $selector : $args['blockera-unique-selector'];
		}

		return blockera_append_root_block_css_selector(
			$selector,
			$args['blockera-unique-selector'],
			[
				'root'=> $args['root'] ?? '',
				'block-type' => $args['block-type'],
				'block-name' => str_replace( '/', '-', str_replace( 'core/', '', $args['block-name'] ) ),
			]
		);
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

		if ( empty( trim( $selector ) ) || empty( trim( $suffix ) ) ) {

			return $selector;
		}

		$selectors = explode( ',', $selector );

		return implode(
			', ',
			array_map(
				function ( string $item ) use ( $suffix ): string {

					return trim( $item ) . $suffix;
				},
				$selectors
			)
		);
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

		// We should remove the ampersand character from beginning of the selector if it exists, because it's a indicate root selector and we provided it in next process.
		if (preg_match( '/^&[^\s|^&]/', $selector )) {
			
			$selector = substr( $selector, 1 );
		}

		$is_child_selector = false;

		// Check if selector is a child of root.
		if ( preg_match( '/^\s|[\s>+~]/', $selector ) ) {

			$is_child_selector = true;
		}

		$preg_quote = preg_quote( $args['block-name'], '/' );
		$pattern    = '/\.\bwp-block-' . $preg_quote . '\b/';

		// Assume received selector is another reference to root, so we should concat together.
		if ( preg_match( $pattern, $selector, $matches ) ) {

			// Appending blockera root unique css selector into picked your selector.
			return \Blockera\Utils\Utils::modifySelectorPos(
				$selector,
				$matches[0],
				[
					'prefix' => $root,
					'suffix' => blockera_get_admin_options([ 'earlyAccessLab', 'optimizeStyleGeneration' ]) ? '' : $root,
				]
			);
		}

		// Handle cases where selector and root are identical or when dealing with inner blocks.
		if ( $selector === $root || blockera_is_inner_block( $args['block-type'] ) ) {

			// If a custom root is provided in args, replace it with the combined root selectors and should not start with a space because it's a child selector and we should not add it before the root.
			if (isset($args['root']) && ! str_starts_with($args['root'], ' ')) {

				// Replace the custom root with itself plus the standard root selector.
				return str_replace($args['root'], "{$args['root']}{$root}", $selector);
			}

			// Return selector unchanged if no custom root.
			return "{$root} {$selector}";
		}

		// If selector is a child of root or starts with a tag name and should not start with a space because it's a child selector and we should not add it before the root.
		if (! str_starts_with($selector, ' ') && ( $is_child_selector || preg_match( '/^[a-z]/', $selector ) )) {

			// If selector contains pseudo-classes or combinators, keep them intact and append root.
			$parts  = preg_split('/(?:::|:)/', $selector, 2);
			$base   = $parts[0];
			$pseudo = isset($parts[1]) ? ( strpos($selector, '::') !== false ? '::' : ':' ) . $parts[1] : '';

			return "{$base}{$root}{$pseudo}";
		}

		// If selector started with dot or any other classname of child elements, we imagine it's other classname of root or child of root.
		return "{$root}{$selector}";
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

		return trim(
			implode(
				'',
				array_map(
					function ( string $_selector ): string {

						// ignore external selectors.
						if ( false === strpos( $_selector, 'blockera-block' ) ) {

							return '';
						}

						$_selector = trim( $_selector );

						if ( ! empty( $_selector ) && '.' === $_selector[0] ) {

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

if ( ! function_exists( 'blockera_get_base_breakpoint' ) ) {

	/**
	 * Get blockera base breakpoint from config.
	 *
	 * FIXME: refactor this function to solve base breakpoint with read of database.
	 *
	 * @return string the base breakpoint name.
	 */
	function blockera_get_base_breakpoint(): string {

		$breakpoints = blockera_core_config( 'breakpoints' );
		$base        = $breakpoints['base'];

		if ( ! is_string( $base ) ) {

			return $base;
		}

		$prepared_breakpoints = array_filter(
			$breakpoints['list'],
			function ( array $breakpoint ): bool {

				return ! empty( $breakpoint['base'] ) && ! empty( $breakpoint['status'] );
			}
		);

		$base = array_shift( $prepared_breakpoints );

		if ( empty( $prepared_breakpoints ) || ! $base || empty( $base['type'] ) ) {

			// fallback breakpoint.
			return 'desktop';
		}

		return $base['type'];
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
	 * @return array the block supports.
	 */
	function blockera_get_available_block_supports(): array {
		$supports = [];
		$files    = glob( blockera_core_config( 'app.vendor_path' ) . 'blockera/editor/js/schemas/block-supports/*-block-supports-list.json' );

		foreach ($files as $support_file) {

			ob_start();

			require $support_file;

			$support = json_decode(ob_get_clean(), true);

			if (empty($support['title'])) {

				continue;
			}

			$supports[ $support['title'] ] = $support;
		}

		return $supports;
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

		return array_map(
			static function ( $attribute ) {

				if ( is_array( $attribute ) && isset( $attribute['value'] ) ) {

					return $attribute['value'];
				}

				return $attribute;

			},
			$attributes
		);
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
