<?php

namespace Blockera\Editor\StyleDefinitions;

/**
 * Grid child row span → grid-row: span {n} (child layout parity).
 *
 * Incoming values are scalars: {@see BaseStyleDefinition::generateCssRules()} unwraps
 * settings shaped as array{ value: mixed } when that is the only key.
 */
class GridChildRowSpan extends BaseStyleDefinition {

	/**
	 * Use important (align with flex/grid layout in Blockera style engine).
	 */
	protected function isImportant(): bool {
		return true;
	}

	/**
	 * @param array $setting Envelope: type + grid-row value.
	 * @return array
	 */
	protected function css( array $setting): array {
		if ( ! isset( $setting['type'], $setting['grid-row'] ) || 'grid-row' !== $setting['type'] ) {
			return [];
		}

		$raw = $setting['grid-row'];
		// No value-addon resolution: span is always an integer (see class docblock).
		if ( ! is_scalar( $raw ) || '' === $raw ) {
			return [];
		}

		$n = (int) $raw;
		if ( $n < 1 ) {
			return [];
		}

		$this->declarations['grid-row'] = 'span ' . $n;
		$this->setCss( $this->declarations );

		return $this->css;
	}
}
