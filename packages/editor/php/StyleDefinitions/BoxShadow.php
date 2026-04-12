<?php

namespace Blockera\Editor\StyleDefinitions;

/**
 * Class BoxShadow definition to generate css rule.
 *
 * @package BoxShadow
 */
class BoxShadow extends BaseStyleDefinition {

	/**
	 * Check is valid setting for style?
	 *
	 * @param array $setting array of style setting.
	 *
	 * @return bool true on success, false on otherwise.
	 */
	public function isValidSetting( array $setting ): bool {

		if ( ! isset( $setting['type'] ) || '' === $setting['type'] ) {
			return false;
		}

		$type = $setting['type'];

		if ( 'inner' !== $type && 'outer' !== $type ) {
			return false;
		}

		return isset( $setting['isVisible'] ) && $setting['isVisible'];
	}

	/**
	 * @inheritdoc
	 *
	 * @param array $setting
	 *
	 * @return array
	 */
	protected function css( array $setting ): array {

		if ( ! isset( $setting['type'] ) || '' === $setting['type'] ) {
			return [];
		}

		$cssProperty = $setting['type'];

		if ( 'box-shadow' !== $cssProperty || ! isset( $setting[ $cssProperty ] ) || '' === $setting[ $cssProperty ] ) {
			return [];
		}

		$declaration_only = ! empty( $setting['_blockeraDeclarationOnly'] );
		$preset_mode      = ! empty( $setting['_blockeraGlobalPreset'] );

		// Reference: variable payloads may replace `settings.value` with plain CSS inside getSortedBoxShadowRowsFromValue().
		$boxShadowData     = &$setting[ $cssProperty ];
		$resolved_from_var = null;
		$self              = $this;
		$sortedShadows     = self::getSortedBoxShadowRowsFromValue(
			$boxShadowData,
			static function ( array $sorted ) use ( $self, $preset_mode ): string {
				$filtered = array();
				foreach ( $sorted as $item ) {
					if ( ! is_array( $item ) ) {
						continue;
					}
					if ( ! isset( $item['type'] ) || '' === $item['type'] ) {
						continue;
					}
					$type = $item['type'];
					if ( 'inner' !== $type && 'outer' !== $type ) {
						continue;
					}
					if ( $preset_mode ) {
						if ( ! ( $item['isVisible'] ?? true ) ) {
							continue;
						}
					} elseif ( ! isset( $item['isVisible'] ) || ! $item['isVisible'] ) {
						continue;
					}
					$filtered[] = $item;
				}
				if ( array() === $filtered ) {
					return '';
				}
				$values = array();
				foreach ( $filtered as $row ) {
					$values[] = $self->getBoxShadow( $row );
				}

				return implode( ', ', $values );
			},
			$resolved_from_var
		);

		if ( ! is_array( $sortedShadows ) ) {
			return [];
		}

		// Preset (theme.json / global styles): missing isVisible counts as visible. Block rows: isVisible must be set and true.
		if ( null !== $resolved_from_var && '' !== $resolved_from_var ) {
			$this->setDeclaration( $cssProperty, $resolved_from_var );
		} elseif ( $preset_mode ) {
			$filteredBoxShadows = array();
			$count              = count( $sortedShadows );

			for ( $i = 0; $i < $count; ++$i ) {
				$item = $sortedShadows[ $i ];

				if ( ! is_array( $item ) || ! isset( $item['type'] ) || '' === $item['type'] ) {
					continue;
				}
				$type = $item['type'];
				if ( ( 'inner' === $type || 'outer' === $type ) && ( $item['isVisible'] ?? true ) ) {
					$filteredBoxShadows[] = $item;
				}
			}

			if ( 0 === count( $filteredBoxShadows ) ) {
				return [];
			}

			$boxShadowValues = array();
			$shadowCount     = count( $filteredBoxShadows );

			for ( $i = 0; $i < $shadowCount; ++$i ) {
				$boxShadowValues[] = $this->getBoxShadow( $filteredBoxShadows[ $i ] );
			}

			$this->setDeclaration( $cssProperty, implode( ', ', $boxShadowValues ) );
		} else {
			$filteredBoxShadows = array();
			$count              = count( $sortedShadows );

			for ( $i = 0; $i < $count; ++$i ) {
				$item = $sortedShadows[ $i ];

				if ( isset( $item['type'] ) && '' !== $item['type'] ) {

					$type = $item['type'];

					if ( ( 'inner' === $type || 'outer' === $type ) && isset( $item['isVisible'] ) && $item['isVisible'] ) {
						$filteredBoxShadows[] = $item;
					}
				}
			}

			if ( 0 === count( $filteredBoxShadows ) ) {
				return [];
			}

			$boxShadowValues = array();
			$shadowCount     = count( $filteredBoxShadows );

			for ( $i = 0; $i < $shadowCount; ++$i ) {
				$boxShadowValues[] = $this->getBoxShadow( $filteredBoxShadows[ $i ] );
			}

			$this->setDeclaration( $cssProperty, implode( ', ', $boxShadowValues ) );
		}

		if ( ! isset( $this->declarations[ $cssProperty ] ) || '' === $this->declarations[ $cssProperty ] ) {
			return [];
		}

		if ( $declaration_only ) {
			return [];
		}

		$this->setCss( $this->declarations );

		return $this->css;
	}

