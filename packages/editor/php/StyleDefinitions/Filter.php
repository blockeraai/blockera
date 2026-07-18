<?php

namespace Blockera\Editor\StyleDefinitions;

use Blockera\Editor\StyleDefinitions\Contracts\Repeater;

class Filter extends BaseStyleDefinition implements Repeater {

	protected function css( array $setting ): array {

		if ( ! isset( $setting['type'] ) || 'filter' !== $setting['type'] ) {
			return [];
		}

		$cssProperty = $setting['type'];

		if ( ! isset( $setting[ $cssProperty ] ) || '' === $setting[ $cssProperty ] ) {
			return [];
		}

		// By-ref required: variable path may rewrite settings.value in-place.
		$value             = &$setting[ $cssProperty ];
		$resolved_from_var = null;
		$sortedFilters     = static::getSortedRepeaterRowsFromValue(
			$value,
			static function ( array $sorted ): string {
				$out = '';
				foreach ( $sorted as $row ) {
					if ( ! is_array( $row ) || ! isset( $row['type'] ) || '' === $row['type'] || ! ( $row['isVisible'] ?? true ) ) {
						continue;
					}
					$chunk = self::filterRowToCssValue( $row );
					if ( '' === $chunk ) {
						continue;
					}
					$out = '' === $out ? $chunk : $out . ' ' . $chunk;
				}

				return $out;
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
				if ( ! is_array( $filterSetting ) || ! isset( $filterSetting['type'] ) || '' === $filterSetting['type'] || ! ( $filterSetting['isVisible'] ?? true ) ) {
					continue;
				}

				$filter = self::filterRowToCssValue( $filterSetting );
				if ( '' === $filter ) {
					continue;
				}

				if ( $hasFilter ) {
					$declarations['filter'] .= ' ' . $filter;
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

		if ( 'drop-shadow' === $filter_type ) {
			return 'drop-shadow('
				. blockera_get_value_addon_real_value( $row['drop-shadow-x'] ?? '' ) . ' '
				. blockera_get_value_addon_real_value( $row['drop-shadow-y'] ?? '' ) . ' '
				. blockera_get_value_addon_real_value( $row['drop-shadow-blur'] ?? '' ) . ' '
				. blockera_get_value_addon_real_value( $row['drop-shadow-color'] ?? '' ) . ')';
		}

		if ( isset( $row[ $filter_type ] ) ) {
			return $filter_type . '(' . blockera_get_value_addon_real_value( $row[ $filter_type ] ) . ')';
		}

		return '';
	}

	public function isValidSetting( array $setting ): bool {

		return isset( $setting['type'] ) && '' !== $setting['type'] && ( $setting['isVisible'] ?? true );
	}
}
