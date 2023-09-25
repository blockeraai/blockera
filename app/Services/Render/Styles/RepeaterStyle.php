<?php

namespace Publisher\Framework\Services\Render\Styles;

use Publisher\Framework\Exceptions\BaseException;

abstract class RepeaterStyle extends Style {

	/**
	 * @throws BaseException
	 */
	public function style( array $request ): ?array {

		[
			'selector'   => $selector,
			'attributes' => $attributes,
		] = $request;

		if ( empty( $attributes[ $this->getId() ] ) ) {

			return null;
		}

		$style = $this->generate( $attributes[ $this->getId() ], $selector );

		if ( ! empty( $style['css'] ) ) {

			$this->css[] = $style['css'];
		}

		return $style;
	}

	/**
	 * Generate text-shadow style.
	 *
	 * @param array   $settings     text-shadow setting
	 * @param string  $selector     the css selector
	 *
	 * @throws BaseException
	 * @return array {
	 * @type string[] $classnames   Array of class names.
	 * @type string[] $declarations An associative array of CSS definitions,
	 *                                  e.g. `array( "$property" => "$value", "$property" => "$value" )`.
	 * }
	 */
	protected function generate( array $settings, string $selector ): array {

		$this->definition->setSettings( $settings );

		try {

			$properties = $this->definition->getProperties();

		} catch ( BaseException $handler ) {

			throw new BaseException( __( 'invalid css properties, ' . $handler->getMessage(), 'publisher-core' ) );
		}

		$block_attributes = [
			'style' => [
				$this->getId() => [
					$this->getCssProp() => implode( ', ', array_filter( $properties ) )
				],
			],
		];

		return getStyles(
			$block_attributes['style'],
			[
				'selector' => $selector,
				'context'  => 'block-supports',
			] );
	}

	/**
	 * Retrieve style identifier.
	 *
	 * @return string
	 */
	abstract protected function getId(): string;

	/**
	 * Retrieve css property name
	 *
	 * @return string css valid property
	 */
	abstract protected function getCssProp(): string;

}

