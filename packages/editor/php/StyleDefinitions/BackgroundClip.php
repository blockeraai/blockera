<?php 

namespace Blockera\Editor\StyleDefinitions;

use Blockera\Editor\StyleDefinitions\BaseStyleDefinition;

class BackgroundClip extends BaseStyleDefinition {

    protected function css( array $setting): array {
        
		$declaration = [];
		$cssProperty = $setting['type'];

		if ( empty( $cssProperty ) || empty( $setting[ $cssProperty ] ) || 'background-clip' !== $cssProperty ) {

			return $declaration;
		}

		$this->setDeclaration($cssProperty, $setting[ $cssProperty ]);
		$this->setDeclaration('-webkit-background-clip', $setting[ $cssProperty ]);

		if ('text' === $setting[ $cssProperty ]) {

			$this->setDeclaration('-webkit-text-fill-color', 'transparent');
		}

		$this->setCss($this->declarations);

		return $this->css;
    }
}

