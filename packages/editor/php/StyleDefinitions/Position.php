<?php

namespace Blockera\Editor\StyleDefinitions;

/**
 * Class Position to generate css for supported position properties in css.
 *
 * @package Position
 */
class Position extends BaseStyleDefinition {

	/**
	 * Collect all css selectors and declarations.
	 *
	 * @param array $setting the block setting.
	 *
	 * @return array
	 */
	protected function css( array $setting ): array {

		if ( ! isset( $setting['type'] ) || 'position' !== $setting['type'] || ! isset( $setting['position'] ) ) {
			return [];
		}

		$positionData = $setting['position'];

		if ( ! isset( $positionData['type'], $positionData['position'] ) || ! is_array( $positionData['position'] ) ) {
			return [];
		}

		$this->declarations['position'] = $positionData['type'];

		foreach ( $positionData['position'] as $property => $item ) {
			if ( $item ) {
				$this->declarations[ $property ] = blockera_get_value_addon_real_value( $item );
			}
		}

		$this->setCss( $this->declarations );

		return $this->css;
	}
}
