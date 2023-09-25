<?php

namespace Publisher\Framework\Services\Render\Styles;

use Publisher\Framework\Exceptions\BaseException;

class EffectsStyle extends Style {

	/**
	 * @var array
	 */
	protected array $attributes = [];

	/**
	 * @throws BaseException
	 */
	public function style( array $request ): ?array {

		[
			'key'        => $key,
			'selector'   => $selector,
			'attributes' => $attributes,
		] = $request;

		if ( empty( $attributes[ $key ] ) ) {

			return null;
		}

		$this->attributes = $attributes;

		$style = $this->generate( $attributes[ $key ], $selector, $key );

		if ( ! empty( $style['css'] ) ) {

			$this->css[] = $style['css'];
		}

		return ! empty( $style['css'] ) ? $style : parent::style( $request );
	}

	/**
	 * Generate effects style
	 *
	 * @param string|array $effectValue  effect value
	 * @param string       $selector     the css selector
	 * @param string       $type         the type of property setting
	 *
	 * @throws BaseException
	 * @return array {
	 * @type string[]      $classnames   Array of class names.
	 * @type string[]      $declarations An associative array of CSS definitions,
	 *                                  e.g. `array( "$property" => "$value", "$property" => "$value" )`.
	 * }
	 */
	protected function generate( $effectValue, string $selector, string $type ): array {

		$propName = $this->getValidCssProp(
			strtolower( str_replace( 'publisher', '', $type ) )
		);

		$this->definition->setSettings( is_array( $effectValue ) ?
			[ 'type' => $propName, 'isVisible' => true, $propName => $effectValue, 'attributes' => $this->attributes ] :
			[ [ 'type' => $propName, 'isVisible' => true, $propName => $effectValue ] ]
		);

		try {

			$properties = $this->definition->getProperties();

		} catch ( BaseException $handler ) {

			throw new BaseException( __( 'invalid css properties, ' . $handler->getMessage(), 'publisher-core' ) );
		}

		$block_attributes = [
			'style' => [
				'publisherEffects' => [
					$type => $properties,
				],
			],
		];

		return getStyles(
			$block_attributes['style'],
			[
				'selector' => $selector,
				'context'  => 'block-supports',
			]
		);
	}

	/**
	 * Retrieve valid css property name!
	 *
	 * @param string $propName
	 *
	 * @return string
	 */
	protected function getValidCssProp( string $propName ): string {

		$mappedProps = [
			'publisherBlendMode' => 'mix-blend-mode',
			'publisherFilter'    => 'backdrop-filter',
		];

		return $mappedProps[ $propName ] ?? $propName;
	}

}
