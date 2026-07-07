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

		// core/icon uses blockeraWidth for icon size; keep SVG square when height is unset.
		if ('core/icon' === ( $this->block['blockName'] ?? '' )) {
			$height_setting = $this->getCurrentBreakpointSettings()['blockeraHeight'] ?? null;
			$height_raw     = is_array($height_setting) ? ( $height_setting['value'] ?? '' ) : $height_setting;

			if ('' === $height_raw || null === $height_raw) {
				$height_config = $this->getStyleEngineConfig('blockeraHeight');
				$height_key    = $height_config['height'] ?? 'height';

				if ('' === $height_key) {
					$height_key = 'height';
				}

				if ('stretch' === $value && 'height' === $height_key) {
					$height_key = 'height: 100%; height: -moz-available; height: -webkit-fill-available; height';
				}

				$this->setDeclaration($height_key, $value);
			}
		}

		$this->setCss($this->declarations);

		return $this->css;
	}
}
