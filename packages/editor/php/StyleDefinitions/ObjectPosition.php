<?php

namespace Blockera\Editor\StyleDefinitions;

class ObjectPosition extends BaseStyleDefinition {

	/**
	 * Generate CSS declarations for object-position property.
	 *
	 * @param array $setting The block setting.
	 *
	 * @return array Retrieve array of collection of css selectors and css declarations.
	 */
	protected function css( array $setting): array {
		$cssProperty = $setting['type'] ?? '';

		if ( 'object-position' !== $cssProperty ) {
			return [];
		}

		$positionData = $setting[ $cssProperty ] ?? null;
		if ( null === $positionData || ! isset( $positionData['top'], $positionData['left'] ) ) {
			return [];
		}

		$this->declarations[ $cssProperty ] = $positionData['top'] . ' ' . $positionData['left'];
		$this->setCss( $this->declarations );

		return $this->css;
	}
}