	/**
	 * Sorted box-shadow rows (raw repeater, variable JSON with `declaration`, CSS-string `items`, or row `items`).
	 *
	 * @param array         $value                  Content of $setting['box-shadow']; updated for variable payloads.
	 * @param callable|null $build_declaration      Builds CSS from sorted row arrays when `items` is a list of rows.
	 * @param string|null   $resolved_from_variable Output when variable resolves to final `box-shadow` value.
	 * @return array<int, array<string, mixed>>
	 */
	protected static function getSortedBoxShadowRowsFromValue( array &$value, ?callable $build_declaration = null, ?string &$resolved_from_variable = null ): array {
		$resolved_from_variable = null;

		if ( ! isset( $value['valueType'] ) ) {
			return blockera_get_sorted_repeater( $value );
		}
		if ( 'variable' !== ( $value['valueType'] ?? '' ) || ! isset( $value['settings'] ) || ! is_array( $value['settings'] ) ) {
			return array();
		}
		$decoded = static::decodeVariableRepeaterSettings( $value['settings'] );
		if ( null === $decoded ) {
			return array();
		}
		$raw_restore = '';
		if ( isset( $value['settings']['value'] ) && is_string( $value['settings']['value'] ) ) {
			$raw_restore = $value['settings']['value'];
		} elseif ( isset( $decoded['items'] ) && is_array( $decoded['items'] ) ) {
			$raw_restore = wp_json_encode( array( 'items' => $decoded['items'] ) );
		}

		$declaration_string = '';

		if ( array_key_exists( 'declaration', $decoded ) && '' !== $decoded['declaration'] && null !== $decoded['declaration'] ) {
			$resolved_decl      = blockera_get_value_addon_real_value( $decoded['declaration'] );
			$declaration_string = is_scalar( $resolved_decl ) ? (string) $resolved_decl : '';
		}

		$items = $decoded['items'] ?? null;

		if ( '' === $declaration_string && is_string( $items ) ) {
			$from_items         = blockera_get_value_addon_real_value( $items );
			$declaration_string = trim( is_scalar( $from_items ) ? (string) $from_items : '' );
		}

		if ( '' === $declaration_string && is_array( $items ) && null !== $build_declaration ) {
			$repeater = array();
			foreach ( $items as $idx => $row ) {
				if ( ! is_array( $row ) ) {
					continue;
				}
				$repeater[ (string) $idx ] = array_merge(
					$row,
					array(
						'order'     => isset( $row['order'] ) ? (int) $row['order'] : (int) $idx,
						'isVisible' => $row['isVisible'] ?? true,
					)
				);
			}
			$sorted             = blockera_get_sorted_repeater( $repeater );
			$declaration_string = $build_declaration( $sorted );
		}

		if ( '' !== $declaration_string ) {
			$value['settings']['value'] = $declaration_string;
			$resolved_raw               = blockera_get_value_addon_real_value( $value );
			$final                      = is_scalar( $resolved_raw ) ? (string) $resolved_raw : '';

			if ( '' !== $final ) {
				$resolved_from_variable = $final;

				return array();
			}

			// Var resolution returned empty: restore JSON so row-by-row fallback still works.
			$value['settings']['value'] = $raw_restore;
		}

		if ( is_string( $items ) ) {
			$parsed   = static::parseCssBoxShadowToRepeaterValue( $items );
			$repeater = array();
			foreach ( $parsed as $idx => $row ) {
				if ( ! is_array( $row ) ) {
					continue;
				}
				$repeater[ (string) $idx ] = array_merge(
					$row,
					array(
						'order'     => isset( $row['order'] ) ? (int) $row['order'] : (int) $idx,
						'isVisible' => $row['isVisible'] ?? true,
					)
				);
			}

			return blockera_get_sorted_repeater( $repeater );
		}
		if ( is_array( $items ) ) {
			$repeater = array();
			foreach ( $items as $idx => $row ) {
				if ( ! is_array( $row ) ) {
					continue;
				}
				$repeater[ (string) $idx ] = array_merge(
					$row,
					array(
						'order'     => isset( $row['order'] ) ? (int) $row['order'] : (int) $idx,
						'isVisible' => $row['isVisible'] ?? true,
					)
				);
			}

			return blockera_get_sorted_repeater( $repeater );
		}

		return array();
	}

