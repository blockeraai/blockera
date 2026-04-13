<?php

namespace Blockera\Editor\StyleDefinitions;

class FontFamily extends BaseStyleDefinition {

	protected function css( array $setting): array {
		if (! isset($setting['type'])) {
			return [];
		}

		$cssProperty = $setting['type'];
		
		if ('font-family' !== $cssProperty || ! isset($setting[ $cssProperty ])) {
			return [];
		}
		
		$value = $setting[ $cssProperty ];
		
		$this->declarations[ $cssProperty ] = 'var(--wp--preset--font-family--' . $value . ')';
		
		$this->setCss($this->declarations);
		
		return $this->css;
	}
}
