<?php

namespace Blockera\Editor\StyleDefinitions;

use Blockera\Editor\StyleDefinitions\Traits\WithDisplayValueTrait;

class FlexDirection extends BaseStyleDefinition {

	use WithDisplayValueTrait;

    protected function css( array $setting): array {

        $declaration = [];
        $cssProperty = $setting['type'];

        if (empty($cssProperty) || empty($setting[ $cssProperty ]) || 'flex-direction' !== $cssProperty) {

            return $declaration;
        }
		
		$item             = $setting['flex-direction'];
		$changeFlexInside = false;

		// Current block display (even the default).
		$display = $this->getDisplayValue();

		if ('flex' !== $display) {
			return $declaration;
		}

		if (isset($item['alignItems']) && $item['direction']) {

			$this->setDeclaration($cssProperty, $item['direction']);
		}

		$normalItems = [
			'flex-start' => true,
			'center'     => true,
			'flex-end'   => true,
		];

		if (isset($item['alignItems'], $item['direction'], $item['justifyContent']) && 'column' === $item['direction'] && isset($normalItems[ $item['alignItems'] ]) && isset($normalItems[ $item['justifyContent'] ])
		) {
			$changeFlexInside = true;
		}

		$optimizeStyleGeneration = blockera_get_admin_options([ 'earlyAccessLab', 'optimizeStyleGeneration' ]);

		if (isset($item['alignItems']) && $item['alignItems']) {
			$prop = $changeFlexInside ? 'justify-content' : 'align-items';

			$this->setDeclaration($prop, $item['alignItems'] . ( $optimizeStyleGeneration && 'align-items' === $prop ? ' !important' : '' ));
		}

		if (isset($item['justifyContent']) && $item['justifyContent']) {
			$prop = $changeFlexInside ? 'align-items' : 'justify-content';
			$this->setDeclaration($prop, $item['justifyContent'] . ( $optimizeStyleGeneration && 'justify-content' === $prop ? ' !important' : '' ));
		}

		$this->setCss($this->declarations);

        return $this->css;
    }
}
