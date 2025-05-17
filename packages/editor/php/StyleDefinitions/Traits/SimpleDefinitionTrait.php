<?php

namespace Blockera\Editor\StyleDefinitions\Traits;

use Blockera\Editor\StyleDefinitions\Contracts\StandardDefinition;

trait SimpleDefinitionTrait {

    protected function css( array $setting): array {

        $declaration = [];
        $cssProperty = $setting['type'];

		if (! $this instanceof StandardDefinition) {

			return $declaration;
		}

		// Validate the setting before generating css if the method validate exists.
		if (method_exists($this, 'validate') && ! $this->validate($setting)) {
			
			return $declaration;
		}

        if (empty($cssProperty) || empty($setting[ $cssProperty ]) || $this->getCssProperty() !== $cssProperty) {

            return $declaration;
        }

        $this->setDeclaration($cssProperty, blockera_get_value_addon_real_value($setting[ $cssProperty ]));

        $this->setCss($this->declarations);

        return $this->css;
    }
}
