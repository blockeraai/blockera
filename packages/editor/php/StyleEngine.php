<?php

namespace Blockera\Editor;

use Blockera\Editor\StyleDefinitions\BaseStyleDefinition;
use Blockera\Exceptions\BaseException;
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
	 * @var array $pseudo_classes
	 */
	protected array $pseudo_classes = [
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
	 * @var string $pseudo_state
	 */
	protected string $pseudo_state = 'normal';

	/**
	 * Store current device type.
	 *
	 * @var string $breakpoint
	 */
	protected string $breakpoint;

	/**
	 * Store the inline styles.
	 *
	 * @var array $inline_styles
	 */
	protected array $inline_styles = [];

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

		// by default store base breakpoint.
		$this->breakpoint = blockera_core_config( 'breakpoints.base' );
	}

	/**
	 * Set inline styles.
	 *
	 * @param array $inline_styles The inline styles.
	 *
	 * @return void
	 */
	public function setInlineStyles( array $inline_styles): void {

		$this->inline_styles = $inline_styles;
	}

	/**
	 * Get css stylesheet for current block.
	 * 
	 * @return string
	 */
	public function getStylesheet(): string {

		$base_breakpoint = blockera_get_base_breakpoint();

		if (! empty($this->block['attrs']['blockeraBlockStates']['value'])) {
			$states      = $this->block['attrs']['blockeraBlockStates']['value'];
			$breakpoints = array_keys(blockera_array_flat(array_column($states, 'breakpoints')));

			// Add force base breakpoint if not exists.
			if (! in_array($base_breakpoint, $breakpoints, true)) {
				$breakpoints[] = $base_breakpoint;
			}

			$breakpointsCssRules = array_filter(
				array_map([ $this, 'prepareBreakpointStyles' ], $breakpoints),
				'blockera_get_filter_empty_array_item'
			);

			return implode(PHP_EOL, $breakpointsCssRules);
		}

		return $this->prepareBreakpointStyles($base_breakpoint);
	}

	/**
	 * Preparing css of breakpoint settings.
	 *
	 * @param string $breakpoint The breakpoint type.
	 *
	 * @return string The generated css rule for current breakpoint.
	 */
	protected function prepareBreakpointStyles( string $breakpoint ): string {

		// Get css media queries.
		$mediaQueries = blockera_get_css_media_queries();

		// Validate breakpoint type.
		if ( ! isset( $breakpoint, $mediaQueries[ $breakpoint ] ) ) {

			return '';
		}

		// Set current breakpoint for generating styles process.
		$this->breakpoint = $breakpoint;

		// Get state css rules with breakpoint type.
		$stateCssRules = $this->getStateCssRules( $breakpoint );

		// Exclude empty css rules.
		if ( empty( $stateCssRules ) ) {

			return '';
		}

		$styles = implode(
			PHP_EOL,
			array_unique(
				array_filter(
					blockera_array_flat( $stateCssRules ),
					'blockera_get_filter_empty_array_item'
				)
			)
		);

		// append css styles on root for base breakpoint.
		if ( empty( $mediaQueries[ $breakpoint ] ) ) {

			return $styles;
		}

		// Concatenate generated css media query includes all css rules for current received breakpoint type.
		return sprintf(
			'%1$s{%2$s}',
			$mediaQueries[ $breakpoint ],
			$styles,
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

		// Imagine blockera block states stack is empty.
		if ( empty( $this->settings['blockeraBlockStates']['value'] ) ) {

			// We should just prepare normal state styles because not exists any other states.
			$css_rules = $this->prepareStateStyles( 'normal', blockera_get_base_breakpoint() );

			// Exclude empty $css_rules.
			if ( empty( $css_rules ) ) {

				return [];
			}

			return [ $css_rules ];
		}

		$this->breakpoint = $breakpoint;

		// We should process any supported pseudo classes by blockera to prepare each state styles.
		return array_filter(
			array_map(
				function ( string $state ) use ( $breakpoint ): array {

					return $this->prepareStateStyles( $state );
				},
				$this->pseudo_classes
			),
			'blockera_get_filter_empty_array_item'
		);
	}

	/**
	 * Preparing css of current state settings.
	 *
	 * @param string $pseudoClass The state name (as pseudo class in css).
	 *
	 * @return array The state css rules.
	 */
	protected function prepareStateStyles( string $pseudoClass ): array {

		$this->pseudo_state = $pseudoClass;

		// Prepare generated block css by supported each of style definitions.
		$block_css = array_map( [ $this, 'generateBlockCss' ], $this->definitions );

		return $this->normalizeCssRules(
			blockera_convert_css_declarations_to_css_valid_rules(
				blockera_combine_css(
					array_values( array_filter( $block_css, 'blockera_get_filter_empty_array_item' ) )
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

		$this->definition->resetProperties();
		$this->configureDefinition( $this->definition );
		$this->definition->setSettings( $settings );
		$this->definition->setBreakpoint( $this->breakpoint );
		$this->definition->setBlockType( 'master' );
		$this->definition->setPseudoState( $this->pseudo_state );
		$this->definition->setBlockeraUniqueSelector( $this->selector );

		$cssRules = $this->definition->getCssRules();

		// the "blockeraInnerBlocks.value" accessible on normal state in base breakpoint and un normal states accessible without value index!
		$innerBlocksSettings = $settings['blockeraInnerBlocks']['value'] ?? $settings['blockeraInnerBlocks'] ?? [];

		// Validation: Check if sets blockera inner blocks?
		if ( ! empty( $innerBlocksSettings ) ) {

			// Preparing inner blocks css ...
			$cssRules = array_merge(
				$cssRules,
				blockera_array_flat(
					array_map(
						[
							$this,
							'generateInnerBlockCss',
						],
						$innerBlocksSettings,
						array_keys( $innerBlocksSettings )
					)
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
	 * @throws BaseException Exception for invalid selector.
	 *
	 * @return array the generated css rules for inner blocks in current state.
	 */
	protected function generateInnerBlockCss( array $settings, string $blockType, string $pseudoState = '' ): array {

		if ( empty( $settings['attributes'] ) ) {

			return [];
		}

		$this->definition->resetProperties();
		$this->configureDefinition( $this->definition );
		$this->definition->setBlockType( $blockType );
		$this->definition->setBreakpoint( $this->breakpoint );
		$this->definition->setInnerPseudoState( $pseudoState );
		$this->definition->setPseudoState( $this->pseudo_state );
		$this->definition->setSettings( $settings['attributes'] );
		$this->definition->setBlockeraUniqueSelector( $this->selector );

		$cssRules = $this->definition->getCssRules();

		if ( ! empty( $settings['attributes']['blockeraBlockStates'] ) ) {

			$engine           = $this;
			$innerBlockStates = $settings['attributes']['blockeraBlockStates'];

			$cssRules = array_merge(
				$cssRules,
				blockera_array_flat(
					array_map(
						static function ( array $state, string $_pseudoState ) use ( $engine, $blockType ): array {

							if ( empty( $state['breakpoints'] ) || ( blockera_is_normal_on_base_breakpoint( $_pseudoState, $engine->breakpoint ) ) ) {

								return [];
							}

							return blockera_array_flat(
								array_map(
									static function ( array $breakpointSettings ) use ( $engine, $blockType, $_pseudoState ): array {

										return $engine->generateInnerBlockCss( $breakpointSettings, $blockType, $_pseudoState );
									},
									$state['breakpoints'],
									array_keys( $state['breakpoints'] )
								)
							);
						},
						$innerBlockStates,
						array_keys( $innerBlockStates )
					)
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
			array_map(
				static function ( string $props, string $selector ): string {

					if ( empty( $selector ) || empty( $props ) ) {

						return '';
					}

					return sprintf( '%1$s {%3$s %2$s %3$s}%3$s', $selector, $props, PHP_EOL );

				},
				$cssRules,
				array_keys( $cssRules )
			)
		);
	}

	/**
	 * Get current block state in breakpoint settings.
	 *
	 * @return array the block settings.
	 */
	public function getSettings(): array {

		$supports = $this->definition->getSupports();

		if (empty($supports)) {

			return [];
		}

		if ( blockera_is_normal_on_base_breakpoint( $this->pseudo_state, $this->breakpoint ) ) {

			return blockera_get_definition_supports_settings( $this->settings, $supports );
		}

		$states = $this->settings['blockeraBlockStates']['value'] ?? [];
		$state  = blockera_block_state_validate( $states, $this->pseudo_state );

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

		return blockera_get_definition_supports_settings( $breakpointSettings['attributes'] ?? [], $supports );
	}

	/**
	 * Sets config on definition properties.
	 *
	 * @param BaseStyleDefinition $definition The style definition instance.
	 *
	 * @return void
	 */
	private function configureDefinition( BaseStyleDefinition $definition ) {

		$definition->setBlock( $this->block );

		$definition->setConfig(
			blockera_get_block_type_property(
				$this->block['blockName'],
				'supports'
			)['blockeraStyleEngine'] ?? []
		);

		$definition->setDefaultSettings(
			blockera_get_block_type_property(
				$this->block['blockName'],
				'attributes'
			)
		);

		$definition->setInlineStyles($this->inline_styles);
	}

}
