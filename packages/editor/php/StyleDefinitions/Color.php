<?php

namespace Blockera\Editor\StyleDefinitions;

class Color extends BaseStyleDefinition {

	protected function css( array $setting): array {

        $declaration = [];
        $cssProperty = $setting['type'];

        if (empty($cssProperty) || empty($setting[ $cssProperty ]) || 'color' !== $cssProperty) {

            return $declaration;
		}

		$this->setDeclaration($cssProperty, $setting[ $cssProperty ] ? blockera_get_value_addon_real_value( $setting[ $cssProperty ] ) : '');

		$this->setCss($this->declarations);

        return $this->css;
    }
}
