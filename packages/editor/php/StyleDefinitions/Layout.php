<?php

namespace Blockera\Editor\StyleDefinitions;

use Blockera\Editor\StyleDefinitions\Contracts\CustomStyle;
use Symfony\Component\VarDumper\VarDumper;

class Layout extends BaseStyleDefinition implements CustomStyle {

	/**
	 * Store removal flag for gap with "margin-block-start".
	 *
	 * @var bool $with_gap_margin_block_start the flag to removal gap with "margin-block-start".
	 */
	protected bool $with_gap_margin_block_start = false;

	/**
	 * @inheritdoc
	 *
	 * @param array $setting
	 *
	 * @return array
	 */
	protected function css( array $setting ): array {

		// Before run css method we need reset properties.
		$this->reset();

		$declaration    = [];
		$selectorSuffix = '';
		$cssProperty    = $setting['type'];

		if ( empty( $cssProperty ) ) {

			return $declaration;
		}

		$optimizeStyleGeneration = blockera_get_admin_options([ 'earlyAccessLab', 'optimizeStyleGeneration' ]);

		switch ( $cssProperty ) {
			case 'flex':
				$flexType = $setting['flex'];

				switch ( $flexType ) {
					case 'shrink':
						$declaration['flex'] = '0 1 auto';
						break;
					case 'grow':
						$declaration['flex'] = '1 1 0%';
						break;
					case 'no':
						$declaration['flex'] = '0 0 auto';
						break;
					case 'custom':
						$declaration['flex'] = sprintf(
							'%s %s %s',
							$setting['custom']['blockeraFlexChildGrow'] ? blockera_get_value_addon_real_value( $setting['custom']['blockeraFlexChildGrow'] ) : 0,
							$setting['custom']['blockeraFlexChildShrink'] ? blockera_get_value_addon_real_value( $setting['custom']['blockeraFlexChildShrink'] ) : 0,
							$setting['custom']['blockeraFlexChildBasis'] ? blockera_get_value_addon_real_value( $setting['custom']['blockeraFlexChildBasis'] ) : 'auto'
						);
						break;
				}

				break;

			case 'order':
				$orderType = $setting['order'];

				switch ( $orderType ) {
					case 'first':
						$declaration['order'] = '-1';
						break;
					case 'last':
						$declaration['order'] = '100';
						break;
					case 'custom':
						$declaration['order'] = $setting['custom'] ? blockera_get_value_addon_real_value( $setting['custom'] ) : '100';
						break;
				}

				break;

			case 'flex-direction':
				$item             = $setting['flex-direction'];
				$changeFlexInside = false;

				// Current block display (even the default).
				$display = $this->getDisplayValue();

				if ( 'flex' !== $display ) {
					break;
				}

				if ( isset($item['alignItems']) && $item['direction'] ) {
					$declaration['flex-direction'] = $item['direction'];
				}

				$normalItems = [
					'flex-start' => true,
					'center'     => true,
					'flex-end'   => true,
				];

				if ( isset($item['alignItems'], $item['direction'], $item['justifyContent']) && 'column' === $item['direction'] && isset( $normalItems[ $item['alignItems'] ] ) && isset( $normalItems[ $item['justifyContent'] ] )
				) {
					$changeFlexInside = true;
				}

				if ( isset($item['alignItems']) && $item['alignItems'] ) {
					$prop                 = $changeFlexInside ? 'justify-content' : 'align-items';
					$declaration[ $prop ] = $item['alignItems'] . ( $optimizeStyleGeneration && 'align-items' === $prop ? ' !important' : '' );
				}

				if ( isset($item['justifyContent']) && $item['justifyContent'] ) {
					$prop                 = $changeFlexInside ? 'align-items' : 'justify-content';
					$declaration[ $prop ] = $item['justifyContent'] . ( $optimizeStyleGeneration && 'justify-content' === $prop ? ' !important' : '' );
				}

				break;

			case 'flex-wrap':
				// Backward compatibility for flex-wrap value, because flex-wrap changed from value to val in the new version.
				$flexWrap = $setting['flex-wrap'];
			
				if ( ! empty( $flexWrap['value'] ) || ! empty( $flexWrap['val'] ) ) {

					$declaration['flex-wrap'] = ( $flexWrap['value'] ?? $flexWrap['val'] ) . ( $flexWrap['reverse'] && 'wrap' === ( $flexWrap['value'] ?? $flexWrap['val'] ) ? '-reverse' : '' ) . ( $optimizeStyleGeneration ? ' !important' : '' );
				}

				break;

			case 'gap':
				// Current block display (even the default).
				$display = $this->getDisplayValue();

				// Current block gap type.
				$gapType = 'gap';
				if ( ! empty( $this->config['gap-type'] ) ) {
					$gapType = $this->config['gap-type'];
				}

				// Add suffix to selector based on gap type.
				switch ( $gapType ) {
					case 'margin':
						$selectorSuffix = ' > * + *';
						break;

					case 'gap-and-margin':
						if ( 'flex' !== $display && 'grid' !== $display ) {
							$selectorSuffix = ' > * + *';
						}
						break;
				}

				$gap = $setting['gap'];

				if ( $gap['lock'] ) {

					$cssProperty = $selectorSuffix ? 'margin-block-start' : 'gap';

					if ( $gap['gap'] ) {
						$declaration[ $cssProperty ] = blockera_get_value_addon_real_value( $gap['gap'] ) . ( $selectorSuffix && $optimizeStyleGeneration ? ' !important' : '' );
					}
				} else {

					if ( $gap['rows'] ) {
						$cssProperty = $selectorSuffix ? 'margin-block-start' : 'row-gap';

						$declaration[ $cssProperty ] = blockera_get_value_addon_real_value( $gap['rows'] ) . ( $selectorSuffix && $optimizeStyleGeneration ? ' !important' : '' );
					}

					if ( $gap['columns'] ) {
						$cssProperty = $selectorSuffix ? 'margin-block-start' : 'column-gap';

						$declaration[ $cssProperty ] = blockera_get_value_addon_real_value( $gap['columns'] ) . ( $selectorSuffix && $optimizeStyleGeneration ? ' !important' : '' );
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
						'' === $display ? $declaration: [
							'margin-block-start' => '0' . ( $optimizeStyleGeneration ? ' !important' : '' ),
						],
						'margin-block-start',
						' > * + *'
					);

					// Remove margin-block-start because if display is empty, the gap will be applied with margin-block-start in previous step.
					if ('' === $display) {
						unset($declaration['margin-block-start']);
					}
				}
				break;

			default:
				$declaration[ $cssProperty ] = $setting[ $cssProperty ];
				break;
		}

		$this->setCss( $declaration );

		return $this->css;
	}

