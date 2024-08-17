<?php

use Blockera\Editor\StyleEngine;

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
	 * @return array
	 */
	function blockera_get_css_media_queries(): array {

		$queries = [];

		foreach ( blockera_core_config( 'breakpoints.list' ) as $breakpoint ) {

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

		if ( ! $state ) {

			return [];
		}

		if ( empty( $states ) ) {

			return [];
		}

		// no state found.
		if ( empty( $states[ $state ] ) ) {

			return [];
		}

		return $states[ $state ];
	}
}

if ( ! function_exists( 'blockera_append_blockera_block_prefix' ) ) {

	/**
	 * Appending "blockera/" prefix at block type name.
	 *
	 * @param string $block_type the block type name.
	 *
	 * @return string the block type name with "blockera/" prefix.
	 */
	function blockera_append_blockera_block_prefix( string $block_type ): string {

		return "blockera/{$block_type}";
	}
}

if ( ! function_exists( 'blockera_get_block_state_selectors' ) ) {
	/**
	 * Retrieve block state selectors.
	 *
	 * @param array $selectors the recieved selectors list.
	 * @param array $args      the extra arguments to generate unique css selectors.
	 *
	 * @return array the unique selectors list.
	 */
	function blockera_get_block_state_selectors( array $selectors, array $args = [] ): array {

		[
			'block-type'     => $block_type,
			'pseudo-class'   => $pseudo_class,
			'is-inner-block' => $is_inner_block,
			'block-settings' => $block_settings,
		] = $args;

		// Provide fallback css selector to use this when $selectors is empty.
		if ( empty( $selectors['fallback'] ) && ! empty( $args['fallback'] ) ) {

			$selectors['fallback'] = $args['fallback'];

			unset( $args['fallback'] );
		}

		// Handle inner blocks selectors based on recieved state.
		if ( $is_inner_block ) {

			$inner_block_id = blockera_append_blockera_block_prefix( $block_type );

			// Validate inner block type.
			if ( empty( $selectors[ $inner_block_id ] ) ) {

				return $selectors;
			}

			$innerBlockSelectors = array_merge(
				[
					'fallback'   => $selectors['fallback'] ?? '',
					'parentRoot' => $selectors['root'] ?? $selectors['fallback'] ?? '',
				],
				$selectors[ $inner_block_id ],
			);

			$selectors[ $inner_block_id ] = blockera_get_inner_block_state_selectors( $innerBlockSelectors, $args );

			// Delete custom fallback and parentRoot selector of inner block list.
			unset(
				$selectors[ $inner_block_id ]['fallback'],
				$selectors[ $inner_block_id ]['parentRoot']
			);

			return $selectors;
		}

		$custom_classname = $block_settings['blockeraBlockStates'][ $pseudo_class ]['css-class'] ?? null;

		foreach ( $selectors as $key => $value ) {

			// Excluding inner block selector.
			if ( false !== strpos( $key, 'blockera/' ) ) {

				continue;
			}

			$has_css_class = in_array( $pseudo_class, [ 'custom-class', 'parent-class' ], true );

			// Overriding master block selectors with provided custom-class.
			// Included all selectors without inner blocks selectors.
			if ( $has_css_class && ! empty( $custom_classname ) && is_string( $value ) ) {

				$normalizedParent = blockera_get_normalized_selector( $custom_classname );
				$normalizedParent = str_ends_with( $normalizedParent, ' ' ) ? $normalizedParent : $normalizedParent . ' ';

				// Add pseudo custom css class as suffix into selectors value for current key.
				$selectors[ $key ] = sprintf( '%s%s', $normalizedParent, $value );
				// TODO: double check to we needs to customized supports selectors or not?
				continue;
			}

			// Overriding selectors based on supported pseudo-class in css. Supported pseudo-classes with css: hover, active, visited, before, after.
			// Included all selectors without inner blocks selectors.
			if ( $pseudo_class && 'normal' !== $pseudo_class ) {

				if ( is_string( $value ) ) {

					$parsed = explode( ',', $value );

					if ( count( $parsed ) > 1 ) {

						// Add pseudo custom css class as suffix into selectors value for current key.
						$selectors[ $key ] = implode(
							', ',
							array_map(
								static function ( string $item ) use ( $pseudo_class ): string {

									return sprintf( '%s:%s', trim( $item ), $pseudo_class );
								},
								$parsed
							)
						);

					} else {

						// Add pseudo custom css class as suffix into selectors value for current key.
						$selectors[ $key ] = sprintf( '%s:%s', trim( $value ), $pseudo_class );
					}

					continue;
				}

				if ( is_array( $value ) ) {

					$selectors[ $key ] = blockera_get_block_state_selectors( $value, $args );
				}
			}
		}

		return $selectors;
	}
}

