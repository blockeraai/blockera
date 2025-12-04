<?php
namespace Blockera\Editor\StyleDefinitions\Traits;

trait WidthDefinitionTrait {

	protected function css( array $setting): array {

        $declaration  = [];
        $cssProperty  = $setting['type'];
		$key          = $this->getCssProperty();
		$is_important = $this->isImportant() ? ' !important' : '';

        if (empty($cssProperty) || empty($setting[ $cssProperty ]) || $key !== $cssProperty) {

            return $declaration;
		}

		$value = blockera_get_value_addon_real_value($setting[ $cssProperty ]);

		if ( 'stretch' === $value ) {
			$key = "{$key}: 100%; {$key}: -moz-available{$is_important};{$key}: -webkit-fill-available{$is_important};{$key}";
		}

		$this->setDeclaration(
			$key, 
			$value
		);

		$this->setCss($this->declarations);

        return $this->css;
    }
}
