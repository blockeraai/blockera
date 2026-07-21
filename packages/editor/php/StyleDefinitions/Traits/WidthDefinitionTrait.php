<?php
namespace Blockera\Editor\StyleDefinitions\Traits;

trait WidthDefinitionTrait {

	protected function css( array $setting): array {
		if ( ! isset( $setting['type'] ) ) {
			return [];
		}

		$cssProperty = $setting['type'];
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
			$isImportant     = $this->isImportant();
			$importantSuffix = $isImportant ? ' !important' : '';
			$key             = $key . ': 100%; ' . $key . ': -moz-available' . $importantSuffix . ';' . $key . ': -webkit-fill-available' . $importantSuffix . ';' . $key;
		}

		$this->setDeclaration( $key, $value );
		$this->setCss( $this->declarations );

		return $this->css;
	}
}
