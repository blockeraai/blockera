<?php

namespace Blockera\Editor\StyleDefinitions;

class Mouse extends BaseStyleDefinition {

	/**
	 * Collect all css selectors and declarations.
	 *
	 * @param array $setting
	 *
	 * @return array
	 */
	public function css( array $setting ): array {

		$cssProperty = $setting['type'];

		if ( empty( $cssProperty ) ) {

			return [];
		}

		$this->setCss(
			[
				$cssProperty => $setting[ $cssProperty ],
			]
		);

		return $this->css;
	}

}