if ( ! function_exists( 'blockera_get_inner_block_state_selectors' ) ) {

	/**
	 * Retrieve inner block state selectors.
	 *
	 * @param array $selectors the recieved selectors list.
	 * @param array $args      the extra arguments to generate unique css selectors.
	 *
	 * @return array the unique selectors list.
	 */
	function blockera_get_inner_block_state_selectors( array $selectors, array $args ): array {

		[
			'pseudo-class'       => $pseudoClass,
			'block-settings'     => $blockSettings,
			'master-block-state' => $masterBlockState,
		] = $args;

		$custom_classname = $blockSettings['blockeraBlockStates'][ $pseudoClass ]['css-class'] ?? null;

		foreach ( $selectors as $key => $value ) {

			// Excluding fallback and parentRoot in overriding process.
			if ( in_array( $key, [ 'fallback', 'parentRoot' ], true ) ) {

				continue;
			}

			// Overriding selectors based on supported pseudo-class in css. Supported pseudo-classes with css: hover, active, visited, before, after.
			if ( $pseudoClass && 'normal' !== $pseudoClass ) {

				if ( is_array( $value ) ) {

					$selectors[ $key ] = blockera_get_inner_block_state_selectors(
						array_merge(
							[
								'fallback'   => $selectors['fallback'] ?? '',
								'parentRoot' => $selectors['parentRoot'] ?? $selectors['fallback'] ?? '',
							],
							$value,
						),
						$args
					);

					unset( $selectors[ $key ]['fallback'], $selectors[ $key ]['parentRoot'] );

					continue;
				}

				$parentPseudoClass = in_array(
					$masterBlockState,
					[
						'normal',
						'parent-class',
						'custom-class',
					],
					true
				) ? '' : $masterBlockState;

				$parsedValue = explode( ',', trim( $value ) );

				if ( count( $parsedValue ) > 1 ) {

					// Add pseudo custom css class as suffix into selectors value for current key.
					$selectors[ $key ] = implode(
						', ',
						array_map(
							static function ( string $item ) use ( $selectors, $parentPseudoClass, $pseudoClass ): string {

								return sprintf(
									'%1$s%2$s%3$s:%4$s',
									trim( $selectors['parentRoot'] ?? $selectors['fallback'] ?? '' ),
									empty( $parentPseudoClass ) ? ' ' : ':' . $parentPseudoClass . ' ',
									trim( $item ),
									$pseudoClass
								);
							},
							$parsedValue
						)
					);

				} else {

					// Add pseudo custom css class as suffix into selectors value for current key.
					$selectors[ $key ] = sprintf(
						'%1$s%2$s%3$s:%4$s',
						trim( $selectors['parentRoot'] ?? $selectors['fallback'] ?? '' ),
						empty( $parentPseudoClass ) ? ' ' : ':' . $parentPseudoClass . ' ',
						trim( $value ),
						$pseudoClass
					);
				}

				// TODO: double check to we needs to customized supports selectors or not for inner blocks?

				continue;
			}

			// inner block in normal state.
			if ( is_string( $value ) ) {

				if ( $masterBlockState ) {

					$parentPseudoClass = in_array(
						$masterBlockState,
						[
							'normal',
							'parent-class',
							'custom-class',
						],
						true
					) ? '' : $masterBlockState;

					// Add pseudo custom css class as suffix into selectors value for current key.
					$selectors[ $key ] = sprintf(
						'%1$s%2$s%3$s',
						trim( $selectors['parentRoot'] ?? $selectors['fallback'] ?? '' ),
						empty( $parentPseudoClass ) ? ' ' : ':' . $parentPseudoClass . ' ',
						trim( $value )
					);

					continue;
				}

				$selectors[ $key ] = trim(
					sprintf( '%s %s', trim( $selectors['parentRoot'] ?? $selectors['fallback'] ?? '' ), $value )
				);
			}
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

		// TODO: Handle custom-class state.

		$block_type = blockera_get_block_type( $args['blockName'] );

		$cloned_block_type = new WP_Block_Type( $args['blockName'], $block_type );

		// Rewrite block type selectors because we provide suitable selectors array of original array.
		$cloned_block_type->selectors = $selectors;

		$has_fallback = ! empty( $args['fallback'] );

		$selector = wp_get_block_css_selector( $cloned_block_type, $feature_id, ! $has_fallback );

		if ( ! $selector && $has_fallback ) {

			$selector = wp_get_block_css_selector( $cloned_block_type, $args['fallback'], true );
		}

		// We not needs append blockera root block css selector into inners selector.
		// Like => current $selector value is one of feature id of "elements/link" inner block selectors.
		if ( ! $feature_id || str_starts_with( $feature_id, 'blockera/' ) || empty( $selectors['fallback'] ) ) {

			return $selector ?? $selectors['fallback'] ?? '';
		}

		return blockera_append_root_block_css_selector(
			$selector ?? '',
			$selectors['fallback'],
			[
				'blockName' => str_replace( '/', '-', str_replace( 'core/', '', $args['blockName'] ) ),
			]
		);
	}
}

if ( ! function_exists( 'blockera_append_root_block_css_selector' ) ) {

	/**
	 * Appending blockera block root css selector inside recieved selector.
	 *
	 * @param string $selector The recieved block css selector.
	 * @param string $root     The root block css selector.
	 * @param array  $args     The arguments {@type string $blockName The block type name}.
	 *
	 * @return string the combined block prepared css selector with root.
	 */
	function blockera_append_root_block_css_selector( string $selector, string $root, array $args = [] ): string {

		// Assume recieved selector is invalid.
		if ( empty( trim( $selector ) ) ) {

			return $root;
		}

		// Assume recieved selector is another reference to root, so we should concat together.
		if ( preg_match( '/\.(wp-block-' . $args['blockName'] . ')/', $selector, $matches ) ) {

			$prefix = str_replace( $matches[0], $root . $matches[0], $selector );
			$suffix = str_replace( $matches[0], $matches[0] . $root, $selector );

			return sprintf( '%s, %s', $prefix, $suffix );
		}

		// Assume received selector started with html tag name!
		if ( '.' !== $selector[0] ) {

			return "{$selector}{$root}";
		}

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

				if ( is_array( $value ) && empty( $value ) ) {

					continue;
				}

				if ( empty( $validCssRules[ $selector ] ) ) {

					$validCssRules[ $selector ] = sprintf( '%s: %s;', $property, $value );

					continue;
				}

				// value validating ...
				if ( is_array( $validCssRules[ $selector ] ) || is_array( $property ) || is_array( $value ) ) {

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

		$base = blockera_core_config( 'breakpoints.base' );

		if ( ! is_string( $base ) ) {

			return $base;
		}

		$prepared_breakpoints = array_filter(
			blockera_core_config( 'breakpoints.list' ),
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
