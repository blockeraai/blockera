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

		$boxShadowData = $setting[ $cssProperty ];

		if ( ! isset( $boxShadowData['valueType'] ) ) {
			$sortedShadows = blockera_get_sorted_repeater( $boxShadowData );
		} elseif ( 'variable' === ( $boxShadowData['valueType'] ?? '' ) && isset( $boxShadowData['settings']['value'] ) ) {
			$decoded = json_decode( $boxShadowData['settings']['value'], true );
			$items   = is_array( $decoded ) ? ( $decoded['items'] ?? null ) : null;

			if ( is_string( $items ) ) {
				$items = static::parseCssBoxShadowToRepeaterValue( $items );
			}

			if ( ! is_array( $items ) ) {
				$sortedShadows = [];
			} else {
				$sortedShadows = blockera_get_sorted_repeater( $items );
			}
		} else {
			$sortedShadows = [];
		}

		$filteredBoxShadows = [];
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

		$boxShadowValues = [];
		$shadowCount     = count( $filteredBoxShadows );

		for ( $i = 0; $i < $shadowCount; ++$i ) {
			$boxShadowValues[] = $this->getBoxShadow( $filteredBoxShadows[ $i ] );
		}

		$this->setDeclaration( $cssProperty, implode( ', ', $boxShadowValues ) );
		$this->setCss( $this->declarations );

		return $this->css;
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
