<?php

namespace Blockera\Editor\StyleDefinitions;

/**
 * Class Divider definition to generate css rules.
 *
 * @package Divider
 */
class Divider extends BaseStyleDefinition {

	protected function css( array $setting ): array {

		$declaration = [];
		$cssProperty = $setting['type'];

		if ( empty( $cssProperty ) ) {

			return $declaration;
		}

		return $this->css;
	}
}
