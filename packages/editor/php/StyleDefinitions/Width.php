<?php

namespace Blockera\Editor\StyleDefinitions;

class Width extends BaseStyleDefinition {

	protected function css( array $setting): array {
		$cssProperty = $setting['type'] ?? '';

		if ('' === $cssProperty || 'width' !== $cssProperty) {
			return [];
		}

		$settingValue = $setting[ $cssProperty ] ?? null;
		if (null === $settingValue || '' === $settingValue) {
			return [];
		}

		$width_config = $this->getStyleEngineConfig('blockeraWidth');
		$key          = $width_config['width'] ?? '';
		if ('' === $key) {
			return [];
		}

		$value = blockera_get_value_addon_real_value($settingValue);

		if ('stretch' === $value && 'width' === $key) {
			$key = 'width: 100%; width: -moz-available; width: -webkit-fill-available; width';
		}

		// Use !important only for flex-basis because WP have some styles for flex-basis with !important.
		if ('flex-basis' === $key) {
			$value .= ' !important';
		}

		$this->setDeclaration($key, $value);
		$this->setCss($this->declarations);

		return $this->css;
	}
}
