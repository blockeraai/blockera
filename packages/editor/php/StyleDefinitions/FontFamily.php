<?php

namespace Blockera\Editor\StyleDefinitions;

class FontFamily extends BaseStyleDefinition {

	protected function css( array $setting ): array {
		if ( ! isset( $setting['type'], $setting['font-family'] ) || 'font-family' !== $setting['type'] ) {
			return [];
		}

		$this->declarations['font-family'] = 'var(--wp--preset--font-family--' . $setting['font-family'] . ')';
		$this->setCss( $this->declarations );

		return $this->css;
	}
}
