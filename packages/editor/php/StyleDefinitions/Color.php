<?php

namespace Blockera\Editor\StyleDefinitions;

class Color extends BaseStyleDefinition {

	protected function css( array $setting ): array {
		if ( ! isset( $setting['type'] ) || 'color' !== $setting['type'] ) {
			return [];
		}

		$value = $setting['color'] ?? '';

		if ( '' === $value ) {
			return [];
		}

		$this->setDeclaration( 'color', blockera_get_value_addon_real_value( $value ) );
		$this->setCss( $this->declarations );

		return $this->css;
	}
}
