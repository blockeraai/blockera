<?php

namespace Blockera\Editor\StyleDefinitions;

class Mouse extends BaseStyleDefinition {

	/**
	 * Collect all css selectors and declarations.
	 *
	 * @param array $setting
	 *
	 * @return array
	 */
	public function css( array $setting ): array {

		$cssProperty = $setting['type'];

		if ( empty( $cssProperty ) ) {

			return [];
		}

		$this->setDeclaration( $cssProperty, $setting[ $cssProperty ] );

		$this->setCss( $this->declarations );

		return $this->css;
	}
}
