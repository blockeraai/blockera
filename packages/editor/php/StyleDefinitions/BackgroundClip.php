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
        
        $declaration = array_merge(
			[
				$cssProperty              => $setting[ $cssProperty ],
				'-webkit-background-clip' => $setting[ $cssProperty ],
			],
			'text' === $setting[ $cssProperty ] ? [ '-webkit-text-fill-color' => 'transparent' ] : []
		);

		$this->setCss($declaration);

		return $this->css;
    }
}

