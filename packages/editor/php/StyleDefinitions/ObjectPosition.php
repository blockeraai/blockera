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
	protected function css( array $setting ): array {
		if ( ! isset( $setting['type'] ) || 'object-position' !== $setting['type'] ) {
			return [];
		}

		$positionData = $setting['object-position'] ?? null;

		if ( null === $positionData || ! isset( $positionData['top'], $positionData['left'] ) ) {
			return [];
		}

		$this->declarations['object-position'] = $positionData['top'] . ' ' . $positionData['left'];
		$this->setCss( $this->declarations );

		return $this->css;
	}
}
