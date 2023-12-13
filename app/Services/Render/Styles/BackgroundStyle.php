<?php

namespace Publisher\Framework\Services\Render\Styles;

use Publisher\Framework\Exceptions\BaseException;

class BackgroundStyle extends Style {

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

		switch ( $key ) {

			case 'publisherBackgroundClip':
				$style = $this->generate( $attributes[ $key ], $selector, $key );
				break;

			case 'publisherBackgroundColor':
				$style = $this->generate( pb_get_value_addon_real_value( $attributes[ $key ] ), $selector, $key );
				break;

			default:
			case 'publisherBackground':
				$style = $this->generateBackground( $attributes[ $key ], $selector );
				break;

		}

		if ( ! empty( $style['css'] ) ) {

			$this->css[] = $style['css'];
		}

		return $style;
	}

	/**
	 * Background style generate
	 *
	 * @param string  $styleValue   style value
	 * @param string  $selector     the css selector
	 * @param string  $propName     the style identifier
	 *
	 * @throws BaseException
	 * @return array {
	 * @type string[] $classnames   Array of class names.
	 * @type string[] $declarations An associative array of CSS definitions,
	 *                                  e.g. `array( "$property" => "$value", "$property" => "$value" )`.
	 * }
	 */
	protected function generate( string $styleValue, string $selector, string $propName ): array {

		$propName = $this->getValidCssProp( $propName );

		$this->definition->setOptions( [
			'is-important' => true,
		] );
		$this->definition->setSettings( [ [ 'type' => $propName, 'isVisible' => true, $propName => $styleValue ] ] );

		try {

			$properties = $this->definition->getProperties();

		} catch ( BaseException $handler ) {

			throw new BaseException( __( 'invalid css properties, ' . $handler->getMessage(), 'publisher-core' ) );
		}

		$block_attributes = array(
			'style' => array(
				'publisherBackground' => $properties,
			),
		);

		return getStyles(
			$block_attributes['style'],
			array(
				'selector' => $selector,
				'context'  => 'block-supports',
			)
		);
	}

	/**
	 * Background style generate
	 *
	 * @param array   $settings     background settings
	 * @param string  $selector     the css selector
	 *
	 * @throws BaseException
	 * @return array {
	 * @type string[] $classnames   Array of class names.
	 * @type string[] $declarations An associative array of CSS definitions,
	 *                                  e.g. `array( "$property" => "$value", "$property" => "$value" )`.
	 * }
	 */
	protected function generateBackground( array $settings, string $selector ): array {

		$this->definition->setOptions( [
			'is-important' => true,
		] );
		$this->definition->setSettings( $settings );

		try {

			$properties = $this->definition->getProperties();

		} catch ( BaseException $handler ) {

			throw new BaseException( __( 'invalid css properties, ' . $handler->getMessage(), 'publisher-core' ) );
		}


		$block_attributes = array(
			'style' => array(
				'publisherBackground' => $properties,
			),
		);

		return getStyles(
			$block_attributes['style'],
			array(
				'selector' => $selector,
				'context'  => 'block-supports',
			)
		);
	}

	protected function getValidCssProp( string $propName ): string {

		$mappedProps = [
			'publisherBackgroundClip'  => 'clip',
			'publisherBackgroundColor' => 'color',
		];

		return $mappedProps[ $propName ];
	}

}

