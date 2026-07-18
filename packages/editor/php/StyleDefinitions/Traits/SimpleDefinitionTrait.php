<?php

namespace Blockera\Editor\StyleDefinitions\Traits;

use Blockera\Editor\StyleDefinitions\Contracts\StandardDefinition;

trait SimpleDefinitionTrait {

	protected function css( array $setting ): array {

		if ( ! $this instanceof StandardDefinition ) {
			return [];
		}

		$cssProperty = $setting['type'] ?? '';
		if ( '' === $cssProperty ) {
			return [];
		}

		// Cache method_exists per concrete class (Group A never defines validate()).
		static $has_validate = [];
		$class               = static::class;
		if ( ! isset( $has_validate[ $class ] ) ) {
			$has_validate[ $class ] = method_exists( $this, 'validate' );
		}
		if ( $has_validate[ $class ] && ! $this->validate( $setting ) ) {
			return [];
		}

		if ( $this->getCssProperty() !== $cssProperty ) {
			return [];
		}

		if ( ! isset( $setting[ $cssProperty ] ) || '' === $setting[ $cssProperty ] ) {
			return [];
		}

		$this->setDeclaration( $cssProperty, blockera_get_value_addon_real_value( $setting[ $cssProperty ] ) );
		$this->setCss( $this->declarations );

		return $this->css;
	}
}
