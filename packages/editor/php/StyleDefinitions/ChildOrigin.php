<?php

namespace Blockera\Editor\StyleDefinitions;

class ChildOrigin extends BaseStyleDefinition {

	protected function css( array $setting ): array {
		if ( ! isset( $setting['type'] ) || 'child-origin' !== $setting['type'] ) {
			return $this->css;
		}

		$childOrigin = $setting['child-origin'] ?? null;

		if ( ! is_array( $childOrigin ) || ! isset( $childOrigin['top'], $childOrigin['left'] ) ) {
			return $this->css;
		}

		$top  = $childOrigin['top'];
		$left = $childOrigin['left'];

		if ( '' !== $top && '' !== $left ) {
			$this->setDeclaration( 'perspective-origin', $top . ' ' . $left );
		}

		$this->setCss( $this->declarations );

		return $this->css;
	}
}
