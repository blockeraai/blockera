<?php

namespace Blockera\Editor\StyleDefinitions;

use Blockera\Editor\StyleDefinitions\Contracts\Repeater;

class TextShadow extends BaseStyleDefinition implements Repeater {

    protected function css( array $setting): array {

		$declaration = [];
		$cssProperty = $setting['type'];

		if ( empty( $cssProperty ) || empty( $setting[ $cssProperty ] ) || 'text-shadow' !== $cssProperty ) {

			return $declaration;
		}

		$filteredTextShadows = array_values(array_filter(blockera_get_sorted_repeater($setting[ $cssProperty ]), [ $this, 'isValidSetting' ]));

		if (empty($filteredTextShadows)) {

			return $declaration;
		}
		
		$this->setTextShadow($filteredTextShadows[0]);

		$this->setCss( $this->declarations );

		return $this->css;
	}

	/**
	 * Check if the setting is valid.
	 *
	 * @param array $setting The setting.
	 *
	 * @return bool true if the setting is valid, false otherwise.
	 */
	public function isValidSetting( array $setting): bool {
		
		return ! empty( $setting['isVisible'] );
	}

	/**
	 * Setup transform style properties into stack properties.
	 *
	 * @param array $setting the transform setting.
	 *
	 * @return void
	 */
	protected function setTextShadow( array $setting ): void {
		
		$this->setDeclaration(
            'text-shadow',
            sprintf(
                '%1$s %2$s %3$s %4$s',
                ! empty($setting['x']) ? blockera_get_value_addon_real_value($setting['x']) : '',
                ! empty($setting['y']) ? blockera_get_value_addon_real_value($setting['y']) : '',
                ! empty($setting['blur']) ? blockera_get_value_addon_real_value($setting['blur']) : '',
                ! empty($setting['color']) ? blockera_get_value_addon_real_value($setting['color']) : '',
            )
        );
	}
}
