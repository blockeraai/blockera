<?php

namespace Blockera\Editor\StyleDefinitions;

use Blockera\Editor\StyleDefinitions\Traits\WithDisplayValueTrait;

class Gap extends BaseStyleDefinition {

	use WithDisplayValueTrait;

	protected function css( array $setting): array {
		$cssProperty = $setting['type'] ?? null;
		if (null === $cssProperty || 'gap' !== $cssProperty || ! isset($setting[ $cssProperty ]) || empty($setting[ $cssProperty ])) {
			return [];
		}

		$gap = $setting['gap'];

		// Current block display (even the default).
		$display = $this->getDisplayValue();

		// Current block gap type.
		$gapType = isset($this->config['gap-type']) && '' !== $this->config['gap-type'] ? $this->config['gap-type'] : 'gap';

		// Add suffix to selector based on gap type.
		$selectorSuffix = '';
		if ('margin' === $gapType) {
			$selectorSuffix = '.is-layout-constrained > * + *';
		} elseif ('gap-and-margin' === $gapType && 'flex' !== $display && 'grid' !== $display) {
			$selectorSuffix = '.is-layout-constrained > * + *';
		}

		$hasSuffix       = '' !== $selectorSuffix;
		$importantSuffix = $hasSuffix ? ' !important' : '';

		if (isset($gap['lock']) && $gap['lock']) {
			if (isset($gap['gap']) && '' !== $gap['gap']) {
				$this->declarations[ $hasSuffix ? 'margin-block-start' : 'gap' ] = blockera_get_value_addon_real_value($gap['gap']) . $importantSuffix;
			}
		} else {
			if (isset($gap['rows']) && '' !== $gap['rows']) {
				$this->declarations[ $hasSuffix ? 'margin-block-start' : 'row-gap' ] = blockera_get_value_addon_real_value($gap['rows']) . $importantSuffix;
			}

			if (isset($gap['columns']) && '' !== $gap['columns']) {
				$this->declarations[ $hasSuffix ? 'margin-block-start' : 'column-gap' ] = blockera_get_value_addon_real_value($gap['columns']) . $importantSuffix;
			}
		}

		/**
		 * If gap type is `gap-and-margin` and the current display is flex or grid
		 * then we use gap property to but still WP is creating gap with `margin-block-start` and we have to remove it.
		 */
		if ('gap-and-margin' === $gapType) {
			if ('flex' === $display || 'grid' === $display || '' === $display) {
				if ('' === $display) {
					$this->setCss($this->declarations, 'margin-block-start', '.is-layout-constrained > * + *');
					unset($this->declarations['margin-block-start']);
				} else {
					$this->setCss([ 'margin-block-start' => '0 !important' ], 'margin-block-start', '.is-layout-constrained > * + *');
				}
			}
		}

		$this->setCss($this->declarations);

		return $this->css;
	}
}
