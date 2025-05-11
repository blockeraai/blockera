<?php

namespace Blockera\Editor\StyleDefinitions;

use Blockera\Editor\StyleDefinitions\Contracts\Repeater;

class Outline extends BaseStyleDefinition implements Repeater {

	/**
	 * @inheritDoc
	 *
	 * @param array $setting
	 *
	 * @return array
	 */
	protected function css( array $setting ): array {

		$cssProperty = $setting['type'];

		if ( empty( $cssProperty ) ) {

			return [];
		}

		$filteredOutlines = array_values(array_filter(blockera_get_sorted_repeater($setting[ $cssProperty ]), [ $this, 'isValidSetting' ]));

		if (empty($filteredOutlines)) {

			return [];

		}

		$this->setOutline($filteredOutlines[0]);
		
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

		return ! empty($setting['type']) && ! empty($setting['isVisible']);
	}

	/**
	 * Setup outline style properties into stack properties.
	 *
	 * @param array $setting the outline setting.
	 *
	 * @return void
	 */
	protected function setOutline( array $setting): void {

		$this->setDeclaration(
            'outline',
            sprintf(
                '%s %s %s',
                $setting['border']['width'],
                $setting['border']['style'],
                ! empty( $setting['border']['color'] ) ? blockera_get_value_addon_real_value( $setting['border']['color'] ) : '',
            )
        );

		$this->setDeclaration('outline-offset', ! empty( $setting['offset'] ) ? blockera_get_value_addon_real_value( $setting['offset'] ) : '');
	}
}
