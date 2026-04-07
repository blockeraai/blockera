<?php

namespace Blockera\Editor\StyleDefinitions;

use Blockera\Editor\StyleDefinitions\Contracts\Repeater;

class Filter extends BaseStyleDefinition implements Repeater {

    protected function css( array $setting): array {

        if ( ! isset( $setting['type'] ) || 'filter' !== $setting['type'] ) {
            return [];
        }

        $cssProperty = $setting['type'];

        if ( ! isset( $setting[ $cssProperty ] ) || '' === $setting[ $cssProperty ] ) {
            return [];
        }

		$value = $setting[ $cssProperty ];

		if (! isset($value['valueType'])) {
			$sortedFilters = blockera_get_sorted_repeater($value);
		} elseif ('variable' === $value['valueType'] ?? '' && isset($value['settings']['value'])) {
			$sortedFilters = blockera_get_sorted_repeater(json_decode($value['settings']['value'], true)['items'] ?? []);
		} else {
			$sortedFilters = [];
		}

        if ( ! is_array( $sortedFilters ) ) {
            return [];
        }

        $declarations = &$this->declarations;
        $hasFilter    = isset( $declarations['filter'] ) && '' !== $declarations['filter'];

        foreach ( $sortedFilters as $filterSetting ) {
            if ( ! isset( $filterSetting['type'] ) || '' === $filterSetting['type'] || ! isset( $filterSetting['isVisible'] ) || '' === $filterSetting['isVisible'] ) {
                continue;
            }

            $filterType = $filterSetting['type'];
            $filter     = '';

            if ( 'drop-shadow' === $filterType ) {
                $filter = 'drop-shadow(' . blockera_get_value_addon_real_value( $filterSetting['drop-shadow-x'] ) . ' ' . blockera_get_value_addon_real_value( $filterSetting['drop-shadow-y'] ) . ' ' . blockera_get_value_addon_real_value( $filterSetting['drop-shadow-blur'] ) . ' ' . blockera_get_value_addon_real_value( $filterSetting['drop-shadow-color'] ) . ')';
            } else {
                if ( isset( $filterSetting[ $filterType ] ) ) {
                    $filter = $filterType . '(' . blockera_get_value_addon_real_value( $filterSetting[ $filterType ] ) . ')';
                } else {
                    continue;
                }
            }

            if ( '' !== $filter ) {
                if ( $hasFilter ) {
                    $declarations['filter'] = $declarations['filter'] . ' ' . $filter;
                } else {
                    $declarations['filter'] = $filter;
                    $hasFilter              = true;
                }
            }
        }

        if ( ! $hasFilter ) {
            return [];
        }

        $this->setCss( $declarations );

        return $this->css;
    }

    public function isValidSetting( array $setting): bool {

        return isset( $setting['type'] ) && '' !== $setting['type'] && isset( $setting['isVisible'] ) && '' !== $setting['isVisible'];
    }
}
