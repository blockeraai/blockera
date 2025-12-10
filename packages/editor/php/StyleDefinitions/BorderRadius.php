<?php 

namespace Blockera\Editor\StyleDefinitions;

use Blockera\Editor\StyleDefinitions\BaseStyleDefinition;

class BorderRadius extends BaseStyleDefinition {

	/**
	 * Generate CSS declarations for border-radius.
	 * Optimized for minimal function calls and array access overhead.
	 */
    protected function css( array $setting): array {
		$cssProperty = $setting['type'] ?? null;
		
		if ( 'border-radius' !== $cssProperty || ! isset( $setting[ $cssProperty ] ) ) {
			return [];
		}

		$border_radius_config = $this->getStyleEngineConfig('blockeraBorderRadius');
		
		$value       = $setting[ $cssProperty ];
		$declaration = [];
		$valueType   = $value['type'] ?? null;

		if ( 'all' === $valueType ) {
			$configAll                 = $border_radius_config['all'];
			$allValue                  = $value['all'] ?? null;
			$declaration[ $configAll ] = ! empty( $allValue )
				? blockera_get_value_addon_real_value($allValue)
				: '';
		} else {
			$configTopLeft     = $border_radius_config['topLeft'];
			$configTopRight    = $border_radius_config['topRight'];
			$configBottomRight = $border_radius_config['bottomRight'];
			$configBottomLeft  = $border_radius_config['bottomLeft'];

			$topLeftValue                  = $value['topLeft'] ?? null;
			$declaration[ $configTopLeft ] = ! empty( $topLeftValue )
				? blockera_get_value_addon_real_value($topLeftValue)
				: '';
			
			$topRightValue                  = $value['topRight'] ?? null;
			$declaration[ $configTopRight ] = ! empty( $topRightValue )
				? blockera_get_value_addon_real_value($topRightValue)
				: '';
			
			$bottomRightValue                  = $value['bottomRight'] ?? null;
			$declaration[ $configBottomRight ] = ! empty( $bottomRightValue )
				? blockera_get_value_addon_real_value($bottomRightValue)
				: '';
			
			$bottomLeftValue                  = $value['bottomLeft'] ?? null;
			$declaration[ $configBottomLeft ] = ! empty( $bottomLeftValue )
				? blockera_get_value_addon_real_value($bottomLeftValue)
				: '';
		}

		$this->setCss( $declaration );

		return $this->css;
    }
}
