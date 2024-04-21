<?php

namespace Blockera\Framework\Illuminate\StyleEngine\StyleDefinitions;

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
				! empty( $item['border']['color'] ) ? blockera_get_value_addon_real_value( $item['border']['color'] ) : '',
			);

			$declaration['outline-offset'] = ! empty( $item['offset'] ) ? blockera_get_value_addon_real_value( $item['offset'] ) : '';
		}

		$this->setCss( $declaration );

		return $this->css;
	}

	public function getAllowedProperties(): array {

		return [
			'blockeraOutline' => 'outline',
			'blockeraOffset'  => 'outline-offset',
		];
	}

}
