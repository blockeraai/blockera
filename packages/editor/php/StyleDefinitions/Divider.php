<?php

namespace Blockera\Editor\StyleDefinitions;

/**
 * Class Divider definition to generate css rules.
 *
 * @package Divider
 */
class Divider extends BaseStyleDefinition {

	protected function css( array $setting ): array {
		$cssProperty = $setting['type'] ?? '';

		if ( '' === $cssProperty ) {
			return [];
		}

		return $this->css;
	}
}
