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

		$padding = is_array( $padding ) ? implode(
			' ',
			array_map(
				static function ( string $item ) {

					if ( empty( $item ) ) {
						return 'unset';
					}

					return $item;
				},
				$padding
			)
		) : $padding;

		$margin = is_array( $margin ) ? implode(
			' ',
			array_map(
				static function ( string $item ) {

					if ( empty( $item ) ) {
						return 'unset';
					}

					return $item;
				},
				$margin
			)
		) : $margin;

		$this->setProperties( compact( 'padding', 'margin' ) );

		return $this->properties;
	}

	protected function getCacheKey( string $suffix = '' ): string {

		return getClassname( __NAMESPACE__, __CLASS__ ) . parent::getCacheKey( $suffix );
	}

}