<?php

namespace Blockera\Editor\StyleDefinitions;

/**
 * Class Position to generate css for supported position properties in css.
 *
 * @package Position
 */
class Position extends BaseStyleDefinition {

	/**
	 * Collect all css selectors and declarations.
	 *
	 * @param array $setting the block setting.
	 *
	 * @return array
	 */
	protected function css( array $setting ): array {

		$declaration = [];
		$cssProperty = $setting['type'];

		if ( empty( $cssProperty ) || empty( $setting[ $cssProperty ] ) || 'position' !== $cssProperty ) {

			return $declaration;
		}
		
		[
			'type'     => $position,
			'position' => $value,
		] = $setting[ $cssProperty ];

		$this->setDeclaration( $cssProperty, $position );

		$filteredValues = array_filter($value);

		if (! empty($filteredValues)) {
			$this->setDeclaration(
                $cssProperty,
                array_merge(
                    $this->declarations,
                    array_merge(
                        ...array_map(
                            static function ( string $item, string $property): array {

								return [ $property => blockera_get_value_addon_real_value($item) ];
                            },
                            $filteredValues,
                            array_keys($filteredValues)
                        )
                    )
                )
            );
		}

		$this->setCss( $this->declarations );

		return $this->css;
	}

}
