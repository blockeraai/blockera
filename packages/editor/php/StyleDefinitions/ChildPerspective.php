<?php

namespace Blockera\Editor\StyleDefinitions;

class ChildPerspective extends BaseStyleDefinition {

	protected function css( array $setting ): array {
		if ( ! isset( $setting['type'], $setting['child-perspective'] ) || 'child-perspective' !== $setting['type'] ) {
			return [];
		}

		$settingValue = $setting['child-perspective'];

		if ( '' === $settingValue || null === $settingValue ) {
			return [];
		}

		$childPerspective = blockera_get_value_addon_real_value( $settingValue );

		if ( '' === $childPerspective || null === $childPerspective ) {
			return $this->css;
		}

		$this->declarations['perspective'] = '0px' !== $childPerspective ? $childPerspective : 'none';
		$this->setCss( $this->declarations );

		return $this->css;
	}
}
