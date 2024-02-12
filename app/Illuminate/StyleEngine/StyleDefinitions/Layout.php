<?php

namespace Publisher\Framework\Illuminate\StyleEngine\StyleDefinitions;

class Layout extends BaseStyleDefinition {

	/**
	 * @inheritdoc
	 *
	 * @return string[]
	 */
	public function getAllowedProperties(): array {

		return [
			'publisherGap'             => 'gap',
			'publisherFlexChildSizing' => 'flex',
			'publisherFlexChildOrder'  => 'order',
			'publisherDisplay'         => 'display',
			'publisherFlexWrap'        => 'flex-wrap',
			'publisherFlexChildAlign'  => 'align-self',
			'publisherAlignContent'    => 'align-content',
			'publisherFlexLayout'      => 'flex-direction',
		];
	}

	/**
	 * @inheritdoc
	 *
	 * @param array $setting
	 *
	 * @return array
	 */
	protected function collectProps( array $setting ): array {

		if ( empty( $setting['type'] ) ) {

			return $this->properties;
		}

		$props       = [];
		$cssProperty = $setting['type'];

		if ( empty( $setting[ $cssProperty ] ) ) {

			return $this->properties;
		}

		switch ( $cssProperty ) {
			case 'flex':
				$flexType = $setting['flex'];

				switch ( $flexType ) {
					case 'shrink':
						$props['flex'] = '0 1 auto';
						break;
					case 'grow':
						$props['flex'] = '1 1 0%';
						break;
					case 'no':
						$props['flex'] = '0 0 auto';
						break;
					case 'custom':
						$props['flex'] = sprintf(
							'%s %s %s',
							$setting['flex-child']['publisherFlexChildGrow'] ? pb_get_value_addon_real_value( $setting['flex-child']['publisherFlexChildGrow'] ) : 0,
							$setting['flex-child']['publisherFlexChildShrink'] ? pb_get_value_addon_real_value( $setting['flex-child']['publisherFlexChildShrink'] ) : 0,
							$setting['flex-child']['publisherFlexChildBasis'] ? pb_get_value_addon_real_value( $setting['flex-child']['publisherFlexChildBasis'] ) : 'auto'
						);
						break;
				}

				break;

			case 'order':
				$orderType = $setting['order'];

				switch ( $orderType ) {
					case 'first':
						$props['order'] = '-1';
						break;
					case 'last':
						$props['order'] = '100';
						break;
					case 'custom':
						$props['order'] = $setting['custom'] ? pb_get_value_addon_real_value( $setting['custom'] ) : '100';
						break;
				}

				break;

			case 'flex-direction':

				$item = $setting['flex-direction'];

				if ( $item['direction'] ) {
					$props['flex-direction'] = $item['direction'];
				}

				if ( $item['alignItems'] ) {
					$props['align-items'] = $item['alignItems'];
				}

				if ( $item['justifyContent'] ) {
					$props['justify-content'] = $item['justifyContent'];
				}

				break;

			case 'flex-wrap':
				$flexDirection = $setting['flex-wrap'];

				$props['flex-wrap'] = $flexDirection['value'] . ( $flexDirection['reverse'] && $flexDirection['value'] === 'wrap' ? '-reverse' : '' );

				break;

			case 'gap':

				$gap = $setting['gap'];

				if ( $gap['lock'] ) {

					if ( $gap['gap'] ) {
						$props['gap'] = pb_get_value_addon_real_value( $gap['gap'] );
					}
				} else {

					if ( $gap['rows'] ) {
						$props['row-gap'] = pb_get_value_addon_real_value( $gap['rows'] );
					}

					if ( $gap['columns'] ) {
						$props['column-gap'] = pb_get_value_addon_real_value( $gap['columns'] );
					}
				}

				break;
			default:
				$props[ $cssProperty ] = $setting[ $cssProperty ];
				break;
		}


		$this->setProperties( array_merge( $this->properties, $props ) );

		return $this->properties;
	}

}