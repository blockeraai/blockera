<?php

namespace Blockera\Editor\StyleDefinitions;

class MaxWidth extends BaseStyleDefinition {

	protected function css( array $setting): array {

        $declaration = [];
        $cssProperty = $setting['type'];

        if (empty($cssProperty) || empty($setting[ $cssProperty ]) || 'max-width' !== $cssProperty) {

            return $declaration;
        }
		
		$optimizeStyleGeneration = blockera_get_admin_options([ 'earlyAccessLab', 'optimizeStyleGeneration' ]);

		$this->setDeclaration( $cssProperty, blockera_get_value_addon_real_value($setting[ $cssProperty ]) . ( $optimizeStyleGeneration ? ' !important' : '' ));

		$this->setCss($this->declarations);

        return $this->css;
    }
}
