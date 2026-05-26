<?php 

namespace Blockera\Editor\StyleDefinitions;

use Blockera\Editor\StyleDefinitions\BaseStyleDefinition;

class BackgroundColor extends BaseStyleDefinition {

    protected function css( array $setting): array {
        
		$declaration = [];
		$cssProperty = $setting['type'];

		if ( empty( $cssProperty ) || empty( $setting[ $cssProperty ] ) || 'background-color' !== $cssProperty ) {

			return $declaration;
		}

		$this->setDeclaration($cssProperty, blockera_get_value_addon_real_value($setting[ $cssProperty ]));	

		$this->setCss($this->declarations);

		return $this->css;
    }
}

