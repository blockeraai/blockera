<?php

namespace Blockera\Editor\StyleDefinitions;

use Blockera\Editor\StyleDefinitions\Contracts\CustomStyle;

class Flex extends BaseStyleDefinition implements CustomStyle {

	protected function css( array $setting): array {

		if ( ! isset($setting['type']) || 'flex' !== $setting['type'] || ! isset($setting['flex']) ) {
			return [];
		}

		$flexType = $setting['flex'];

		if ( 'shrink' === $flexType ) {
			$this->declarations['flex'] = '0 1 auto';
		} elseif ( 'grow' === $flexType ) {
			$this->declarations['flex'] = '1 1 0%';
		} elseif ( 'no' === $flexType ) {
			$this->declarations['flex'] = '0 0 auto';
		} elseif ( 'custom' === $flexType && isset($setting['custom']) ) {
			$custom = $setting['custom'];
			
			if ( isset($custom['blockeraFlexChildGrow']) ) {
				$growInput = $custom['blockeraFlexChildGrow'];
				if ( ( is_string($growInput) && '' !== $growInput ) || $growInput ) {
					$grow = blockera_get_value_addon_real_value($growInput);
					if ( ( is_string($grow) && '' !== $grow ) || $grow ) {
						$this->declarations['flex-grow'] = $grow;
					}
				}
			}

			if ( isset($custom['blockeraFlexChildShrink']) ) {
				$shrinkInput = $custom['blockeraFlexChildShrink'];
				if ( ( is_string($shrinkInput) && '' !== $shrinkInput ) || $shrinkInput ) {
					$shrink = blockera_get_value_addon_real_value($shrinkInput);
					if ( ( is_string($shrink) && '' !== $shrink ) || $shrink ) {
						$this->declarations['flex-shrink'] = $shrink;
					}
				}
			}

			if ( isset($custom['blockeraFlexChildBasis']) && $custom['blockeraFlexChildBasis'] ) {
				$basis = blockera_get_value_addon_real_value($custom['blockeraFlexChildBasis']);
				if ( $basis ) {
					$this->declarations['flex-basis'] = $basis . ' !important';
				}
			}
		}

		$this->setCss($this->declarations);

		return $this->css;
	}

	public function getCustomSettings( array $settings, string $settingName, string $cssProperty): array {

		$settings                  = blockera_get_sanitize_block_attributes($settings);
		$currentBreakpointSettings = $this->getCurrentBreakpointSettings();

		if ( isset($settings['value']) && 'custom' === $settings['value'] && 'flex' === $cssProperty ) {
			$growKey   = 'blockeraFlexChildGrow';
			$shrinkKey = 'blockeraFlexChildShrink';
			$basisKey  = 'blockeraFlexChildBasis';
			
			$growValue   = $currentBreakpointSettings[ $growKey ] ?? null;
			$shrinkValue = $currentBreakpointSettings[ $shrinkKey ] ?? null;
			$basisValue  = $currentBreakpointSettings[ $basisKey ] ?? null;

			return [
				[
					'isVisible'  => true,
					'type'       => $cssProperty,
					$cssProperty => 'custom',
					'custom'     => [
						$growKey   => isset($growValue['value']) ? $growValue['value'] : ( $growValue ?? '' ),
						$shrinkKey => isset($shrinkValue['value']) ? $shrinkValue['value'] : ( $shrinkValue ?? '' ),
						$basisKey  => isset($basisValue['value']) ? $basisValue['value'] : ( $basisValue ?? '' ),
					],
				],
			];
		}

		return [
			[
				'isVisible'  => true,
				'type'       => $cssProperty,
				$cssProperty => $settings['value'] ?? [],
			],
		];
	}
}
