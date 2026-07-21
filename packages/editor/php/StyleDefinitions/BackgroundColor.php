<?php 

namespace Blockera\Editor\StyleDefinitions;

use Blockera\Editor\StyleDefinitions\BaseStyleDefinition;

class BackgroundColor extends BaseStyleDefinition {

    protected function css( array $setting): array {
		$cssProperty = $setting['type'] ?? null;

		if ( 'background-color' !== $cssProperty || ! isset( $setting[ $cssProperty ] ) || '' === $setting[ $cssProperty ] ) {
			return [];
		}

		$this->setDeclaration( $cssProperty, blockera_get_value_addon_real_value( $setting[ $cssProperty ] ) );
		$this->setCss( $this->declarations );

		return $this->css;
    }
}

