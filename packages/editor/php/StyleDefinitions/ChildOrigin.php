<?php

namespace Blockera\Editor\StyleDefinitions;

use Blockera\Editor\StyleDefinitions\BaseStyleDefinition;

class ChildOrigin extends BaseStyleDefinition {

	protected function css( array $setting): array {

		$declaration = [];
		$cssProperty = $setting['type'];

		if ( empty( $cssProperty ) || empty( $setting[ $cssProperty ] ) || 'child-origin' !== $cssProperty ) {

			return $declaration;
		}
		
		$top  = $settings[ $cssProperty ]['top'] ?? '';
		$left = $settings[ $cssProperty ]['left'] ?? '';

		if (! empty($top) && ! empty($left)) {
			$this->setDeclaration('perspective-origin', "{$top} {$left}");
		}

		$this->setCss( $this->declarations );

		return $this->css;
	}
}
