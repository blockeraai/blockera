<?php

namespace Blockera\Editor\StyleDefinitions;

use Blockera\Editor\StyleDefinitions\Traits\WithDisplayValueTrait;

class Gap extends BaseStyleDefinition {

	use WithDisplayValueTrait;

    protected function css( array $setting): array {

        $declaration = [];
        $cssProperty = $setting['type'];

        if (empty($cssProperty) || empty($setting[ $cssProperty ]) || 'gap' !== $cssProperty) {

            return $declaration;
        }
		
		// Current block display (even the default).
		$display = $this->getDisplayValue();

		// Current block gap type.
		$gapType = 'gap';
		if (! empty($this->config['gap-type'])) {
			$gapType = $this->config['gap-type'];
		}

		// Add suffix to selector based on gap type.
		switch ($gapType) {
			case 'margin':
				$selectorSuffix = ' > * + *';
				break;

			case 'gap-and-margin':
				if ('flex' !== $display && 'grid' !== $display) {
					$selectorSuffix = ' > * + *';
				}
				break;
		}

		$gap                     = $setting['gap'];
		$optimizeStyleGeneration = blockera_get_admin_options([ 'earlyAccessLab', 'optimizeStyleGeneration' ]);

		if ($gap['lock']) {

			$prop = $selectorSuffix ? 'margin-block-start' : 'gap';

			if ($gap['gap']) {

				$this->setDeclaration($prop, blockera_get_value_addon_real_value($gap['gap']) . ( $selectorSuffix && $optimizeStyleGeneration ? ' !important' : '' ));
			}
		} else {

			if ($gap['rows']) {

				$prop = $selectorSuffix ? 'margin-block-start' : 'row-gap';

				$this->setDeclaration($prop, blockera_get_value_addon_real_value($gap['rows']) . ( $selectorSuffix && $optimizeStyleGeneration ? ' !important' : '' ));
			}

			if ($gap['columns']) {
				$prop = $selectorSuffix ? 'margin-block-start' : 'column-gap';

				$this->setDeclaration($prop, blockera_get_value_addon_real_value($gap['columns']) . ( $selectorSuffix && $optimizeStyleGeneration ? ' !important' : '' ));
			}
		}

		/**
		 * If gap type is `gap-and-margin` and the current display is flex or grid
		 * then we use gap property to but still WP is creating gap with `margin-block-start` and we have to remove it.
		 */
		if (
			'gap-and-margin' === $gapType &&
			( 'flex' === $display || 'grid' === $display || '' === $display )
		) {

			$this->setCss(
				'' === $display ? $this->declarations : [
					'margin-block-start' => '0' . ( $optimizeStyleGeneration ? ' !important' : '' ),
				],
				'margin-block-start',
				' > * + *'
			);

			// Remove margin-block-start because if display is empty, the gap will be applied with margin-block-start in previous step.
			if ('' === $display) {
				unset($this->declarations['margin-block-start']);
			}
		}

		$this->setCss($this->declarations);

        return $this->css;
    }
}
