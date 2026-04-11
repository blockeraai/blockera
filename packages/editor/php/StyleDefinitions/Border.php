<?php

namespace Blockera\Editor\StyleDefinitions;

/**
 * Class Border definition to generate css rules.
 *
 * @package Border
 */
class Border extends BaseStyleDefinition {

	/**
	 * Static side names array to avoid repeated allocations.
	 * Using static class property reduces memory allocation on each call.
	 *
	 * @var array
	 */
	private static array $sides = [ 'top', 'right', 'bottom', 'left' ];

	/**
	 * Static prefix array to avoid repeated allocations.
	 * Pre-computed to eliminate array creation overhead in hot path.
	 *
	 * @var array
	 */
	private static array $prefixes = [ 'border-top', 'border-right', 'border-bottom', 'border-left' ];

	/**
	 * Collect all css selectors and declarations.
	 *
	 * @param array $setting the block setting.
	 *
	 * @return array Retrieve array of collection of css selectors and css declarations.
	 */
	protected function css( array $setting ): array {
		if ( 'border' !== ( $setting['type'] ?? null ) || ! isset( $setting['border'] ) ) {
			return [];
		}

		$value = $setting['border'];

		if ( ! isset( $value['type'] ) ) {
			return [];
		}

		if ( ! empty( $setting['_blockeraDeclarationOnly'] ) && ! empty( $setting['_blockeraGlobalPreset'] ) ) {
			$this->declarations['border'] = self::preset_box_to_shorthand( $value );

			return [];
		}

		$declaration = [];

		if ( 'all' === $value['type'] ) {
			if (isset($value['all']['valueType']) && 'variable' === $value['all']['valueType']) {
				$value['all']['settings']['value'] = $this->getSideValue($value['all']);
				$declaration['border']             = blockera_get_value_addon_real_value($value['all']);
			} else {
				$declaration['border'] = $this->getSideValue($value['all']);
			}
		} else {
			for ( $i = 0; $i < 4; ++$i ) {
				$side = self::$sides[ $i ];

				if (isset($value[ $side ]['valueType']) && 'variable' === $value[ $side ]['valueType']) {
					$value[ $side ]['settings']['value']  = $this->getSideValue($value[ $side ]);
					$declaration[ self::$prefixes[ $i ] ] = blockera_get_value_addon_real_value($value[ $side ]);
				} else {
					$declaration[ self::$prefixes[ $i ] ] = $this->getSideValue($value[ $side ]);
				}
			}
		}

		$this->setCss( $declaration );

		return $this->css;
	}

	/**
	 * Get the value of a side.
	 *
	 * @param array $value The value of the side.
	 *
	 * @return string The value of the side.
	 */
	protected function getSideValue( array $value ): string {
		if (isset($value['valueType']) && 'variable' === $value['valueType']) {
			$value = json_decode($value['settings']['value'], true)['all'] ?? [
				'width' => '',
				'style' => '',
				'color' => '',
			];
		}

		return self::side_to_css_shorthand( $value );
	}

	/**
	 * Border shorthand for one side (`width style color`), after variable refs are resolved to plain width/style/color.
	 *
	 * @param array{width?:string,style?:string,color?:string|array} $side Side data.
	 */
	public static function side_to_css_shorthand( array $side ): string {
		$width = isset( $side['width'] ) && is_string( $side['width'] ) ? $side['width'] : '';
		if ( '' === $width ) {
			return '';
		}
		$style = ( isset( $side['style'] ) && '' !== $side['style'] ) ? $side['style'] : 'solid';
		$color = '';
		if ( isset( $side['color'] ) && '' !== $side['color'] ) {
			$color = blockera_get_value_addon_real_value( $side['color'] );
		}

		return $width . ' ' . $style . ( '' !== $color ? ' ' . $color : '' );
	}

	/**
	 * Single preset CSS string for theme.json border box (all | custom sides).
	 *
	 * @param array $border Normalized border box (e.g. from theme.json sanitization).
	 */
	private static function preset_box_to_shorthand( array $border ): string {
		if ( 'all' === ( $border['type'] ?? '' ) && isset( $border['all'] ) && is_array( $border['all'] ) ) {
			return self::side_to_css_shorthand( $border['all'] );
		}

		if ( 'custom' !== ( $border['type'] ?? '' ) ) {
			return '';
		}

		$sides = array( 'top', 'right', 'bottom', 'left' );
		$out   = array();

		foreach ( $sides as $edge ) {
			if ( empty( $border[ $edge ] ) || ! is_array( $border[ $edge ] ) ) {
				$out[] = '';
				continue;
			}
			$out[] = self::side_to_css_shorthand( $border[ $edge ] );
		}

		return implode( ' ', $out );
	}
}
