<?php

namespace Blockera\Editor\StyleDefinitions;

class FlexWrap extends BaseStyleDefinition {

	protected function css( array $setting ): array {
		if ( ! isset( $setting['type'], $setting['flex-wrap'] ) || 'flex-wrap' !== $setting['type'] ) {
			return [];
		}

		$flexWrap = $setting['flex-wrap'];

		// Keep empty() on both keys (parity with prior short-circuit).
		if ( empty( $flexWrap['value'] ) && empty( $flexWrap['val'] ) ) {
			return [];
		}

		// Prefer `value` when the key exists — even if empty string (?? semantics).
		$value  = $flexWrap['value'] ?? $flexWrap['val'];
		$suffix = ( isset( $flexWrap['reverse'] ) && $flexWrap['reverse'] && 'wrap' === $value ) ? '-reverse' : '';

		$this->declarations['flex-wrap'] = $value . $suffix . ' !important';
		$this->setCss( $this->declarations );

		return $this->css;
	}
}
