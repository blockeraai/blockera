<?php

namespace Blockera\Editor\StyleDefinitions;

class BackgroundColor extends BaseStyleDefinition {

	protected function css( array $setting ): array {
		if ( ! isset( $setting['type'], $setting['background-color'] ) || 'background-color' !== $setting['type'] ) {
			return [];
		}

		$value = $setting['background-color'];

		if ( '' === $value ) {
			return [];
		}

		$this->setDeclaration( 'background-color', blockera_get_value_addon_real_value( $value ) );
		$this->setCss( $this->declarations );

		return $this->css;
	}
}
