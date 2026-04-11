<?php

namespace Blockera\Editor\StyleDefinitions;

use Blockera\Editor\StyleDefinitions\Contracts\Repeater;

class TextShadow extends BaseStyleDefinition implements Repeater {

	protected function css( array $setting ): array {

		if ( ! isset( $setting['type'] ) || 'text-shadow' !== $setting['type'] ) {
			return [];
		}

		$css_property     = $setting['type'];
		$declaration_only = ! empty( $setting['_blockeraDeclarationOnly'] );
		$preset_mode      = ! empty( $setting['_blockeraGlobalPreset'] );

		if ( ! isset( $setting[ $css_property ] ) || '' === $setting[ $css_property ] ) {
			return [];
		}

		$text_shadow_data    = &$setting[ $css_property ];
		$resolved_from_var   = null;
		$self                = $this;
		$sorted_text_shadows = self::get_sorted_text_shadow_rows_from_value(
			$text_shadow_data,
			static function ( array $sorted ) use ( $preset_mode, $self ): string {
				$parts = array();
				foreach ( $sorted as $row ) {
					if ( ! is_array( $row ) ) {
						continue;
					}
					if ( $preset_mode ) {
						if ( ! ( $row['isVisible'] ?? true ) ) {
							continue;
						}
					} elseif ( ! $self->isValidSetting( $row ) ) {
						continue;
					}
					$layer = trim( self::text_shadow_row_to_css_value( $row ) );
					if ( '' !== $layer ) {
						$parts[] = $layer;
					}
				}

				return implode( ', ', array_filter( $parts, 'strlen' ) );
			},
			$resolved_from_var
		);

		if ( ! is_array( $sorted_text_shadows ) ) {
			return [];
		}

		if ( null !== $resolved_from_var && '' !== $resolved_from_var ) {
			$this->setDeclaration( 'text-shadow', $resolved_from_var );
		} elseif ( $preset_mode ) {
			foreach ( $sorted_text_shadows as $row ) {
				if ( ! is_array( $row ) || ! ( $row['isVisible'] ?? true ) ) {
					continue;
				}
				$layer = trim( self::text_shadow_row_to_css_value( $row ) );
				if ( '' === $layer ) {
					continue;
				}
				$prev = $this->declarations['text-shadow'] ?? '';
				$this->setDeclaration( 'text-shadow', '' !== $prev ? $prev . ', ' . $layer : $layer );
			}
		} else {
			foreach ( $sorted_text_shadows as $row ) {
				if ( ! is_array( $row ) ) {
					continue;
				}
				if ( $this->isValidSetting( $row ) ) {
					$this->setTextShadow( $row );
				}
			}
		}

		if ( ! isset( $this->declarations['text-shadow'] ) || '' === $this->declarations['text-shadow'] ) {
			return [];
		}

		if ( $declaration_only ) {
			return [];
		}

		$this->setCss( $this->declarations );

		return $this->css;
	}

	/**
	 * Sorted text-shadow rows (raw repeater, variable JSON with `declaration`, CSS-string `items`, or row `items`).
	 *
	 * @param array         $value                  Content of $setting['text-shadow']; updated for variable payloads.
	 * @param callable|null $build_declaration      Builds CSS from sorted row arrays when `items` is a list of rows.
	 * @param string|null   $resolved_from_variable Output when variable resolves to final `text-shadow` value.
	 * @return array<int, array<string, mixed>>
	 */
	protected static function get_sorted_text_shadow_rows_from_value( array &$value, ?callable $build_declaration = null, ?string &$resolved_from_variable = null ): array {
		$resolved_from_variable = null;

		if ( ! isset( $value['valueType'] ) ) {
			return blockera_get_sorted_repeater( $value );
		}
		if ( 'variable' !== ( $value['valueType'] ?? '' ) || ! isset( $value['settings']['value'] ) ) {
			return [];
		}
		$raw = $value['settings']['value'];
		if ( ! is_string( $raw ) || '' === $raw ) {
			return [];
		}
		$decoded = json_decode( $raw, true );
		if ( ! is_array( $decoded ) ) {
			return [];
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

				return [];
			}

			$value['settings']['value'] = $raw;
		}

		if ( is_string( $items ) ) {
			return static::parse_css_text_shadow_to_items( $items );
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

		return [];
	}

	/**
	 * @param array $setting One text-shadow layer (repeater row).
	 */
	protected static function text_shadow_row_to_css_value( array $setting ): string {
		$x     = isset( $setting['x'] ) && '' !== $setting['x'] ? blockera_get_value_addon_real_value( $setting['x'] ) : '';
		$y     = isset( $setting['y'] ) && '' !== $setting['y'] ? blockera_get_value_addon_real_value( $setting['y'] ) : '';
		$blur  = isset( $setting['blur'] ) && '' !== $setting['blur'] ? blockera_get_value_addon_real_value( $setting['blur'] ) : '';
		$color = isset( $setting['color'] ) && '' !== $setting['color'] ? blockera_get_value_addon_real_value( $setting['color'] ) : '';

		return trim( $x . ' ' . $y . ' ' . $blur . ' ' . $color );
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

		$text_shadow_value = ( $has_previous ? $previous_value . ', ' : '' ) . self::text_shadow_row_to_css_value( $setting );

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
