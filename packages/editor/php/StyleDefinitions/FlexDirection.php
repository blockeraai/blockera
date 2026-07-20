<?php

namespace Blockera\Editor\StyleDefinitions;

use Blockera\Editor\StyleDefinitions\Traits\WithDisplayValueTrait;

class FlexDirection extends BaseStyleDefinition {

	use WithDisplayValueTrait;

	protected function css( array $setting ): array {

		if ( ! isset( $setting['type'] ) ) {
			return [];
		}

		$cssProperty = $setting['type'];

		if ( '' === $cssProperty || 'flex-direction' !== $cssProperty || ! isset( $setting[ $cssProperty ] ) ) {
			return [];
		}

		$item = $setting['flex-direction'];

		if ( ! is_array( $item ) ) {
			return [];
		}

		$display = $this->getDisplayValue();

		if ( 'flex' !== $display && 'grid' !== $display ) {
			return [];
		}

		$direction      = $item['direction'] ?? null;
		$alignItems     = $item['alignItems'] ?? null;
		$justifyContent = $item['justifyContent'] ?? null;

		if ( null !== $direction && '' !== $direction ) {
			$this->declarations[ $cssProperty ] = $direction;
		}

		if ( null !== $alignItems && '' !== $alignItems ) {
			$this->declarations['align-items'] = $alignItems . ' !important';
		}

		if ( null !== $justifyContent && '' !== $justifyContent ) {
			$this->declarations['justify-content'] = $justifyContent . ' !important';
		}

		$this->setCss( $this->declarations );

		return $this->css;
	}
}
