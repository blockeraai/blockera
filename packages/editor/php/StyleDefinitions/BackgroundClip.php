<?php 

namespace Blockera\Editor\StyleDefinitions;

use Blockera\Editor\StyleDefinitions\BaseStyleDefinition;

class BackgroundClip extends BaseStyleDefinition {

    protected function css( array $setting): array {
        
		$cssProperty = $setting['type'] ?? '';

		if ( 'background-clip' !== $cssProperty || ! isset( $setting[ $cssProperty ] ) ) {
			return [];
		}

		$value = $setting[ $cssProperty ];		
		
		$declarations                            = &$this->declarations;
		$declarations[ $cssProperty ]            = $value;
		$declarations['-webkit-background-clip'] = $value;

		if ( 'text' === $value ) {
			$declarations['-webkit-text-fill-color'] = 'transparent';
		}

		$this->setCss( $declarations );

		return $this->css;
    }
}

