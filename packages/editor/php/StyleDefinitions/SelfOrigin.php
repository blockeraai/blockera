<?php

namespace Blockera\Editor\StyleDefinitions;

class SelfOrigin extends BaseStyleDefinition {

    protected function css( array $setting): array {
     
		$declaration = [];
		$cssProperty = $setting['type'];

		if ( empty( $cssProperty ) || empty( $setting[ $cssProperty ] ) || 'self-origin' !== $cssProperty ) {

			return $declaration;
		}

		$top  = isset($settings[ $cssProperty ]['top']) ? blockera_get_value_addon_real_value($settings[ $cssProperty ]['top']) : '';
		$left = isset($settings[ $cssProperty ]['left']) ? blockera_get_value_addon_real_value($settings[ $cssProperty ]['left']) : '';

		if (! empty($top) && ! empty($left)) {

			$this->setDeclaration('transform-origin', "{$top} {$left}");
		}

		$this->setCss( $this->declarations );

		return $this->css;
    }
}
