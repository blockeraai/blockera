<?php

namespace Publisher\Framework\Illuminate\StyleEngine\StyleDefinitions;

class Spacing extends BaseStyleDefinition {

	public function getProperties(): array {

		[ 'padding' => $padding, 'margin' => $margin ] = $this->settings;

		if ( empty( $padding ) && empty( $margin ) ) {

			return [
				'padding' => '',
				'margin'  => '',
			];
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

					return [ "padding-{$property}" => $item . $isImportant ];
				},
				$padding,
				array_keys( $padding )
			),
				...array_map(
				static function ( string $item, string $property ) use ( $isImportant ): array {

					return [ "margin-{$property}" => $item . $isImportant ];
				},
				$margin,
				array_keys( $margin )
			),
			),
		);

		return $this->properties;
	}

	protected function getCacheKey( string $suffix = '' ): string {

		return getClassname( __NAMESPACE__, __CLASS__ ) . parent::getCacheKey( $suffix );
	}

	private function filteredItems( string $item ): bool {

		return ! empty( $item );
	}

}