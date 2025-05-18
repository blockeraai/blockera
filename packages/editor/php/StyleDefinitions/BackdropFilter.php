<?php

namespace Blockera\Editor\StyleDefinitions;

use Blockera\Editor\StyleDefinitions\Contracts\Repeater;

class BackdropFilter extends BaseStyleDefinition implements Repeater {

    protected function css( array $setting): array {

        $declaration = [];
        $cssProperty = $setting['type'];

        if (empty($cssProperty) || empty($setting[ $cssProperty ]) || 'backdrop-filter' !== $cssProperty) {

            return $declaration;
        }

        $filteredBackdropFilters = array_values(array_filter(blockera_get_sorted_repeater($setting[ $cssProperty ]), [ $this, 'isValidSetting' ]));

		if (empty($filteredBackdropFilters)) {
			
			return $declaration;
		}

        $this->setBackdropFilter($filteredBackdropFilters[0]);

        $this->setCss($this->declarations);

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

        if (empty($setting['type'])) {

            return false;
        }

        return ! empty($setting['isVisible']);
    }

    /**
     * Setup backdrop filter style properties into stack properties.
     *
     * @param array $setting the backdrop filter setting.
     *
     * @return void
     */
    protected function setBackdropFilter( array $setting): void {

		if ( 'drop-shadow' === $setting['type'] ) {
			$filter =
				sprintf(
					'drop-shadow(%s %s %s %s)',
					blockera_get_value_addon_real_value( $setting['drop-shadow-x'] ),
					blockera_get_value_addon_real_value( $setting['drop-shadow-y'] ),
					blockera_get_value_addon_real_value( $setting['drop-shadow-blur'] ),
					blockera_get_value_addon_real_value( $setting['drop-shadow-color'] )
				);
		} else {
			$filter =
				sprintf(
					'%s(%s)',
					$setting['type'],
					blockera_get_value_addon_real_value( $setting[ $setting['type'] ] ),
				);
		}

		if ( $filter ) {
			if ( ! empty( $this->declarations['backdrop-filter'] ) ) {
				$this->setDeclaration(
					'backdrop-filter',
					sprintf(
						'%s %s',
						$this->declarations['backdrop-filter'],
						$filter
					)
				);
			} else {
				$this->setDeclaration( 'backdrop-filter', $filter );
			}
		}
    }
}
