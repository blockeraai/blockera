<?php

namespace Publisher\Framework\Illuminate\StyleEngine\StyleDefinitions;

class Outline extends BaseStyleDefinition {

	/**
	 * @inheritDoc
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

		foreach ( $setting[ $cssProperty ] as $item ) {

			if ( empty( $item['isVisible'] ) ) {

				continue;
			}

			$declaration['outline'] = sprintf(
				'%s %s %s',
				$item['border']['width'],
				$item['border']['style'],
				! empty( $item['border']['color'] ) ? pb_get_value_addon_real_value( $item['border']['color'] ) : '',
			);

			$declaration['outline-offset'] = ! empty( $item['offset'] ) ? pb_get_value_addon_real_value( $item['offset'] ) : '';
		}

		$this->setCss( $declaration );

		return $this->css;
	}

	protected function getCacheKey( string $suffix = '' ): string {

		return pb_get_classname( __NAMESPACE__, __CLASS__ ) . parent::getCacheKey( $suffix );
	}

	public function getAllowedProperties(): array {

		return [
			'publisherOutline' => 'outline',
			'publisherOffset'  => 'outline-offset',
		];
	}

}
