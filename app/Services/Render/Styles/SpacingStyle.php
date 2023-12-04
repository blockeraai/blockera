<?php

namespace Publisher\Framework\Services\Render\Styles;

use Publisher\Framework\Exceptions\BaseException;

class SpacingStyle extends Style {

	/**
	 * @throws BaseException
	 */
	public function style( array $request ): ?array {

		[
			'selector'   => $selector,
			'attributes' => $attributes,
		] = $request;

		if ( empty( $attributes['publisherSpacing'] ) ) {
			return null;
		}

		$style = $this->generate( $attributes['publisherSpacing'], $selector );

		if ( ! empty( $style['css'] ) ) {

			$this->css[] = $style['css'];
		}

		return empty( $style ) ? parent::style( $request ) : $style;
	}

	/**
	 * Generate spacing style
	 *
	 * @param array   $setting      spacing setting
	 * @param string  $selector     the css selector
	 *
	 * @throws BaseException
	 * @return array {
	 * @type string[] $classnames   Array of class names.
	 * @type string[] $declarations An associative array of CSS definitions,
	 *                                  e.g. `array( "$property" => "$value", "$property" => "$value" )`.
	 * }
	 */
	protected function generate( array $setting, string $selector ): array {

		$this->definition->setSettings( $setting );
		$this->definition->setOptions( [ 'is-important' => true ] );

		try {

			$properties = $this->definition->getProperties();

		} catch ( BaseException $handler ) {

			throw new BaseException( __( 'invalid css properties, ' . $handler->getMessage(), 'publisher-core' ) );
		}

		$block_attributes = [
			'style' => [
				'publisherSpacing' => $properties,
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

}
