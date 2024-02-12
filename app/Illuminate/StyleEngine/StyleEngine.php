<?php

namespace Publisher\Framework\Illuminate\StyleEngine;

use Illuminate\Contracts\Container\BindingResolutionException;
use Publisher\Framework\Illuminate\StyleEngine\StyleDefinitions\BaseStyleDefinition;
use Publisher\Framework\Services\Render\Parser;

final class StyleEngine {

	/**
	 * Store pseudo-classes list are used to define a special state of an element.
	 * For example, it can be used to:
	 * - Style an element when a user mouses over it
	 * - Style visited and unvisited links differently
	 * - Style an element when it gets focus
	 *
	 * @var array $pseudoClasses
	 */
	protected array $pseudoClasses = [
		'hover',
		'after',
		'focus',
		'normal',
		'active',
		'before',
		'visited',
		'custom-class',
		'parent-class',
		'parent-hover',
	];

	/**
	 * Store array of settings.
	 *
	 * @var array $settings The settings array for generating css rules.
	 */
	protected array $settings = [];

	/**
	 * Store css selector.
	 *
	 * @var string $selector The css selector for target element.
	 */
	protected string $selector = '';

	/**
	 * @var array
	 */
	protected array $dependencies = [];

	/**
	 * Constructor.
	 *
	 * @param array  $settings     The request settings to generate css rules.
	 * @param string $selector     The css selector for target element.
	 * @param array  $dependencies The dependencies array to generating css properties from settings array.
	 */
	public function __construct( array $settings, string $selector, array $dependencies ) {

		$this->selector     = $selector;
		$this->settings     = $settings;
		$this->dependencies = $dependencies;
	}

	/**
	 * Get css stylesheet for current block.
	 *
	 * @return string
	 */
	public function getStylesheet(): string {

		$breakpointsCssRules = array_filter(
			array_map( [ $this, 'prepareBreakpointStyles' ], pb_core_config( 'breakpoints' ) ),
			'pb_get_filter_empty_array_item'
		);

		return implode( PHP_EOL, $breakpointsCssRules );
	}

	/**
	 * Preparing css of breakpoint settings.
	 *
	 * @param array $breakpoint The breakpoint data.
	 *
	 * @return string The generated css rule for current breakpoint.
	 */
	protected function prepareBreakpointStyles( array $breakpoint ): string {

		$mediaQueries = pb_get_css_media_queries();

		if ( ! isset( $breakpoint['type'], $mediaQueries[ $breakpoint['type'] ] ) ) {

			return '';
		}

		$stateCssRules = $this->getStateCssRules( $breakpoint['type'] );

		if ( empty( $stateCssRules ) ) {

			return '';
		}

		return sprintf(
			'%1$s{%2$s}',
			$mediaQueries[ $breakpoint['type'] ],
			implode( PHP_EOL, pb_array_flat( $stateCssRules ) ),
		);
	}

	/**
	 * Get state css rules with pseudo class name.
	 *
	 * @param string $breakpoint The breakpoint( or device type) name.
	 *
	 * @return array The css rules for current pseudo class.
	 */
	protected function getStateCssRules( string $breakpoint ): array {

		$states = $this->settings['publisherBlockStates'] ?? [];

		return array_filter(
			array_map( function ( string $state ) use ( $breakpoint ): array {

				return $this->prepareStateStyles( $state, $breakpoint );
			}, $this->pseudoClasses ),
			'pb_get_filter_empty_array_item'
		);
	}

