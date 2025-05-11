<?php

namespace Blockera\Editor\StyleDefinitions;

class ObjectPosition extends BaseStyleDefinition {

    protected function css( array $setting): array {
     
		$declaration = [];
		$cssProperty = $setting['type'];

		if ( empty( $cssProperty ) || empty( $setting[ $cssProperty ] ) || 'object-position' !== $cssProperty ) {

			return $declaration;
		}
				
		$this->setDeclaration(
            $cssProperty,
            sprintf(
                '%1$s %2$s',
                $setting[ $cssProperty ]['top'],
                $setting[ $cssProperty ]['left']
            )
        );

		$this->setCss( $this->declarations );

		return $this->css;
    }
}
