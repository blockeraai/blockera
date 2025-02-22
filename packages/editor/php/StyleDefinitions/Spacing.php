<?php
// phpcs:disable
namespace Blockera\Editor\StyleDefinitions;

class Spacing extends BaseStyleDefinition {

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

		$padding = $margin = [];

		if ( isset( $setting[ $cssProperty ]['padding'] ) ) {
			$padding = $setting[ $cssProperty ]['padding'];
		}

		if ( isset( $setting[ $cssProperty ]['margin'] ) ) {
			$margin = $setting[ $cssProperty ]['margin'];
		}

		if ( empty( $padding ) && empty( $margin ) ) {

			return $declaration;
		}

		if ( is_array( $padding ) ) {

			$padding = array_filter(
				array_map( 'blockera_get_value_addon_real_value', $padding ),
				[ $this, 'filteredItems' ]
			);

			foreach ($padding as $property => $item) {
				$declaration[] = ["padding-{$property}" => blockera_get_value_addon_real_value($item)];
			}
		}

		if ( is_array( $margin ) ) {

			$margin = array_filter(
				array_map( 'blockera_get_value_addon_real_value', $margin ),
				[ $this, 'filteredItems' ]
			);
			
			foreach ($margin as $property => $item) {
				$declaration[] = ["margin-{$property}" => blockera_get_value_addon_real_value($item)];
			}
		}

		$this->setCss( $declaration );

		return $this->css;
	}

	private function filteredItems( string $item ): bool {

		return ! empty( $item );
	}

}
