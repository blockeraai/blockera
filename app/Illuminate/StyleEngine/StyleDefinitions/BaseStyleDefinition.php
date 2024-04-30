<?php

namespace Blockera\Framework\Illuminate\StyleEngine\StyleDefinitions;

use Blockera\Framework\Illuminate\StyleEngine\StyleDefinitions\Contracts\HaveCustomSettings;

abstract class BaseStyleDefinition {

	/**
	 * hold style definition settings from consumer request.
	 *
	 * @var array
	 */
	protected array $settings = [];

	/**
	 * hold collection of properties of current style definition.
	 *
	 * @var array
	 */
	protected array $declarations = [];

	/**
	 * store all css selectors.
	 *
	 * @var array
	 */
	protected array $selectors = [];

	/**
	 * store css selector.
	 *
	 * @var string
	 */
	protected string $selector = '';

	/**
	 * Store final generated css,
	 * involves collection of css selector related to generated css declaration.
	 *
	 * @var array
	 */
	protected array $css = [];

	/**
	 * hold collection of options to generate style
	 *
	 * @var array
	 */
	protected array $options = [
		'is-important' => false,
	];

	public function setOptions( array $options ): void {

		$this->options = array_merge(
			$this->options,
			$options
		);
	}

	/**
	 * @return string
	 */
	public function getSelector(): string {

		return $this->selector;
	}

	/**
	 * Sets suitable css selector for related property.
	 *
	 * @param string $featureId The feature identifier.
	 */
	public function setSelector( string $featureId ): void {

		$selectors  = $this->getSelectors();
		$fallbackId = $this->calculateFallbackFeatureId( $featureId );

		$this->selector = blockera_calculate_feature_css_selector( $selectors, $featureId, $fallbackId );
	}

	/**
	 * @return array
	 */
	public function getSelectors(): array {

		return $this->selectors;
	}

	/**
	 * Sets selectors into stack.
	 *
	 * @param array $selectors the recieved selectors property.
	 */
	public function setSelectors( array $selectors ): void {

		$this->selectors = $selectors;
	}

	/**
	 * @return array
	 */
	public function getCssRules(): array {

		// $this->filterSettings();

		array_map( [ $this, 'generateCssRules' ], $this->settings, array_keys( $this->settings ) );

		return array_filter( $this->css, 'blockera_get_filter_empty_array_item' );
	}

	/**
	 * Generating css rules.
	 *
	 * @param mixed  $value the prepared setting from context.
	 * @param string $name  the name of setting.
	 *
	 * @return void
	 */
	protected function generateCssRules( $value, string $name ): void {

		$cssProperty = $this->getValidCssProp( $name );

		if ( ! $cssProperty ) {

			return;
		}

		if ( $this instanceof HaveCustomSettings ) {

			$setting = $this->getCustomSettings( $this->settings, $name, $cssProperty );

		} else {

			$setting = [
				[
					'isVisible'  => true,
					'type'       => $cssProperty,
					$cssProperty => $value,
				],
			];
		}

		array_map( [ $this, 'css' ], $setting );
	}

	/**
	 * Sets css declaration into current selector.
	 *
	 * @param array $declaration the generated css declarations array.
	 */
	public function setCss( array $declaration ): void {

		if ( isset( $this->css[ $this->getSelector() ] ) ) {

			$this->css[ $this->getSelector() ] = array_merge( $this->css[ $this->getSelector() ], $declaration );

			return;
		}

		$this->css[ $this->getSelector() ] = $declaration;
	}

	/**
	 * Check is important style property value?
	 *
	 * @return bool true on success, false when otherwise.
	 */
	protected function isImportant(): bool {

		return $this->options['is-important'];
	}

	/**
	 * Retrieve important css property value or empty string when was not important!
	 *
	 * @return string
	 */
	protected function getImportant(): string {

		return $this->isImportant() ? ' !important' : '';
	}

	/**
	 * @param array $props
	 *
	 * @return void
	 */
	protected function setDeclarations( array $props ): void {

		$this->declarations = $props;
	}

	/**
	 * @param string $id
	 * @param        $value
	 *
	 * @return void
	 */
	protected function setDeclaration( string $id, $value ): void {

		$this->declarations[ $id ] = $value;
	}

	/**
	 * Sets settings for generating css process.
	 *
	 * @param array $settings
	 *
	 * @return void
	 */
	public function setSettings( array $settings ): void {

		$this->settings = $settings;
	}

	/**
	 * Get allowed reserved properties.
	 *
	 * @return array
	 */
	abstract public function getAllowedProperties(): array;

	/**
	 * Get valid css property by reserved name.
	 *
	 * @param string $reservedName the setting reserved name.
	 *
	 * @return string|null string on access to available css property, null when not found related css property with setting reserved name.
	 */
	protected function getValidCssProp( string $reservedName ): ?string {

		$allowedProps = $this->getAllowedProperties();

		if ( ! empty( $allowedProps[ $reservedName ] ) ) {

			return $allowedProps[ $reservedName ];
		}

		return null;
	}

	/**
	 * @return array the css declarations.
	 */
	public function getDeclarations(): array {

		return $this->declarations;
	}

	/**
	 * Filtering settings property.
	 */
	protected function filterSettings(): void {

		$definition = $this;

		array_map( [ $this, 'removeInvalidSettings' ], $this->settings, array_keys( $this->settings ) );
	}

	/**
	 * Remove invalid setting from stack.
	 *
	 * @param mixed        $setting the setting.
	 * @param string | int $name    the name of setting.
	 *
	 * @return void
	 */
	protected function removeInvalidSettings( $setting, $name ): void {

		// Assume current setting not allowed to handle on this definition.
		if ( null === $setting || ! array_key_exists( $name, $this->getAllowedProperties() ) || ! is_string( $name ) ) {

			unset( $this->settings[ $name ] );
		}
	}

	/**
	 * collect all css selectors and declarations.
	 *
	 * @param array $setting the block setting.
	 *
	 * @return array Retrieve array of collection of css selectors and css declarations.
	 */
	abstract protected function css( array $setting ): array;

	/**
	 * Calculation fallback feature id.
	 * To be compatible with WordPress block selectors.
	 *
	 * @param string $cssProperty The css property key.
	 *
	 * @return string The path to fallback feature id.
	 */
	protected function calculateFallbackFeatureId( string $cssProperty ): string {

		return '';
	}

	/**
	 * Flush all declarations.
	 *
	 * @return void
	 */
	public function flushDeclarations(): void {

		$this->declarations = [];
	}

}
