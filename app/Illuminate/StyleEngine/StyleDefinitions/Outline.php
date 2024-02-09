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
	protected function collectProps( array $setting ): array {

		$props       = [];
		$cssProperty = $setting['type'];

		foreach ( $setting[ $cssProperty ] as $item ) {

			if ( empty( $item['isVisible'] ) ) {

				continue;
			}

			$props['outline'] = sprintf(
				'%s %s %s',
				$item['border']['width'],
				$item['border']['style'],
				! empty( $item['border']['color'] ) ? pb_get_value_addon_real_value( $item['border']['color'] ) : '',
			);

			$props['outline-offset'] = ! empty( $item['offset'] ) ? pb_get_value_addon_real_value( $item['offset'] ) : '';
		}

		$this->setProperties( $props );

		return $this->properties;
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
