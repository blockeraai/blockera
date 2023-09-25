<?php

namespace Publisher\Framework\Services\Render\Styles;

use Publisher\Framework\Exceptions\BaseException;

abstract class SimpleStyle extends Style {

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

		if ( is_array( $attributes[ $key ] ) ) {

			$style = $this->complexGenerate( $attributes[ $key ], $selector, $key );

		} else {

			$style = $this->generate( $attributes[ $key ], $selector, $key );
		}


		if ( ! empty( $style['css'] ) ) {

			$this->css[] = $style['css'];
		}

		return empty( $style ) ? parent::style( $request ) : $style;
	}

	/**
	 * Generate style
	 *
	 * @param string  $setting
	 * @param string  $selector
	 * @param string  $propId
	 *
	 * @throws BaseException
	 * @return array {
	 * @type string[] $classnames   Array of class names.
	 * @type string[] $declarations An associative array of CSS definitions,
	 *                                  e.g. `array( "$property" => "$value", "$property" => "$value" )`.
	 * }
	 */
	protected function generate( string $setting, string $selector, string $propId ): array {

		$propName = $this->getValidCssProp( $propId );

		$this->beforeGenerate( $propName );

		$styleSettings = apply_filters(
			'publisher-core/services/render/styles/share/settings-format',
			[ $propName => $setting, 'type' => $propName ]
		);

		$this->definition->setSettings( $styleSettings );

		try {

			$properties = $this->definition->getProperties();

		} catch ( BaseException $handler ) {

			throw new BaseException( __( 'invalid css properties, ' . $handler->getMessage(), 'publisher-core' ) );
		}

		$block_attributes = [
			'style' => [
				$this->getStyleId() => [
					$propId => $properties[ $propName ] ?? '',
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
	 * Generate style with complex setting
	 *
	 * @param array   $setting
	 * @param string  $selector
	 * @param string  $propId
	 *
	 * @throws BaseException
	 * @return array {
	 * @type string[] $classnames   Array of class names.
	 * @type string[] $declarations An associative array of CSS definitions,
	 *                                  e.g. `array( "$property" => "$value", "$property" => "$value" )`.
	 * }
	 */
	protected function complexGenerate( array $setting, string $selector, string $propId ): array {

		$propName = $this->getValidCssProp( $propId );

		$this->beforeGenerate( $propName );

		$styleSettings = apply_filters(
			'publisher-core/services/render/styles/share/settings-format',
			[ $propName => $setting, 'type' => $propName ]
		);

		$this->definition->setSettings( $styleSettings );

		try {

			$properties = $this->definition->getProperties();

		} catch ( BaseException $handler ) {

			throw new BaseException( __( 'invalid css properties, ' . $handler->getMessage(), 'publisher-core' ) );
		}

		$block_attributes = [
			'style' => [
				$this->getStyleId() => empty( $properties[ $propName ] ) ?
					$properties :
					(
					count( $properties ) > 1 ?
						$properties :
						[
							//TODO: instead replace {$propName} with {$propId} and sync with config.php file of StyleDefinitions module!
							$propId => $properties[ $propName ],
						]
					),
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
	 * Retrieve style identifier of block attributes when starts with "publisher" prefix
	 *
	 * @return string
	 */
	abstract protected function getStyleId(): string;

	/**
	 * Retrieve corresponding valid css property name with given publisher property name
	 *
	 * @param string $propId the publisher property name
	 *
	 * @return string
	 */
	abstract protected function getValidCssProp( string $propId ): string;

	/**
	 * Running scripts before generate style
	 *
	 * @param string $propId the publisher property name
	 *
	 * @return void
	 */
	abstract protected function beforeGenerate( string $propId ): void;

}