<?php

namespace Publisher\Framework\Illuminate\StyleEngine\StyleDefinitions;

class Layout extends BaseStyleDefinition {

	public function getProperties(): array {

		if ( empty( $this->settings['type'] ) ) {

			return $this->properties;
		}

		$props = [];

		if ( empty( $this->settings[ $this->settings['type'] ] ) ) {

			return $this->properties;
		}

		switch ( $this->settings['type'] ) {
			case 'flex':
				$flexType = $this->settings['flex'];

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
							$this->settings['flex-child']['publisherFlexChildGrow'] ? pb_get_value_addon_real_value( $this->settings['flex-child']['publisherFlexChildGrow'] ) : 0,
							$this->settings['flex-child']['publisherFlexChildShrink'] ? pb_get_value_addon_real_value( $this->settings['flex-child']['publisherFlexChildShrink'] ) : 0,
							$this->settings['flex-child']['publisherFlexChildBasis'] ? pb_get_value_addon_real_value( $this->settings['flex-child']['publisherFlexChildBasis'] ) : 'auto'
						);
						break;
				}

				break;

			case 'order':
				$orderType = $this->settings['order'];

				switch ( $orderType ) {
					case 'first':
						$props['order'] = '-1';
						break;
					case 'last':
						$props['order'] = '100';
						break;
					case 'custom':
						$props['order'] = $this->settings['custom'] ? pb_get_value_addon_real_value( $this->settings['custom'] ) : '100';
						break;
				}

				break;

			case 'flex-direction':

				$item = $this->settings['flex-direction'];

				if( $item['direction'] ){
					$props['flex-direction'] = $item['direction'];
				}

				if( $item['alignItems'] ){
					$props['align-items'] = $item['alignItems'];
				}

				if( $item['justifyContent'] ){
					$props['justify-content'] = $item['justifyContent'];
				}

				break;

			case 'flex-wrap':
				$flexDirection = $this->settings['flex-wrap'];

				$props['flex-wrap'] = $flexDirection['value'] . ($flexDirection['reverse'] && $flexDirection['value'] === 'wrap' ? '-reverse' : '');

				break;

			case 'gap':

				$gap = $this->settings['gap'];

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
				$props[ $this->settings['type'] ] = $this->settings[ $this->settings['type'] ];
				break;
		}


		$this->setProperties( $props );

		return $this->properties;
	}

}