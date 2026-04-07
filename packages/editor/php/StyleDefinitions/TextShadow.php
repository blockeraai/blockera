<?php

namespace Blockera\Editor\StyleDefinitions;

use Blockera\Editor\StyleDefinitions\Contracts\Repeater;

class TextShadow extends BaseStyleDefinition implements Repeater {

	protected function css( array $setting ): array {

		if ( ! isset( $setting['type'] ) || 'text-shadow' !== $setting['type'] ) {
			return [];
		}

		$css_property = $setting['type'];

		if ( ! isset( $setting[ $css_property ] ) || '' === $setting[ $css_property ] ) {
			return [];
		}

		$text_shadow_data = $setting[ $css_property ];

		if ( ! isset( $text_shadow_data['valueType'] ) ) {
			$sorted_text_shadows = blockera_get_sorted_repeater( $text_shadow_data );
		} elseif ( 'variable' === ( $text_shadow_data['valueType'] ?? '' ) && isset( $text_shadow_data['settings']['value'] ) ) {
			$decoded = json_decode( $text_shadow_data['settings']['value'], true );
			$items   = is_array( $decoded ) ? ( $decoded['items'] ?? null ) : null;

			if ( is_string( $items ) ) {
				$sorted_text_shadows = static::parse_css_text_shadow_to_items( $items );
			} elseif ( is_array( $items ) ) {
				$repeater = [];
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
				$sorted_text_shadows = blockera_get_sorted_repeater( $repeater );
			} else {
				$sorted_text_shadows = [];
			}
		} else {
			$sorted_text_shadows = [];
		}

		if ( ! is_array( $sorted_text_shadows ) ) {
			return [];
		}

		$filtered = [];
		foreach ( $sorted_text_shadows as $row ) {
			if ( $this->isValidSetting( $row ) ) {
				$filtered[] = $row;
			}
		}

		if ( [] === $filtered ) {
			return [];
		}

		foreach ( $filtered as $row ) {
			$this->setTextShadow( $row );
		}

		$this->setCss( $this->declarations );

		return $this->css;
	}

	/**
	 * @param array $setting Row from text-shadow repeater.
	 */
	public function isValidSetting( array $setting ): bool {

		return isset( $setting['isVisible'] ) && $setting['isVisible'];
	}

	/**
	 * @param array $setting One text-shadow layer.
	 */
	protected function setTextShadow( array $setting ): void {

		$previous_value = $this->declarations['text-shadow'] ?? '';
		$has_previous   = '' !== $previous_value;

		$x     = isset( $setting['x'] ) && '' !== $setting['x'] ? blockera_get_value_addon_real_value( $setting['x'] ) : '';
		$y     = isset( $setting['y'] ) && '' !== $setting['y'] ? blockera_get_value_addon_real_value( $setting['y'] ) : '';
		$blur  = isset( $setting['blur'] ) && '' !== $setting['blur'] ? blockera_get_value_addon_real_value( $setting['blur'] ) : '';
		$color = isset( $setting['color'] ) && '' !== $setting['color'] ? blockera_get_value_addon_real_value( $setting['color'] ) : '';

		$text_shadow_value = ( $has_previous ? $previous_value . ', ' : '' ) . $x . ' ' . $y . ' ' . $blur . ' ' . $color;

		$this->setDeclaration( 'text-shadow', $text_shadow_value );
	}

	/**
	 * Split a CSS text-shadow list into layer strings (commas outside parentheses).
	 *
	 * @param string $css Full text-shadow value.
	 * @return string[] Non-empty layers.
	 */
	public static function split_text_shadow_list( string $css ): array {
		$css = trim( $css );
		if ( '' === $css ) {
			return [];
		}

		$parts  = preg_split( '/,(?![^(]*\))/', $css );
		$layers = [];
		foreach ( $parts as $part ) {
			$part = trim( $part );
			if ( '' !== $part ) {
				$layers[] = $part;
			}
		}

		return $layers;
	}

	/**
	 * Parse one text-shadow layer into x, y, blur, color (color may include rgb()/rgba()).
	 *
	 * @param string $layer Single layer.
	 * @return array{x?:string,y?:string,blur?:string,color?:string,isVisible:bool,order?:int}|null
	 */
	public static function parse_single_text_shadow_layer( string $layer ): ?array {
		$trimmed = trim( $layer );
		if ( '' === $trimmed ) {
			return null;
		}

		$color      = 'rgba(0, 0, 0, 0.3)';
		$dimensions = $trimmed;

		if ( preg_match( '/\s+(rgb|rgba|hsl|hsla)\([^)]+\)\s*$/', $trimmed, $m ) ) {
			$color      = trim( $m[0] );
			$dimensions = trim( substr( $trimmed, 0, strlen( $trimmed ) - strlen( $m[0] ) ) );
		} elseif ( preg_match( '/\s+(#[0-9a-fA-F]{3,8})\s*$/', $trimmed, $m ) ) {
			$color      = $m[1];
			$dimensions = trim( substr( $trimmed, 0, strlen( $trimmed ) - strlen( $m[1] ) - 1 ) );
		} elseif ( preg_match( '/\s+([a-zA-Z]+)\s*$/', $trimmed, $m ) ) {
			$color      = $m[1];
			$dimensions = trim( substr( $trimmed, 0, strlen( $trimmed ) - strlen( $m[1] ) - 1 ) );
		}

		$parts = preg_split( '/\s+/', $dimensions );
		$parts = array_values( array_filter( $parts, 'strlen' ) );

		if ( count( $parts ) < 2 ) {
			return null;
		}

		$x    = $parts[0] ?? '0px';
		$y    = $parts[1] ?? '0px';
		$blur = $parts[2] ?? '0px';

		return array(
			'x'         => $x,
			'y'         => $y,
			'blur'      => $blur,
			'color'     => $color,
			'isVisible' => true,
		);
	}

	/**
	 * Parse a full CSS text-shadow string into an ordered list of repeater rows (with order).
	 *
	 * @param string $css CSS text-shadow.
	 * @return array<int, array<string, mixed>>
	 */
	public static function parse_css_text_shadow_to_items( string $css ): array {
		$layers = static::split_text_shadow_list( $css );
		$out    = [];
		$i      = 0;
		foreach ( $layers as $layer ) {
			$parsed = static::parse_single_text_shadow_layer( $layer );
			if ( null !== $parsed ) {
				$parsed['order'] = $i++;
				$out[]           = $parsed;
			}
		}

		return $out;
	}
}
