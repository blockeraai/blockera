<?php

namespace Blockera\Editor\StyleDefinitions\Traits;

trait WidthDefinitionTrait {

	protected function css( array $setting ): array {

		$cssProperty = $setting['type'] ?? '';
		if ( '' === $cssProperty ) {
			return [];
		}

		$key = $this->getCssProperty();
		if ( $key !== $cssProperty ) {
			return [];
		}

		if ( ! isset( $setting[ $cssProperty ] ) || '' === $setting[ $cssProperty ] ) {
			return [];
		}

		$value = blockera_get_value_addon_real_value( $setting[ $cssProperty ] );

		if ( 'stretch' === $value ) {
			// Pre-bake important suffix to avoid repeated concat of empty string.
			if ( $this->isImportant() ) {
				$key = $key . ': 100%; ' . $key . ': -moz-available !important;' . $key . ': -webkit-fill-available !important;' . $key;
			} else {
				$key = $key . ': 100%; ' . $key . ': -moz-available;' . $key . ': -webkit-fill-available;' . $key;
			}
		}

		$this->setDeclaration( $key, $value );
		$this->setCss( $this->declarations );

		return $this->css;
	}
}
