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

		$declaration = [];
		$cssProperty = $setting['type'];

		if ( empty( $cssProperty ) ) {

			return $declaration;
		}

		$this->setSelector( $cssProperty );

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
				$gap = $setting['gap'];

				if ( $gap['lock'] ) {

					if ( $gap['gap'] ) {
						$declaration['gap'] = blockera_get_value_addon_real_value( $gap['gap'] );
					}
				} else {

					if ( $gap['rows'] ) {
						$declaration['row-gap'] = blockera_get_value_addon_real_value( $gap['rows'] );
					}

					if ( $gap['columns'] ) {
						$declaration['column-gap'] = blockera_get_value_addon_real_value( $gap['columns'] );
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