	/**
	 * @inheritDoc
	 *
	 * @param array  $settings
	 * @param string $settingName
	 * @param string $cssProperty
	 *
	 * @return array
	 */
	public function getCustomSettings( array $settings, string $settingName, string $cssProperty ): array {

		$settings = blockera_get_sanitize_block_attributes( $settings );

		if ( 'custom' === $settings[ $settingName ] && 'flex' === $cssProperty ) {

			$setting = [
				[
					'isVisible'  => true,
					'type'       => $cssProperty,
					$cssProperty => $settings['blockeraFlexChildSizing'] ?? 'custom',
					'custom'     => [
						'blockeraFlexChildGrow'   => $settings['blockeraFlexChildGrow'] ?? 0,
						'blockeraFlexChildShrink' => $settings['blockeraFlexChildShrink'] ?? 0,
						'blockeraFlexChildBasis'  => $settings['blockeraFlexChildBasis'] ?? 'auto',
					],
				],
			];

		} elseif ( 'custom' === $settings[ $settingName ] && 'order' === $cssProperty ) {

			$setting = [
				[
					'isVisible'  => true,
					'type'       => $cssProperty,
					$cssProperty => $settings['blockeraFlexChildOrder'] ?? 'custom',
					'custom'     => $settings['blockeraFlexChildOrderCustom'] ?? '',
				],
			];

		} else {

			$setting = [
				[
					'isVisible'  => true,
					'type'       => $cssProperty,
					$cssProperty => $settings[ $settingName ],
				],
			];
		}

		return $setting;
	}

	/**
	 * Flush properties of Layout class.
	 *
	 * @return void
	 */
	private function reset(): void {

		$this->with_gap_margin_block_start = false;
	}

	/**
	 * Get display value from settings or default settings
	 *
	 * @param string $property Property name to check in settings.
	 * @return string Display value
	 */
	private function getDisplayValue( string $property = 'blockeraDisplay'): string {

		//
		// Get display value from current states and breakpoint.
		//
		if (isset($this->settings[ $property ]) ) {

			if (is_string($this->settings[ $property ]) ) {
				return $this->settings[ $property ];
			}

			if (! empty($this->settings[ $property ]['value'])) {
				return $this->settings[ $property ]['value'];
			} 
		}

		//
		// Get display value from main attributes.
		//
		if (isset($this->block['attrs'][ $property ]) ) {

			if (is_string(
				$this->block['attrs'][ $property ]
			) ) {
				return $this->block['attrs'][ $property ];
			}

			if (! empty(
				$this->block['attrs'][ $property ]
				['value']
			)) {
				return $this->block['attrs'][ $property ]['value'];
			}
		} 

		//
		// Get display value from default settings.
		//
		if (! empty($this->default_settings[ $property ]['default']['value'])) {
			return $this->default_settings[ $property ]['default']['value'];
		}

		return '';
	}
}
