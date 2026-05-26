<?php 

namespace Blockera\Editor\StyleDefinitions;

use Blockera\Editor\StyleDefinitions\BaseStyleDefinition;

class BorderRadius extends BaseStyleDefinition {

    protected function css( array $setting): array {
        
		$declaration = [];
		$cssProperty = $setting['type'];

		if ( empty( $cssProperty ) || empty( $setting[ $cssProperty ] ) || 'border-radius' !== $cssProperty ) {

			return $declaration;
		}

		$border_radius_config = $this->getStyleEngineConfig('blockeraBorderRadius');
		$value                = $setting[ $cssProperty ];

		if (! empty($value['type']) && 'all' === $value['type']) {

			$declaration[ $border_radius_config['all'] ] = ! empty($value['all']) ? blockera_get_value_addon_real_value($value['all']) : '';

		} else {

			$declaration[ $border_radius_config['topLeft'] ]     = ! empty($value['topLeft']) ? blockera_get_value_addon_real_value($value['topLeft']) : '';
			$declaration[ $border_radius_config['topRight'] ]    = ! empty($value['topRight']) ? blockera_get_value_addon_real_value($value['topRight']) : '';
			$declaration[ $border_radius_config['bottomRight'] ] = ! empty($value['bottomRight']) ? blockera_get_value_addon_real_value($value['bottomRight']) : '';
			$declaration[ $border_radius_config['bottomLeft'] ]  = ! empty($value['bottomLeft']) ? blockera_get_value_addon_real_value($value['bottomLeft']) : '';
		}

		$this->setCss( $declaration );

		return $this->css;
    }
}