	/**
	 * Get calculated box shadow.
	 *
	 * @param array $setting The setting.
	 *
	 * @return string the box shadow css property value.
	 */
	protected function getBoxShadow( array $setting ): string {

		$type  = isset( $setting['type'] ) ? $setting['type'] : '';
		$inset = ( 'inner' === $type ) ? 'inset' : '';

		$x      = ( isset( $setting['x'] ) && '' !== $setting['x'] ) ? blockera_get_value_addon_real_value( $setting['x'] ) : '';
		$y      = ( isset( $setting['y'] ) && '' !== $setting['y'] ) ? blockera_get_value_addon_real_value( $setting['y'] ) : '';
		$blur   = ( isset( $setting['blur'] ) && '' !== $setting['blur'] ) ? blockera_get_value_addon_real_value( $setting['blur'] ) : '';
		$spread = ( isset( $setting['spread'] ) && '' !== $setting['spread'] ) ? blockera_get_value_addon_real_value( $setting['spread'] ) : '';
		$color  = ( isset( $setting['color'] ) && '' !== $setting['color'] ) ? blockera_get_value_addon_real_value( $setting['color'] ) : '';

		return sprintf( '%s %s %s %s %s %s', $inset, $x, $y, $blur, $spread, $color );
	}

	/**
	 * Parse a CSS box-shadow string into a repeater value array.
	 * Converts CSS 'box-shadow' values into an array of associative arrays,
	 * where each entry matches the shape expected for a shadow repeater item
	 * (type, x, y, blur, spread, color, isVisible).
	 *
	 * @param string $css Box shadow CSS string.
	 * @return array Parsed repeater shadow items.
	 */
	public static function parseCssBoxShadowToRepeaterValue( string $css ) {
		if ( empty( $css ) || ! is_string( $css ) ) {
			return [];
		}

		// Split by commas to separate multiple shadows.
		$shadows = preg_split( '/,(?![^\(]*\))/', $css );
		$result  = [];

		foreach ( $shadows as $shadow ) {
			$shadow    = trim( $shadow );
			$type      = 'outer';
			$isVisible = true;
			$x         = '';
			$y         = '';
			$blur      = '';
			$spread    = '';
			$color     = '';

			// Match: [inset] X Y [blur] [spread] [color]
			// Colors can be in rgb/rgba/hsl/hex, so match color at the end.
			$regex = '/^(inset\s*)?
				([-+]?[\d\.]+[a-z%]*)\s+                # x offset
				([-+]?[\d\.]+[a-z%]*)\s+                # y offset
				(?:
					([-+]?[\d\.]+[a-z%]*)\s+            # blur (optional)
				)?
				(?:
					([-+]?[\d\.]+[a-z%]*)\s+            # spread (optional)
				)?
				(.+?)?                                  # color (rest of the string)
				$/ix';

			if ( preg_match( $regex, $shadow, $matches ) ) {
				if ( ! empty( $matches[1] ) && false !== stripos( $matches[1], 'inset' ) ) {
					$type = 'inner';
				}
				$x      = isset( $matches[2] ) ? trim( $matches[2] ) : '';
				$y      = isset( $matches[3] ) ? trim( $matches[3] ) : '';
				$blur   = isset( $matches[4] ) ? trim( $matches[4] ) : '0px';
				$spread = isset( $matches[5] ) ? trim( $matches[5] ) : '0px';
				$color  = isset( $matches[6] ) ? trim( $matches[6] ) : '#000000';

				// Attempt to detect color if not matched cleanly.
				if ( empty( $color ) ) {
					// Try to find color in the original string.
					if ( preg_match( '/(rgba?\([^\)]+\)|#([0-9a-f]{3,8})|hsla?\([^\)]+\))$/i', $shadow, $c ) ) {
						$color = trim( $c[1] );
					} else {
						$color = '#000000';
					}
				}
			} else {
				// If not matching, fallback: try to get values by splitting on space.
				$parts = preg_split( '/\s+/', $shadow );
				if ( ! empty( $parts ) ) {
					if ( 'inset' === strtolower( $parts[0] ) ) {
						$type = 'inner';
						array_shift( $parts );
					}

					$x      = $parts[0] ?? '';
					$y      = $parts[1] ?? '';
					$blur   = $parts[2] ?? '0px';
					$spread = $parts[3] ?? '0px';
					$color  = implode( ' ', array_slice( $parts, 4 ) );
					if ( empty( $color ) ) {
						$color = '#000000';
					}
				}
			}

			// Build repeater item.
			$result[] = [
				'type'      => $type,
				'x'         => $x,
				'y'         => $y,
				'blur'      => $blur,
				'spread'    => $spread,
				'color'     => $color,
				'isVisible' => $isVisible,
			];
		}

		return $result;
	}
}
