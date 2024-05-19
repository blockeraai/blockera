<?php

namespace Blockera\Editor\StyleDefinitions;

class Spacing extends BaseStyleDefinition {

	protected array $options = [
		'is-important' => true,
	];

	/**
	 * @inheritDoc
	 *
	 * @param array $setting
	 *
	 * @return string[]
	 */
	protected function css( array $setting ): array {

		$declaration = [];
		$cssProperty = $setting['type'];

		if ( empty( $cssProperty ) ) {

			return $declaration;
		}

		$this->setSelector( $cssProperty );

		[ 'padding' => $padding, 'margin' => $margin ] = $setting[ $cssProperty ];

		if ( empty( $padding ) && empty( $margin ) ) {

			return $declaration;
		}

		if (is_array( $padding )){

			$padding = array_filter(
				array_map('blockera_get_value_addon_real_value', $padding),
				[$this , 'filteredItems']
			);
		}

		if (is_array( $margin )){

			$margin = array_filter(
				array_map('blockera_get_value_addon_real_value', $margin),
				[$this , 'filteredItems']
			);
		}

		$isImportant = $this->getImportant();

		$declaration = array_merge(
			...array_map(
				static function ( string $item, string $property ) use ( $isImportant ): array {

					return [ "padding-{$property}" => blockera_get_value_addon_real_value( $item ) . $isImportant ];
				},
				$padding,
				array_keys( $padding )
			),
			...array_map(
				static function ( string $item, string $property ) use ( $isImportant ): array {

					return [ "margin-{$property}" => blockera_get_value_addon_real_value( $item ) . $isImportant ];
				},
				$margin,
				array_keys( $margin )
			),
		);

		$this->setCss( $declaration );

		return $this->css;
	}

	private function filteredItems( string $item ): bool {

		return ! empty( $item );
	}

	/**
	 * @inheritDoc
	 *
	 * @return string[]
	 */
	public function getAllowedProperties(): array {

		return [
			'blockeraSpacing' => 'spacing',
		];
	}

}
