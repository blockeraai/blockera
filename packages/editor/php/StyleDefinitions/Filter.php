<?php

namespace Blockera\Editor\StyleDefinitions;

use Blockera\Editor\StyleDefinitions\Contracts\Repeater;

class Filter extends BaseStyleDefinition implements Repeater {

    protected function css( array $setting): array {

        $declaration = [];
        $cssProperty = $setting['type'];

        if (empty($cssProperty) || empty($setting[ $cssProperty ]) || 'filter' !== $cssProperty) {

            return $declaration;
        }

        $filteredFilters = array_values(array_filter(blockera_get_sorted_repeater($setting[ $cssProperty ]), [ $this, 'isValidSetting' ]));

        if (empty($filteredFilters)) {

			return $declaration;
		}
		
		$this->setFilter($filteredFilters[0]);

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

        return ! empty($setting['type']) && ! empty($setting['isVisible']);
    }

    /**
     * Setup filter style properties into stack properties.
     *
     * @param array $setting the filter setting.
     *
     * @return void
     */
    protected function setFilter( array $setting): void {

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
			if ( ! empty( $this->declarations['filter'] ) ) {
				$this->setDeclaration(
					'filter',
					sprintf(
						'%s %s',
						$this->declarations['filter'],
						$filter
					)
				);
			} else {
				$this->setDeclaration( 'filter', $filter );
			}
		}
    }
}
