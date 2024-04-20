<?php

namespace Publisher\Framework\Illuminate\StyleEngine;

use JetBrains\PhpStorm\Pure;
use Publisher\Framework\Illuminate\StyleEngine\StyleDefinitions\BaseStyleDefinition;
use Symfony\Component\VarDumper\VarDumper;

/**
 * Class StyleEngine generating css style for any state of breakpoints with any properties.
 *
 * @package StyleEngine
 */
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
	 * Store block array.
	 *
	 * @var array
	 */
	protected array $block = [];

	/**
	 * Store array of settings.
	 *
	 * @var array $settings The settings array for generating css rules.
	 */
	protected array $settings = [];

	/**
	 * Store fallback css selector.
	 *
	 * @var string $selector The css selector for target element.
	 */
	protected string $selector = '';

	/**
	 * Store the definitions instances stack.
	 *
	 * @var array $definitions
	 */
	protected array $definitions = [];

	/**
	 * Store instance of current style definition class.
	 *
	 * @var BaseStyleDefinition $definition
	 */
	protected BaseStyleDefinition $definition;

	/**
	 * Store current pseudo state name.
	 *
	 * @var string $pseudoState
	 */
	protected string $pseudoState = 'normal';

	/**
	 * Store current device type.
	 *
	 * @var string $breakpoint
	 */
	protected string $breakpoint = 'laptop';

	/**
	 * Constructor.
	 *
	 * @param array  $block            The current block.
	 * @param string $fallbackSelector The css selector for target element.
	 * @param array  $styleDefinitions The style definitions array to generating css properties from requested settings array.
	 */
	public function __construct( array $block, string $fallbackSelector, array $styleDefinitions ) {

		[
			'attrs' => $settings,
		] = $block;

		$this->block       = $block;
		$this->settings    = $settings;
		$this->definitions = $styleDefinitions;
		$this->selector    = $fallbackSelector;
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

		// Get css media queries.
		$mediaQueries = pb_get_css_media_queries();

		// Validate breakpoint type.
		if ( ! isset( $breakpoint['type'], $mediaQueries[ $breakpoint['type'] ] ) ) {

			return '';
		}

		// Set current breakpoint for generating styles process.
		$this->breakpoint = $breakpoint['type'];

		// Get state css rules with breakpoint type.
		$stateCssRules = $this->getStateCssRules( $breakpoint['type'] );

		// Exclude empty css rules.
		if ( empty( $stateCssRules ) ) {

			return '';
		}

		// Concatenate generated css media query includes all css rules for current recieved breakpoint type.
		return sprintf(
			'%1$s{%2$s}',
			$mediaQueries[ $breakpoint['type'] ],
			implode( PHP_EOL, array_unique(
					array_filter(
						pb_array_flat( $stateCssRules ),
						'pb_get_filter_empty_array_item'
					)
				)
			),
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

		$this->pseudoState = $pseudoClass;

		$blockCss = array_map( [ $this, 'generateBlockCss' ], $this->definitions );

		return $this->normalizeCssRules(
			pb_convert_css_declarations_to_css_valid_rules(
				pb_combine_css(
					array_values( array_filter( $blockCss, 'pb_get_filter_empty_array_item' ) )
				)
			)
		);
	}

	/**
	 * Generating current block css styles.
	 *
	 * @param BaseStyleDefinition $definition the style definition instance.
	 *
	 * @return array The array of collection of selector and declaration.
	 */
	protected function generateBlockCss( BaseStyleDefinition $definition ): array {

		$this->definition = $definition;
		// get current block settings.
		$settings = $this->getSettings();

		if ( empty( $settings ) ) {

			return [];
		}

		$selectors = pb_get_block_state_selectors( pb_get_block_type_selectors( $this->block['blockName'] ), [
			'is-inner-block'     => false,
			'block-type'         => 'master',
			'block-settings'     => $settings,
			'fallback'           => $this->selector,
			'master-block-state' => $this->pseudoState,
			'pseudo-class'       => $this->pseudoState,
		] );

		$this->definition->flushDeclarations();
		$this->definition->setSettings( $settings );
		$this->definition->setSelectors( $selectors );

		$cssRules = $this->definition->getCssRules();

		if ( ! empty( $settings['publisherInnerBlocks'] ) ) {

			$cssRules = array_merge(
				$cssRules,
				pb_array_flat(
					array_map( [
						$this,
						'generateInnerBlockCss'
					], $settings['publisherInnerBlocks'], array_keys( $settings['publisherInnerBlocks'] ) )
				)
			);
		}

		return $cssRules;
	}

	/**
	 * Preparing css styles of inner blocks for current recieved state.
	 *
	 * @param array  $settings    the inner block settings of current recieved state.
	 * @param string $blockType   the block type of available inner block.
	 * @param string $pseudoState the pseudo state of inner block type.
	 *
	 * @return array the generated css rules for inner blocks in current state.
	 */
	protected function generateInnerBlockCss( array $settings, string $blockType, string $pseudoState = '' ): array {

		if ( empty( $settings['attributes'] ) ) {

			return [];
		}

		// Inner block status set TRUE.
		$selectors = pb_get_block_state_selectors( pb_get_block_type_selectors( $this->block['blockName'] ), [
			'is-inner-block'     => true,
			'block-type'         => $blockType,
			'fallback'           => $this->selector,
			'master-block-state' => $this->pseudoState,
			'block-settings'     => $settings['attributes'],
			'pseudo-class'       => $pseudoState ?? $this->pseudoState,
		] );

		// Exclude inner blocks styles when hasn't any selectors for this context.
		if ( empty( $selectors['innerBlocks'][ $blockType ] ) ) {

			return [];
		}

		$this->definition->flushDeclarations();
		$this->definition->setSettings( $settings['attributes'] );
		$this->definition->setSelectors( $selectors['innerBlocks'][ $blockType ] );

		$cssRules = $this->definition->getCssRules();

		if ( ! empty( $settings['attributes']['publisherBlockStates'] ) ) {

			$engine           = $this;
			$innerBlockStates = $settings['attributes']['publisherBlockStates'];

			$cssRules = array_merge(
				$cssRules,
				pb_array_flat(
					array_map( static function ( array $state, string $_pseudoState ) use ( $engine, $blockType ): array {

						if ( empty( $state['breakpoints'] ) || ( 'normal' === $_pseudoState && 'laptop' === $engine->breakpoint ) ) {

							return [];
						}

						return pb_array_flat(
							array_map( static function ( array $breakpointSettings ) use ( $engine, $blockType, $_pseudoState ): array {

								return $engine->generateInnerBlockCss( $breakpointSettings, $blockType, $_pseudoState );
							}, $state['breakpoints'], array_keys( $state['breakpoints'] ) )
						);
					}, $innerBlockStates, array_keys( $innerBlockStates ) )
				)
			);
		}

		return $cssRules;
	}

	/**
	 * Normalizing recieved css rules ...
	 *
	 * @param array $cssRules the valid css rules stack.
	 *
	 * @return array the normalized css rules
	 */
	protected function normalizeCssRules( array $cssRules ): array {

		return array_filter(
			array_map( static function ( string $props, string $selector ): string {

				if ( empty( $selector ) || empty( $props ) ) {

					return '';
				}

				return sprintf( '%1$s {%3$s %2$s %3$s}%3$s', $selector, $props, PHP_EOL );

			}, $cssRules, array_keys( $cssRules ) )
		);
	}

	/**
	 * Get current block state in breakpoint settings.
	 *
	 * @return array the block settings.
	 */
	#[Pure] public function getSettings(): array {

		if ( 'normal' === $this->pseudoState && 'laptop' === $this->breakpoint ) {

			return $this->settings;
		}

		$states = $this->settings['publisherBlockStates'] ?? [];
		$state  = pb_block_state_validate( $states, $this->pseudoState );

		// no state found or not exists any breakpoint.
		if ( empty( $state ) || empty( $state['breakpoints'] ) ) {

			return [];
		}

		// no breakpoint found.
		if ( empty( $state['breakpoints'][ $this->breakpoint ] ) ) {

			return [];
		}

		$breakpointSettings = $state['breakpoints'][ $this->breakpoint ];

		// invalid breakpoint founded.
		if ( empty( $breakpointSettings ) ) {

			return [];
		}

		return $breakpointSettings['attributes'] ?? [];
	}

}
