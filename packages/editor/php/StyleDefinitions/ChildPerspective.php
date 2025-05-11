<?php

namespace Blockera\Editor\StyleDefinitions;

use Blockera\Editor\StyleDefinitions\BaseStyleDefinition;

class ChildPerspective extends BaseStyleDefinition {

	protected function css( array $setting): array {

		$declaration = [];
		$cssProperty = $setting['type'];

		if ( empty( $cssProperty ) || empty( $setting[ $cssProperty ] ) || 'child-perspective' !== $cssProperty ) {

			return $declaration;
		}
		
		$childPerspective = blockera_get_value_addon_real_value($setting[ $cssProperty ]);

		if (! empty($childPerspective)) {
			$this->setDeclaration(
				'perspective',
				'0px' !== $childPerspective ? $childPerspective : 'none'
			);
		}

		$this->setCss( $this->declarations );

		return $this->css;
	}
}
