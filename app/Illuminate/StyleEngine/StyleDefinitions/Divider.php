<?php

namespace Blockera\Framework\Illuminate\StyleEngine\StyleDefinitions;

/**
 * Class Divider definition to generate css rules.
 *
 * @package Divider
 */
class Divider extends BaseStyleDefinition {

	public function getAllowedProperties(): array {

		return [
			'blockeraDivider' => '',
		];
	}

	protected function css( array $setting ): array {

		$declaration = [];
		$cssProperty = $setting['type'];

		if ( empty( $cssProperty ) ) {

			return $declaration;
		}

		$this->setSelector( $cssProperty );

		return $this->css;
	}
}