	/**
	 * Preparing css of current state settings.
	 *
	 * @param string $pseudoClass The state name (as pseudo class in css).
	 * @param string $breakpoint  The current breakpoint (device type).
	 *
	 * @return array The state css rules.
	 */
	protected function prepareStateStyles( string $pseudoClass, string $breakpoint ): array {

		$cssRules = [];
		$format   = '%1$s%2$s{%3$s}';
		$settings = $this->getRequestSettings( $pseudoClass, $breakpoint );
		$cssRule  = implode( PHP_EOL, $this->convertToValidCssRules( $this->getProperties( $settings ) ) );

		// no settings found.
		if ( empty( $settings ) ) {

			return [];
		}

		// override normal state format and remove normal from pseudo class.
		if ( 'normal' === $pseudoClass ) {

			$format = '%1$s{%2$s}';

			$values = [ $this->selector ];

		} else {
			// normalize pseudo class.
			$values = [ $this->selector, ":$pseudoClass" ];
		}

		// break if not exists any other states or only exists normal state.
		if ( ( empty( $states ) || 1 === count( $states ) ) && 1 === count( $cssRules ) ) {

			return [];
		}

		if ( in_array( $pseudoClass, [ 'custom-class', 'parent-class' ], true ) ) {

			$state = pb_get_block_state( $this->settings, $pseudoClass );

			// no state found.
			if ( ! $state || ! isset( $state['values']['class'] ) ) {

				return [];
			}

			$values = [ $this->selector, "{$state['values']['class']}" ];
		}

		// TODO: implements parent-hover state ...

		$innerBlocks = $settings['publisherInnerBlocks'] ?? [];

		if ( ! empty( $innerBlocks ) ) {

			$args                = [
				'pseudo-class'    => $pseudoClass,
				'breakpoint'      => $breakpoint,
				'parent-selector' => $values[0],
			];
			$innerBlocksSettings = pb_get_inner_blocks_css( $innerBlocks, $this, $args );

			$engine = $this;

			$cssRules = array_merge( $cssRules, array_map( function ( array $setting ) use ( $breakpoint, $engine ): string {

				return implode( PHP_EOL, pb_array_flat( $engine->getStateCssRules( $breakpoint ) ) );
			}, $innerBlocksSettings ) );
		}

		if ( empty( $cssRule ) ) {

			return [];
		}

		$cssRules[] = sprintf(
			$format,
			...array_merge( $values, [ $cssRule ] )
		);

		return $cssRules;
	}

	/**
	 * Get css properties.
	 *
	 * @param array $settings The request settings to generate css rules.
	 *
	 * @return array The css properties order by received settings in request.
	 */
	protected function getProperties( array $settings ): array {

		$cssProperties = [];

		/**
		 * @var BaseStyleDefinition $dependency
		 */
		foreach ( $this->dependencies as $dependency ) {

			if ( empty( $settings ) ) {

				continue;
			}

			$dependency->setSettings( $settings );

			$cssProperties[] = $dependency->getProperties();
		}

		return array_merge( ...$cssProperties );
	}

	/**
	 * Convert css properties to valid css rules.
	 *
	 * @param array $cssProperties
	 *
	 * @return array the converted array css properties to valid css rules.
	 */
	protected function convertToValidCssRules( array $cssProperties ): array {

		$validCssRules = [];

		foreach ( $cssProperties as $property => $value ) {

			if ( is_array( $value ) && empty( $value ) ) {

				continue;
			}

			$validCssRules[] = sprintf( '%s:%s;', $property, $value );
		}

		return $validCssRules;
	}

	/**
	 * Get request settings.
	 *
	 * @param string $pseudoClass The block state name. by default normal.
	 *                            Like: normal, hover, active, etc.
	 * @param string $breakpoint  The breakpoint( or device type) name.
	 *
	 * @return array
	 */
	public function getRequestSettings( string $pseudoClass, string $breakpoint ): array {

		//FIXME: normal state breakpoint as laptop!
		if ( 'normal' === $pseudoClass && in_array( $breakpoint, [ 'laptop', 'desktop' ], true ) ) {

			return $this->settings;
		}

		$states = $this->settings['publisherBlockStates'] ?? [];

		$state = pb_get_block_state( $states, $pseudoClass );

		// no state found or not exists any breakpoint.
		if ( empty( $state ) || empty( $state['breakpoints'] ) ) {

			return [];
		}

		$breakpoint = pb_get_state_breakpoint( $state['breakpoints'], $breakpoint );

		// invalid breakpoint founded.
		if ( empty( $breakpoint ) ) {

			return [];
		}

		return $breakpoint['attributes'] ?? [];
	}

	/**
	 * @param array $settings
	 */
	public function setSettings( array $settings ): void {

		$this->settings = $settings;
	}

	/**
	 * @param string $selector
	 */
	public function setSelector( string $selector ): void {

		$this->selector = $selector;
	}

}