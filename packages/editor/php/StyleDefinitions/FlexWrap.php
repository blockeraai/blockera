<?php

namespace Blockera\Editor\StyleDefinitions;

class FlexWrap extends BaseStyleDefinition {

	protected function css( array $setting): array {

        $declaration = [];
        $cssProperty = $setting['type'];

        if (empty($cssProperty) || empty($setting[ $cssProperty ]) || 'flex-wrap' !== $cssProperty) {

            return $declaration;
		}		
		
		// Backward compatibility for flex-wrap value, because flex-wrap changed from value to val in the new version.
		$flexWrap                = $setting['flex-wrap'];
		$optimizeStyleGeneration = blockera_get_admin_options([ 'earlyAccessLab', 'optimizeStyleGeneration' ]);

		if (! empty($flexWrap['value']) || ! empty($flexWrap['val'])) {

			$this->setDeclaration($cssProperty, ( $flexWrap['value'] ?? $flexWrap['val'] ) . ( $flexWrap['reverse'] && 'wrap' === ( $flexWrap['value'] ?? $flexWrap['val'] ) ? '-reverse' : '' ) . ( $optimizeStyleGeneration ? ' !important' : '' ));
		}

		$this->setCss($this->declarations);

        return $this->css;
    }
}
