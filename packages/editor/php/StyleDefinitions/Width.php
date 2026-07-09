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

		$this->setDeclaration($width_config['width'], blockera_get_value_addon_real_value($setting[ $cssProperty ]));

		$this->setCss($this->declarations);

        return $this->css;
    }
}
