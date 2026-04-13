<?php

namespace Blockera\Editor\StyleDefinitions;

use Blockera\Editor\StyleDefinitions\Traits\WithDisplayValueTrait;

class FlexDirection extends BaseStyleDefinition {

	use WithDisplayValueTrait;

    protected function css( array $setting): array {

		if (! isset($setting['type'])) {
			return [];
		}

		$cssProperty = $setting['type'];

		if ('' === $cssProperty || 'flex-direction' !== $cssProperty) {
			return [];
		}

		if (! isset($setting[ $cssProperty ])) {
			return [];
		}

		$item = $setting['flex-direction'];
		if (! is_array($item)) {
			return [];
		}

		$display_list = [
			'flex' => true,
			'grid' => true,
		];

		if (! isset($display_list[ $this->getDisplayValue() ])) {
			return [];
		}

		$direction      = $item['direction'] ?? null;
		$alignItems     = $item['alignItems'] ?? null;
		$justifyContent = $item['justifyContent'] ?? null;

		if (null !== $direction && null !== $alignItems && '' !== $direction) {
			$this->declarations[ $cssProperty ] = $direction;
		}

		$changeFlexInside = false;
		if (null !== $alignItems && null !== $direction && null !== $justifyContent && 'column' === $direction) {
			if (( 'flex-start' === $alignItems || 'center' === $alignItems || 'flex-end' === $alignItems ) &&
				( 'flex-start' === $justifyContent || 'center' === $justifyContent || 'flex-end' === $justifyContent )) {
				$changeFlexInside = true;
			}
		}

		if (null !== $alignItems && '' !== $alignItems) {
			$this->declarations[ $changeFlexInside ? 'justify-content' : 'align-items' ] = $alignItems . ' !important';
		}

		if (null !== $justifyContent && '' !== $justifyContent) {
			$this->declarations[ $changeFlexInside ? 'align-items' : 'justify-content' ] = $justifyContent . ' !important';
		}

		$this->setCss($this->declarations);

        return $this->css;
    }
}
