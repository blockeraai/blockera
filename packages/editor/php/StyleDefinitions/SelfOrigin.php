<?php

namespace Blockera\Editor\StyleDefinitions;

class SelfOrigin extends BaseStyleDefinition {

	protected function css( array $setting ): array {
		if ( ! isset( $setting['type'], $setting['self-origin'] ) || 'self-origin' !== $setting['type'] ) {
			return [];
		}

		$originData = $setting['self-origin'];

		if ( ! isset( $originData['top'], $originData['left'] ) ) {
			$this->setCss( $this->declarations );

			return $this->css;
		}

		$top  = blockera_get_value_addon_real_value( $originData['top'] );
		$left = blockera_get_value_addon_real_value( $originData['left'] );

		if ( '' !== $top && '' !== $left ) {
			$this->setDeclaration( 'transform-origin', $top . ' ' . $left );
		}

		$this->setCss( $this->declarations );

		return $this->css;
	}
}
