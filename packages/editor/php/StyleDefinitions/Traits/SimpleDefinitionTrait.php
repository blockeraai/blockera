<?php

namespace Blockera\Editor\StyleDefinitions\Traits;

use Blockera\Editor\StyleDefinitions\Contracts\StandardDefinition;

trait SimpleDefinitionTrait {

	protected function css( array $setting): array {
		if ( ! $this instanceof StandardDefinition) {
			return [];
		}

		if ( ! isset( $setting['type'] ) ) {
			return [];
		}

		$cssProperty = $setting['type'];
		if ( '' === $cssProperty ) {
			return [];
		}

		// Validate the setting before generating css if the method validate exists.
		if ( method_exists( $this, 'validate' ) && ! $this->validate( $setting ) ) {
			return [];
		}

		$expectedProperty = $this->getCssProperty();
		if ( $expectedProperty !== $cssProperty ) {
			return [];
		}

		if ( ! isset( $setting[ $cssProperty ] ) || '' === $setting[ $cssProperty ] ) {
			return [];
		}

		$settingValue = $setting[ $cssProperty ];
		$this->setDeclaration( $cssProperty, blockera_get_value_addon_real_value( $settingValue ) );
		$this->setCss( $this->declarations );

		return $this->css;
	}
}
