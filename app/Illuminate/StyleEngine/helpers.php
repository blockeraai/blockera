<?php

use Publisher\Framework\Illuminate\StyleEngine\StyleEngine;

if ( ! function_exists( 'pb_get_unique_classname' ) ) {
	/**
	 * Retrieve css classname with suffix string.
	 *
	 * @param string $suffix suffix for use in create css classname
	 *
	 * @return string the unique css classname
	 */
	function pb_get_unique_classname( string $suffix ): string {

		$suffix = str_replace( '/', '-', $suffix );

		return $suffix . uniqid( '-' );
	}
}

if ( ! function_exists( 'pb_get_css_media_queries' ) ) {

	/**
	 * Get css media queries from configured breakpoints.
	 *
	 * @return array
	 */
	function pb_get_css_media_queries(): array {

		$queries = [];

		foreach ( pb_core_config( 'breakpoints' ) as $breakpoint ) {

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

if ( ! function_exists( 'pb_block_state_validate' ) ) {

	/**
	 * Is block state validate?
	 *
	 * @param array  $states The block states.
	 * @param string $state  The state name.
	 *
	 * @return array The block state.
	 */
	function pb_block_state_validate( array $states, string $state ): array {

		if ( ! $state ) {

			return [];
		}

		if ( empty( $states ) ) {

			return [];
		}

//		no state found.
		if ( empty( $states[ $state ] ) ) {

			return [];
		}

		return $states[ $state ];
	}
}

if ( ! function_exists( 'pb_get_block_type_selectors' ) ) {

	/**
	 * Retrieve block type mapped selectors array.
	 *
	 * @param string $name the block name.
	 *
	 * @return array the css mapped to array css selectors.
	 */
	function pb_get_block_type_selectors( string $name ): array {

		$registered = WP_Block_Type_Registry::get_instance()->get_registered( $name );

		if ( null === $registered ) {

			return [];
		}

		return WP_Block_Type_Registry::get_instance()->get_registered( $name )->selectors;
	}
}

if ( ! function_exists( 'pb_get_block_state_selectors' ) ) {
	/**
	 * Retrieve block state selectors.
	 *
	 * @param array $selectors the recieved selectors list.
	 * @param array $args      the extra arguments to generate unique css selectors.
	 *
	 * @return array the unique selectors list.
	 */
	function pb_get_block_state_selectors( array $selectors, array $args = [] ): array {

		[
			'block-type'         => $blockType,
			'pseudo-class'       => $pseudoClass,
			'is-inner-block'     => $isInnerBlock,
			'block-settings'     => $blockSettings,
			'master-block-state' => $masterBlockState,
		] = $args;

		// Provide fallback css selector to use this when $selectors is empty.
		if ( empty( $selectors['fallback'] ) && ! empty( $args['fallback'] ) ) {

			$selectors['fallback'] = $args['fallback'];

			unset( $args['fallback'] );
		}

		// Handle inner blocks selectors based on recieved state.
		if ( $isInnerBlock ) {

			// Validate inner block type.
			if ( empty( $selectors['innerBlocks'][ $blockType ] ) ) {

				return $selectors;
			}

			$innerBlockSelectors = array_merge(
				[
					'fallback'   => $selectors['fallback'] ?? '',
					'parentRoot' => $selectors['root'] ?? $selectors['fallback'] ?? '',
				],
				$selectors['innerBlocks'][ $blockType ],
			);

			$selectors['innerBlocks'][ $blockType ] = pb_get_inner_block_state_selectors( $innerBlockSelectors, $args );

			// Delete custom fallback and parentRoot selector of inner block list.
			unset(
				$selectors['innerBlocks'][ $blockType ]['fallback'],
				$selectors['innerBlocks'][ $blockType ]['parentRoot']
			);

			return $selectors;
		}

		$customClassname = $blockSettings['publisherBlockStates'][ $pseudoClass ]['css-class'] ?? null;

		foreach ( $selectors as $key => $value ) {

			// Excluding inner blocks.
			if ( 'innerBlocks' === $key ) {

				continue;
			}

			// Overriding master block selectors with provided custom-class.
			// Included all selectors without inner blocks selectors.
			if ( in_array( $pseudoClass, [
					'custom-class',
					'parent-class'
				], true ) && ! empty( $customClassname ) && is_string( $value ) ) {

				$normalizedParent = pb_get_normalized_selector( $customClassname );
				$normalizedParent = str_ends_with( $normalizedParent, ' ' ) ? $normalizedParent : $normalizedParent . ' ';

				// Add pseudo custom css class as suffix into selectors value for current key.
				$selectors[ $key ] = sprintf( '%s%s', $normalizedParent, $value );
				// TODO: double check to we needs to customized supports selectors or not?
				continue;
			}

			// Overriding selectors based on supported pseudo-class in css. Supported pseudo-classes with css: hover, active, visited, before, after.
			// Included all selectors without inner blocks selectors.
			if ( $pseudoClass && 'normal' !== $pseudoClass ) {

				if ( is_string( $value ) ) {

					$parsed = explode( ',', $value );

					if ( count( $parsed ) > 1 ) {

						// Add pseudo custom css class as suffix into selectors value for current key.
						$selectors[ $key ] = implode( ', ', array_map( static function ( string $item ) use ( $pseudoClass ): string {

							return sprintf( '%s:%s', trim( $item ), $pseudoClass );
						}, $parsed ) );

					} else {

						// Add pseudo custom css class as suffix into selectors value for current key.
						$selectors[ $key ] = sprintf( '%s:%s', trim( $value ), $pseudoClass );
					}

					continue;
				}

				if ( is_array( $value ) ) {

					$selectors[ $key ] = pb_get_block_state_selectors( $value, $args );
				}
			}
		}

		return $selectors;
	}
}

if ( ! function_exists( 'pb_get_inner_block_state_selectors' ) ) {

	/**
	 * Retrieve inner block state selectors.
	 *
	 * @param array $selectors the recieved selectors list.
	 * @param array $args      the extra arguments to generate unique css selectors.
	 *
	 * @return array the unique selectors list.
	 */
	function pb_get_inner_block_state_selectors( array $selectors, array $args ): array {

		[
			'pseudo-class'       => $pseudoClass,
			'block-settings'     => $blockSettings,
			'master-block-state' => $masterBlockState,
		] = $args;

		$customClassname = $blockSettings['publisherBlockStates'][ $pseudoClass ]['css-class'] ?? null;

		foreach ( $selectors as $key => $value ) {

			// Excluding fallback and parentRoot in overriding process.
			if ( in_array( $key, [ 'fallback', 'parentRoot' ], true ) ) {

				continue;
			}

			// Overriding selectors based on supported pseudo-class in css. Supported pseudo-classes with css: hover, active, visited, before, after.
			if ( $pseudoClass && 'normal' !== $pseudoClass ) {

				if ( is_array( $value ) ) {

					$selectors[ $key ] = pb_get_inner_block_state_selectors( array_merge(
						[
							'fallback'   => $selectors['fallback'] ?? '',
							'parentRoot' => $selectors['parentRoot'] ?? $selectors['fallback'] ?? '',
						],
						$value,
					), $args );

					unset( $selectors[ $key ]['fallback'], $selectors[ $key ]['parentRoot'] );

					continue;
				}

				$parentPseudoClass = in_array( $masterBlockState, [
					'normal',
					'parent-class',
					'custom-class'
				], true ) ? '' : $masterBlockState;

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
							}
							, $parsedValue
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

					$parentPseudoClass = in_array( $masterBlockState, [
						'normal',
						'parent-class',
						'custom-class'
					], true ) ? '' : $masterBlockState;

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

if ( ! function_exists( 'pb_calculate_feature_css_selector' ) ) {

	/**
	 * Calculation suitable css selector for related property.
	 *
	 * @param array         $selectors  The mapped css selectors block related.
	 * @param string        $featureId  The feature identifier.
	 * @param string | null $fallbackId The feature fallback identifier.
	 *
	 * @return string the css selector.
	 */
	function pb_calculate_feature_css_selector( array $selectors, string $featureId, string $fallbackId = null ): string {

		// 1- TODO: Handle custom-class state

		// Calculation with arguments
		if ( ! empty( $fallbackId ) ) {

			$parsedFallback = explode( '.', $fallbackId );

			$selector = $selectors[ array_shift( $parsedFallback ) ] ?? $selectors['root'] ?? '';

			foreach ( $parsedFallback as $id ) {

				if ( ! is_array( $selector ) ) {

					continue;
				}

				$selector = $selector[ $id ] ?? $selector['root'] ?? '';
			}

			return $selector ? $selector : $selectors['root'] ?? $selectors['fallback'] ?? '';
		}

		// Use of root when recieved invalid arguments.
		return $selectors['root'] ?? $selectors['fallback'] ?? '';
	}
}

if ( ! function_exists( 'pb_get_shorthand_css' ) ) {

	/**
	 * Retrieve the converted long css to shorthand css string.
	 *
	 * @param string $longCss The long css string.
	 *
	 * @return string The shorthanded css.
	 */
	function pb_get_shorthand_css( string $longCss = '' ): string {

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

if ( ! function_exists( 'pb_combine_css' ) ) {

	/**
	 * Get combined css with receive complex css.
	 *
	 * @param array $css the complex css.
	 *
	 * @return array the flat css array to combined of css selectors and declarations.
	 */
	function pb_combine_css( array $css ): array {

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

if ( ! function_exists( 'pb_convert_css_declarations_to_css_valid_rules' ) ) {

	/**
	 * Convert array css rules to valid css rules list.
	 *
	 * @param array $css
	 *
	 * @return array the converted css rules.
	 */
	function pb_convert_css_declarations_to_css_valid_rules( array $css ): array {

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

if ( ! function_exists( 'pb_get_normalized_selector' ) ) {

	/**
	 * Get normalized selector.
	 *
	 * @param string $selector the target css selector.
	 *
	 * @return string the normalized css selector.
	 */
	function pb_get_normalized_selector( string $selector ): string {

		$selectors = explode( ' ', $selector );

		return trim(
			implode(
				'',
				array_map( function ( string $_selector ): string {

					return '.' . trim( $_selector );
				}, $selectors )
			)
		);
	}
}