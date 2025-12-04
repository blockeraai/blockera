<?php

namespace Blockera\Editor\StyleDefinitions;

class Width extends BaseStyleDefinition {

	protected function css( array $setting): array {

        $declaration = [];
        $cssProperty = $setting['type'];

        if (empty($cssProperty) || empty($setting[ $cssProperty ]) || 'width' !== $cssProperty) {

            return $declaration;
		}
		
		$width_config = $this->getStyleEngineConfig('blockeraWidth');

		$key   = $width_config['width'];
		$value = blockera_get_value_addon_real_value($setting[ $cssProperty ]);

		if ( 'stretch' === $value && 'width' === $key ) {
			$key = 'width: 100%; width: -moz-available; width: -webkit-fill-available; width';
		}

		$this->setDeclaration(
			$key, 
			// Use !important only for flex-basis because WP have some styles for flex-basis with !important.
			$value . ( 'flex-basis' === $key ? ' !important' : '' )
		);

		$this->setCss($this->declarations);

        return $this->css;
    }
}
