<?php

namespace Blockera\Editor\StyleDefinitions;

class FlexWrap extends BaseStyleDefinition {

	protected function css( array $setting): array {

		if (! isset($setting['type'])) {
			return [];
		}

		$cssProperty = $setting['type'];

		if (( 'flex-wrap' !== $cssProperty ) || ! isset($setting[ $cssProperty ])) {
			return [];
		}

		if (! isset($setting['flex-wrap'])) {
			return [];
		}

		$flexWrap = $setting['flex-wrap'];

		if (empty($flexWrap['value']) && empty($flexWrap['val'])) {
			return [];
		}

		$value                              = $flexWrap['value'] ?? $flexWrap['val'];
		$suffix                             = ( isset($flexWrap['reverse']) && $flexWrap['reverse'] && 'wrap' === $value ) ? '-reverse' : '';
		$this->declarations[ $cssProperty ] = $value . $suffix . ' !important';

		$this->setCss($this->declarations);

		return $this->css;
	}
}
