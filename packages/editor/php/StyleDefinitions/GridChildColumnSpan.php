<?php

namespace Blockera\Editor\StyleDefinitions;

/**
 * Grid child column span → grid-column: span {n} (child layout parity).
 *
 * Incoming values are scalars: {@see BaseStyleDefinition::generateCssRules()} unwraps
 * settings shaped as array{ value: mixed } when that is the only key.
 */
class GridChildColumnSpan extends BaseStyleDefinition {

	/**
	 * Use important (align with flex/grid layout in Blockera style engine).
	 */
	protected function isImportant(): bool {
		return true;
	}

	/**
	 * @param array $setting Envelope: type + grid-column value.
	 * @return array
	 */
	protected function css( array $setting): array {
		if ( ! isset( $setting['type'], $setting['grid-column'] ) || 'grid-column' !== $setting['type'] ) {
			return [];
		}

		$raw = $setting['grid-column'];
		// No value-addon resolution: span is always an integer (see class docblock).
		if ( ! is_scalar( $raw ) || '' === $raw ) {
			return [];
		}

		$n = (int) $raw;
		if ( $n < 1 ) {
			return [];
		}

		$this->declarations['grid-column'] = 'span ' . $n;
		$this->setCss( $this->declarations );

		return $this->css;
	}
}
