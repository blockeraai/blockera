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

		if (isset($value['type']) && 'all' === $value['type']) {
			if (isset($value['all']['valueType']) && 'variable' === $value['all']['valueType']) {
				$value['all'] = json_decode($value['all']['settings']['value'], true)['all'] ?? [
					'width' => '',
					'style' => '',
					'color' => '',
				];
			}
		} else {
			foreach (self::$sides as $side) {
				if (isset($value[ $side ]['valueType']) && 'variable' === $value[ $side ]['valueType']) {
					$value[ $side ] = json_decode($value[ $side ]['settings']['value'], true)['all'] ?? [
						'width' => '',
						'style' => '',
						'color' => '',
					];
				}
			}
		}

		if ( ! isset( $value['type'] ) ) {
			return [];
		}

		$declaration = [];

		if ( 'all' === $value['type'] ) {
			$all   = &$value['all'];
			$width = $all['width'] ?? '';

			if ( '' === $width ) {
				$this->setCss( $declaration );
				return $this->css;
			}

			$style = ( '' !== $all['style'] ) ? $all['style'] : 'solid';

			$color = '';
			if ( isset( $all['color'] ) && '' !== $all['color'] ) {
				$color = blockera_get_value_addon_real_value( $all['color'] );
			}

			$declaration['border'] = $width . ' ' . $style . ( '' !== $color ? ' ' . $color : '' );
		} else {
			for ( $i = 0; $i < 4; ++$i ) {
				$side = self::$sides[ $i ];

				if ( ! isset( $value[ $side ]['width'] ) ) {
					continue;
				}

				$sideData = &$value[ $side ];
				$width    = $sideData['width'];

				if ( '' === $width ) {
					continue;
				}

				$style = ( '' !== $sideData['style'] ) ? $sideData['style'] : 'solid';

				$color = '';
				if ( isset( $sideData['color'] ) && '' !== $sideData['color'] ) {
					$color = blockera_get_value_addon_real_value( $sideData['color'] );
				}

				$declaration[ self::$prefixes[ $i ] ] = $width . ' ' . $style . ( '' !== $color ? ' ' . $color : '' );
			}
		}

		$this->setCss( $declaration );

		return $this->css;
	}

}
