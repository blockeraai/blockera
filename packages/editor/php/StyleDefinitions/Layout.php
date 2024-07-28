<?php

namespace Blockera\Editor\StyleDefinitions;

use Blockera\Editor\StyleDefinitions\Contracts\HaveCustomSettings;

class Layout extends BaseStyleDefinition implements HaveCustomSettings {

	/**
	 * @inheritdoc
	 *
	 * @return string[]
	 */
	public function getAllowedProperties(): array {

		return [
			'blockeraGap'             => 'gap',
			'blockeraFlexChildSizing' => 'flex',
			'blockeraFlexChildOrder'  => 'order',
			'blockeraDisplay'         => 'display',
			'blockeraFlexWrap'        => 'flex-wrap',
			'blockeraFlexChildAlign'  => 'align-self',
			'blockeraAlignContent'    => 'align-content',
			'blockeraFlexLayout'      => 'flex-direction',
		];
	}

	/**
	 * @inheritdoc
	 *
	 * @param array $setting
	 *
	 * @return array
	 */
	protected function css( array $setting ): array {

		$declaration               = [];
		$cssProperty               = $setting['type'];
		$selectorSuffix            = '';
		$removeGapMarginBlockStart = false;

		if ( empty( $cssProperty ) ) {

			return $declaration;
		}

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
				$item = $setting['flex-direction'];

				if ( $item['direction'] ) {
					$declaration['flex-direction'] = $item['direction'];
				}

				if ( $item['alignItems'] ) {
					$declaration['align-items'] = $item['alignItems'];
				}

				if ( $item['justifyContent'] ) {
					$declaration['justify-content'] = $item['justifyContent'];
				}

				break;

			case 'flex-wrap':
				$flexDirection = $setting['flex-wrap'];

				if ( ! empty( $flexDirection['value'] ) ) {

					$declaration['flex-wrap'] = $flexDirection['value'] . ( $flexDirection['reverse'] && 'wrap' === $flexDirection['value'] ? '-reverse' : '' );
				}

				break;

			case 'gap':
				// Current block display (even the default).
				$display = '';
				if ( ! empty( $this->settings['blockeraDisplay'] ) ) {
					$display = $this->settings['blockeraDisplay'];
				} elseif ( ! empty( $this->default_settings['blockeraDisplay']['default'] ) ) {
					$display = $this->default_settings['blockeraDisplay']['default'];
				}

				// Current block gap type.
				$gapType = 'gap';
				if ( ! empty( $this->config['gap-type'] ) ) {
					$gapType = $this->config['gap-type'];
				}

				// Add suffix to selector based on gap type.
				switch ( $gapType ) {
					case 'margin':
						$selectorSuffix = '> * + *';
						break;

					case 'gap-and-margin':
						if ( 'flex' !== $display && 'grid' !== $display ) {
							$selectorSuffix = '> * + *';
						}
						break;
				}

				$gap = $setting['gap'];

				if ( $gap['lock'] ) {

					$cssProperty = $selectorSuffix ? 'margin-block-start' : 'gap';

					if ( $gap['gap'] ) {
						$declaration[ $cssProperty ] = blockera_get_value_addon_real_value( $gap['gap'] );
					}
				} else {

					if ( $gap['rows'] ) {
						$cssProperty = $selectorSuffix ? 'margin-block-start' : 'row-gap';

						$declaration[ $cssProperty ] = blockera_get_value_addon_real_value( $gap['rows'] );
					}

					if ( $gap['columns'] ) {
						$cssProperty = $selectorSuffix ? 'margin-block-start' : 'column-gap';

						$declaration[ $cssProperty ] = blockera_get_value_addon_real_value( $gap['columns'] );
					}
				}

				/**
				 * If gap type is `gap-and-margin` and the current display is flex or grid
				 * then we use gap property to but still WP is creating gap with `margin-block-start` and we have to remove it.
				 */
				if (
					'gap-and-margin' === $gapType &&
					( 'flex' === $display || 'grid' === $display )
				) {
					$removeGapMarginBlockStart = true;
				}

				break;
			default:
				$declaration[ $cssProperty ] = $setting[ $cssProperty ];
				break;
		}

		$this->setSelector(
			$cssProperty,
			$selectorSuffix
		);

		$this->setCss( $declaration );

		/**
		 * If gap type is both and the current display is flex or grid
		 * then we use gap property to but still WP is creating gap with `margin-block-start` and we have to remove it.
		 *
		 * This variable is false by default but it will be enabled if the style clearing is needed.
		 */
		if ( $removeGapMarginBlockStart ) {
			$this->setSelector(
				'margin-block-start',
				'> * + *'
			);

			$this->setCss(
				[
					'margin-block-start' => '0',
				]
			);
		}

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

}
