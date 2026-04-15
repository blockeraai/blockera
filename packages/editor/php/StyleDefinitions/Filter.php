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

		$value             = &$setting[ $cssProperty ];
		$resolved_from_var = null;
		$sortedFilters     = static::getSortedRepeaterRowsFromValue(
			$value,
			static function ( array $sorted ): string {
				$parts = array();
				foreach ( $sorted as $row ) {
					if ( ! is_array( $row ) || empty( $row['type'] ) || ! ( $row['isVisible'] ?? true ) ) {
						continue;
					}
					$chunk = self::filterRowToCssValue( $row );
					if ( '' !== $chunk ) {
						$parts[] = $chunk;
					}
				}

				return implode( ' ', $parts );
			},
			$resolved_from_var
		);

        if ( ! is_array( $sortedFilters ) ) {
            return [];
        }

        $declarations = &$this->declarations;
        $hasFilter    = isset( $declarations['filter'] ) && '' !== $declarations['filter'];

		if ( null !== $resolved_from_var && '' !== $resolved_from_var ) {
			$declarations['filter'] = $resolved_from_var;
			$hasFilter              = true;
		} else {
			foreach ( $sortedFilters as $filterSetting ) {
				if ( ! is_array( $filterSetting ) || empty( $filterSetting['type'] ) || ! ( $filterSetting['isVisible'] ?? true ) ) {
					continue;
				}

				$filter = self::filterRowToCssValue( $filterSetting );
				if ( '' === $filter ) {
					continue;
				}

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

		if ( ! empty( $setting['_blockeraDeclarationOnly'] ) ) {
			return [];
		}

        $this->setCss( $declarations );

        return $this->css;
    }

	/**
	 * @param array $row Single filter repeater row (`type` must be set).
	 */
	public static function filterRowToCssValue( array $row ): string {
		$filter_type = $row['type'];
		$chunk       = '';

		if ( 'drop-shadow' === $filter_type ) {
			$chunk = 'drop-shadow('
				. blockera_get_value_addon_real_value( $row['drop-shadow-x'] ?? '' ) . ' '
				. blockera_get_value_addon_real_value( $row['drop-shadow-y'] ?? '' ) . ' '
				. blockera_get_value_addon_real_value( $row['drop-shadow-blur'] ?? '' ) . ' '
				. blockera_get_value_addon_real_value( $row['drop-shadow-color'] ?? '' ) . ')';
		} elseif ( isset( $row[ $filter_type ] ) ) {
			$chunk = $filter_type . '(' . blockera_get_value_addon_real_value( $row[ $filter_type ] ) . ')';
		}

		return $chunk;
	}

    public function isValidSetting( array $setting): bool {

        return isset( $setting['type'] ) && '' !== $setting['type'] && ( $setting['isVisible'] ?? true );
    }
}
