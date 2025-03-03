<?php

namespace Blockera\Editor;

use Blockera\Bootstrap\Application;
use Blockera\Exceptions\BaseException;
use Blockera\Editor\StyleDefinitions\BaseStyleDefinition;

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
	 * Store the supports.
	 *
	 * @var array $supports
	 */
	protected array $supports = [];

	/**
	 * Store the breakpoints.
	 *
	 * @var array $breakpoints
	 */
	protected array $breakpoints = [];

	/**
	 * Store the application instance.
	 *
	 * @var Application $app
	 */
	protected Application $app;

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
	 * Set the application instance.
	 *
	 * @param Application $app The application instance.
	 *
	 * @return void
	 */
	public function setApp( Application $app ): void {

		$this->app = $app;
	}

	/**
	 * Set supports.
	 *
	 * @param array $supports The supports.
	 *
	 * @return void
	 */
	public function setSupports( array $supports): void {

		$this->supports = $supports;
	}

	/**
	 * Set breakpoint.
	 *
	 * @param array $breakpoints The breakpoints.
	 *
	 * @return void
	 */
	public function setBreakpoints( array $breakpoints): void {

		$this->breakpoints = $breakpoints;
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

		// by default store base breakpoint.
		$this->breakpoint = $this->breakpoints['base'];

		if (! empty($this->settings['blockeraBlockStates']['value'])) {
			$states = $this->settings['blockeraBlockStates']['value'];

			// Filter pseudo classes to only include states that exist in the block.
			$this->pseudo_classes = array_filter(
                array_keys($states),
                function( string $state):bool{
					return in_array($state, $this->pseudo_classes, true);
				}
            );

			$breakpoints = array_keys(blockera_array_flat(array_column($states, 'breakpoints')));

			// Add force base breakpoint if not exists.
			if (! in_array($this->breakpoint, $breakpoints, true)) {
				array_unshift($breakpoints, $this->breakpoint); 
			} elseif ($this->breakpoint === $breakpoints[ array_key_last($breakpoints) ]) {
				array_unshift($breakpoints, array_pop($breakpoints));
			}
			// Add normal pseudo class if not exists.
			if (! in_array('normal', $this->pseudo_classes, true)) {
				array_unshift($this->pseudo_classes, 'normal');
			} elseif ('normal' !== $this->pseudo_classes[ array_key_last($this->pseudo_classes) ]) {
				array_unshift($this->pseudo_classes, array_pop($this->pseudo_classes));
			}

			$breakpointsCssRules = array_filter(
				array_map([ $this, 'prepareBreakpointStyles' ], $breakpoints),
				'blockera_get_filter_empty_array_item'
			);

			return implode(PHP_EOL, $breakpointsCssRules);
		}

		return $this->prepareBreakpointStyles($this->breakpoint);
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
		$mediaQueries = blockera_get_css_media_queries($this->breakpoints['list']);

		// Validate breakpoint type.
		if ( ! isset( $breakpoint, $mediaQueries[ $breakpoint ] ) ) {

			return '';
		}

		// Set current breakpoint for generating styles process.
		$this->breakpoint = $breakpoint;

		// Get state css rules with breakpoint type.
		$state_css_rules = $this->getStateCssRules();

		// Exclude empty css rules.
		if ( empty( $state_css_rules ) ) {

			return '';
		}

		$styles = implode(
			PHP_EOL,
			array_unique(
				array_filter(
					blockera_array_flat( $state_css_rules ),
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
	 * @return array The css rules for current pseudo class.
	 */
	protected function getStateCssRules(): array {

		// Imagine blockera block states stack is empty.
		if ( empty( $this->settings['blockeraBlockStates']['value'] ) ) {

			// We should just prepare normal state styles because not exists any other states.
			$css_rules = $this->prepareStateStyles( 'normal', $this->breakpoint );

			// Exclude empty $css_rules.
			if ( empty( $css_rules ) ) {

				return [];
			}

			return compact('css_rules');
		}

		// We should process any supported pseudo classes by blockera to prepare each state styles.
		return array_filter(
			array_map(
				function ( string $state ): array {

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

		$inner_blocks_css = array_map(
            function( string $definition): array {
			
				$this->definition = $this->app->make($definition, [ 'supports' => $this->supports ]);

				// the "blockeraInnerBlocks.value" accessible on normal state in base breakpoint and un normal states accessible without value index!
				$settings = $this->getSettings(true);

				if (empty($settings)) {

					return [];
				}

				// Validation: Check if sets blockera inner blocks?
				if ( ! empty( $settings ) ) {

					// Preparing inner blocks css ...
					return blockera_array_flat(
                        array_map(
                            [
								$this,
								'generateInnerBlockCss',
                            ],
                            $settings,
                            array_keys( $settings )
                        )
					);
				}
			},
            $this->definitions
        );

		$block_css = array_merge( $block_css, $inner_blocks_css );

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
	 * @param string $definition The style definition class namespace.
	 *
	 * @return array The array of collection of selector and declaration.
	 */
	protected function generateBlockCss( string $definition ): array {

		$this->definition = $this->app->make(
            $definition,
            [
				'supports' => $this->supports,
			]
        );

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

		$css_rules = $this->definition->getCssRules();

		$is_normal_on_base_breakpoint = blockera_is_normal_on_base_breakpoint($this->pseudo_state, $this->breakpoint);

		if ($is_normal_on_base_breakpoint && ! empty($this->inline_styles)) {

			$definition_selector = $this->definition->getSelector();

			$selector_inline_styles = blockera_find_selector_declarations(preg_replace('/^\w+\./i', '.', $definition_selector), $this->inline_styles);

			if (! empty($selector_inline_styles) && ! empty($definition_selector)) {

				foreach ($selector_inline_styles as $selector => $inline_styles) {
					$prepared_inline_styles = [];

					if (is_int($selector) || ! is_array($inline_styles)) {
						$extracted = explode(':', $inline_styles);

						foreach (array_chunk($extracted, 2) as $inline_style) {

							if (! isset($inline_style[0]) || ! isset($inline_style[1])) {

								continue;
							}

							$prepared_inline_styles[ $inline_style[0] ] = $inline_style[1];
						}

						continue;
					}

					foreach ($inline_styles as $inline_style) {
						$extracted = explode(':', $inline_style);

						if (isset($prepared_inline_styles[ $extracted[0] ])) {

							continue;
						}

						$prepared_inline_styles[ $extracted[0] ] = $extracted[1];
					}

					if (! isset($css_rules[ $selector ]) || ! in_array($prepared_inline_styles, $css_rules[ $selector ], true)) {

						$css_rules[ $selector ] = array_merge($prepared_inline_styles, $css_rules[ $selector ] ?? []);
					}					
				}
			}
		}

		return $css_rules;
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

		$css_rules = $this->definition->getCssRules();

		if ( ! empty( $settings['attributes']['blockeraBlockStates'] ) ) {

			$engine           = $this;
			$innerBlockStates = $settings['attributes']['blockeraBlockStates'];

			$css_rules = array_merge(
				$css_rules,
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

		return $css_rules;
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
	 * Get definition settings.
	 *
	 * @param array $settings the settings.
	 * @param array $supports the supports.
	 *
	 * @return array the definition settings.
	 */
	private function getDefinitionSupportsSettings( array $settings, array $supports):array {

		return array_filter(
			$settings,
			function( $key) use ( $supports) {
				return in_array($key, $supports, true);
			},
			ARRAY_FILTER_USE_KEY
		);
	}

	/**
	 * Get current block state in breakpoint settings.
	 * 
	 * @param bool $from_inner_blocks The flag to specific settings context. if true mean context is inner blocks.
	 *
	 * @return array the block settings.
	 */
	public function getSettings( bool $from_inner_blocks = false): array {

		$supports = $this->definition->getSupports();

		if (empty($supports)) {

			return [];
		}

		if ( $this->inNormalOnBaseBreakpoint( $this->pseudo_state, $this->breakpoint ) ) {

			if ($from_inner_blocks) {

				return 	$this->settings['blockeraInnerBlocks']['value'] ?? [];
			}

			return $this->getDefinitionSupportsSettings( $this->settings, $supports );
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

		$breakpoint_settings = $state['breakpoints'][ $this->breakpoint ];

		// invalid breakpoint founded.
		if ( empty( $breakpoint_settings ) ) {

			return [];
		}

		$prepared_settings = $breakpoint_settings['attributes'] ?? [];

		if ($from_inner_blocks) {

			return $prepared_settings['blockeraInnerBlocks'] ?? $prepared_settings['blockeraInnerBlocks']['value'] ?? [];
		}

		return $this->getDefinitionSupportsSettings( $prepared_settings, $supports );
	}

	/**
	 * Check if current state is normal on base breakpoint.
	 *
	 * @param string $pseudoState the pseudo state.
	 * @param string $breakpoint  the breakpoint.
	 *
	 * @return bool true if current state is normal on base breakpoint.
	 */
	private function inNormalOnBaseBreakpoint( string $pseudoState, string $breakpoint ): bool {

		return 'normal' === $pseudoState && $breakpoint === $this->breakpoints['base'];
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
	}

}
