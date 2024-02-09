<?php

namespace Publisher\Framework\Illuminate\StyleEngine\StyleDefinitions;

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
	protected function collectProps( array $setting ): array {

		if ( empty( $setting['type'] ) ) {

			return $this->properties;
		}

		$type = $setting['type'];

		[ 'padding' => $padding, 'margin' => $margin ] = $setting[ $type ];

		if ( empty( $padding ) && empty( $margin ) ) {

			return $this->properties;
		}

		$padding = is_array( $padding ) ? array_filter(
			$padding,
			[ $this, 'filteredItems' ]
		) : $padding;

		$margin = is_array( $margin ) ? array_filter(
			$margin,
			[ $this, 'filteredItems' ]
		) : $margin;

		$isImportant = $this->getImportant();

		$this->setProperties(
			array_merge(
				...array_map(
				static function ( string $item, string $property ) use ( $isImportant ): array {

					return [ "padding-{$property}" => pb_get_value_addon_real_value( $item ) . $isImportant ];
				},
				$padding,
				array_keys( $padding )
			),
				...array_map(
				static function ( string $item, string $property ) use ( $isImportant ): array {

					return [ "margin-{$property}" => pb_get_value_addon_real_value( $item ) . $isImportant ];
				},
				$margin,
				array_keys( $margin )
			),
			),
		);

		return $this->properties;
	}

	protected function getCacheKey( string $suffix = '' ): string {

		return pb_get_classname( __NAMESPACE__, __CLASS__ ) . parent::getCacheKey( $suffix );
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
			'publisherSpacing' => 'spacing',
		];
	}

}