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
	 *
	 * @var array $pseudo_classes
	 */
	protected array $pseudo_classes = [];

	/**
	 * Store the flag to determine if the style is a global style.
	 *
	 * @var bool $is_global_style
	 */
	protected bool $is_global_style = false;

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
	 * Store the inline styles.
	 *
	 * @var array $inline_styles
	 */
	protected array $inline_styles = [];


	/**
	 * Store fallback css selector.
	 *
	 * @var string $selector The css selector for target element.
	 */
	protected string $selector = '';

	/**
	 * Store the flag to determine if the style is a style variation.
	 *
	 * @var boolean $is_style_variation the flag to indicate current style is variation style or not!
	 */
	protected bool $is_style_variation = false;

	/**
	 * Store the definitions instances stack.
	 *
	 * @var array $definitions
	 */
	protected array $definitions = [];

	/**
	 * Store instance of current style definition class.
	 *
	 * @var BaseStyleDefinition|null $definition
	 */
	protected $definition;

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
	 * Store the supports.
	 *
	 * @var array $supports
	 */
	protected array $supports = [];

	/**
	 * Store the processed supports.
	 *
	 * @var array $processed_supports
	 */
	protected static array $processed_supports = [];

	/**
	 * Store the cleanup declarations map for properties.
	 * 
	 * This map is used to clean up properties were collected from inline styles.
	 * For example, if the border property is set, the border-width, border-style, and border-color properties should be removed.
	 *
	 * @var array $properties_clean_map
	 */
	protected static array $properties_clean_map = [
		'border' => [
			'border-width', 
			'border-style', 
			'border-color', 
		],
		'border-bottom' => [ 
			'border-bottom-width', 
			'border-bottom-style', 
			'border-bottom-color', 
		],
		'border-top' => [
			'border-top-width', 
			'border-top-style', 
			'border-top-color', 
		],
		'border-left' => [ 
			'border-left-width', 
			'border-left-style', 
			'border-left-color', 
		],
		'border-right' => [
			'border-right-width', 
			'border-right-style', 
			'border-right-color',
		],
		// Blockera uses background-image but WP uses the background property.
		// we need to remove it to prevent future issues and duplicate declarations.
		'background-image' => [
			'background',
		],
	];

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
	 * @param bool   $isGlobalStyle    The flag to determine if the style is a global style. Default is `false`.
	 */
	public function __construct( array $block, string $fallbackSelector, bool $isGlobalStyle = false ) {

		[
			'attrs' => $settings,
		] = $block;

		$this->block           = $block;
		$this->settings        = $settings;
		$this->selector        = $fallbackSelector;
		$this->is_global_style = $isGlobalStyle;
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

		foreach ($supports as $data) {
			foreach ($data['supports'] as $key => $support) {
				$this->supports[ $key ]         = $support;
				$this->supports[ $key ]['type'] = $data['type'] ?? 'single';
			}
		}
	}

	/**
	 * Set the flag to determine if the style is a style variation.
	 *
	 * @param boolean $is_style_variation the flag to indicate current style is variation style or not.
	 *
	 * @return void
	 */
	public function setIsStyleVariation( bool $is_style_variation): void {

		$this->is_style_variation = $is_style_variation;
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
	 * Set breakpoint.
	 *
	 * @param string $breakpoint The breakpoint.
	 *
	 * @return void
	 */
	public function setBreakpoint( string $breakpoint): void {
	
		$this->breakpoint = $breakpoint;
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

		if (! empty($this->settings['blockeraBlockStates']['value'])) {
			$states = $this->settings['blockeraBlockStates']['value'];

			// prepare all breakpoints.
			$breakpoints = array_keys(blockera_array_flat(array_column($states, 'breakpoints')));

			// Add force base breakpoint if not exists.
			if (! in_array($this->breakpoint, $breakpoints, true)) {
				array_unshift($breakpoints, $this->breakpoint); 
			} elseif ($this->breakpoint === $breakpoints[ array_key_last($breakpoints) ]) {
				array_unshift($breakpoints, array_pop($breakpoints));
			}

			$settings = array_filter(
                $this->settings,
                function ( string $id): bool {
					return str_starts_with($id, 'blockera') && ! in_array($id, [ 'blockeraBlockStates', 'blockeraPropsId', 'blockeraCompatId' ], true);
				},
                ARRAY_FILTER_USE_KEY
            );

			// Add normal pseudo class if not exists.
			if (! array_key_exists('normal', $states)) {

				$this->pseudo_classes['normal'] = [
					'breakpoints' => [
						'desktop' => [
							'attributes' => $settings,
						],
					],
					'isVisible' => true,
				];

			} elseif (! empty($settings)) {

				$this->pseudo_classes['normal'] = [
					'breakpoints' => blockera_get_array_deep_merge(
						[
							'desktop' => [
								'attributes' => $settings,
							],
						],
						$this->settings['blockeraBlockStates']['value']['normal']['breakpoints'],
					),
					'isVisible' => true,
				];
			}

			// prepare all block states.
			$this->pseudo_classes = blockera_get_array_deep_merge($this->pseudo_classes, $states);

			$breakpointsCssRules = blockera_array_flat(
				array_filter(
					array_map(
                        function( array $stateSettings, string $state): array {
							$this->pseudo_state = $state;

							if (empty($stateSettings['breakpoints']) && ! empty($stateSettings['content'])) {
								return [
									$this->prepareBreakpointStyles(
                                        $this->breakpoint,
                                        [
											'blockeraContentPseudoElement' => '"' . $stateSettings['content'] . '"',
										]
                                    ),
								];
							}

							$breakpoints = $this->prepareBreakpointsSettings($stateSettings['breakpoints']);

							return array_map(
                                function ( $breakpointSettings, string $breakpoint) use ( $stateSettings): string  {
									if (isset($stateSettings['content'])) {
										$breakpointSettings['attributes']['blockeraContentPseudoElement'] = '"' . $stateSettings['content'] . '"';
									}

                                    return $this->prepareBreakpointStyles($breakpoint, $breakpointSettings['attributes']);
                                },
                                $breakpoints,
                                array_keys($breakpoints)
							);
						},
                        $this->pseudo_classes,
                        array_keys($this->pseudo_classes)
                    ),
					'blockera_get_filter_empty_array_item'
				)
			);

			return implode(PHP_EOL, $breakpointsCssRules);
		}

		$settings = $this->settings;

		unset($settings['blockeraBlockStates'], $settings['blockeraPropsId'], $settings['blockeraCompatId']);

		return $this->prepareBreakpointStyles($this->breakpoint, $settings);
	}

	/**
	 * Prepare breakpoints settings.
	 *
	 * @param array $breakpoints The breakpoints settings.
	 *
	 * @return array The prepared breakpoints settings.
	 */
	protected function prepareBreakpointsSettings( array $breakpoints ): array {

		if (empty($breakpoints)) {

			return [];
		}

		$available_breakpoints = array_intersect(array_keys($this->breakpoints), array_keys($breakpoints));

		return array_filter(
			blockera_get_array_deep_merge($this->breakpoints, $breakpoints),
			function ( $breakpoint) use ( $available_breakpoints): bool {
				return in_array($breakpoint['type'], $available_breakpoints, true);
			}
		);
	}

	/**
	 * Preparing css of breakpoint settings.
	 *
	 * @param string $breakpoint The breakpoint type.
	 * @param array  $settings The current breakpoint settings.
	 *
	 * @return string The generated css rule for current breakpoint.
	 */
	protected function prepareBreakpointStyles( string $breakpoint, array $settings ): string {

		// Get css media queries.
		$mediaQueries = blockera_get_css_media_queries($this->breakpoints);

		// Validate breakpoint type.
		if ( ! isset( $breakpoint, $mediaQueries[ $breakpoint ] ) ) {

			return '';
		}

		// Set current breakpoint for generating styles process.
		$this->breakpoint = $breakpoint;

		// We should just prepare normal state styles because not exists any other states.
		$state_css_rules = $this->prepareStateStyles($settings);

		// Exclude empty css rules.
		if ( empty( $state_css_rules ) ) {

			return '';
		}

		$styles = implode(
			PHP_EOL,
			array_unique(
				array_filter(
					is_array(current($state_css_rules)) ? blockera_array_flat($state_css_rules) : $state_css_rules,
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
	 * Get css rules generated by current definition instance.
	 *
	 * @param string $id The related supports with current definition instance.
	 *
	 * @return void
	 */
	protected function setDefinition( string $id, $flag = false): void {
		// Early returns for invalid conditions.
		if (empty($this->supports) || ! isset($this->supports[ $id ], $this->supports[ $id ]['definition'])) {

			$items = ! empty(static::$processed_supports) ? static::$processed_supports : $this->supports;
			$ids   = array_column($items, 'id');
			$index = array_search($id, $ids, true);

			if (! $index) {
				$this->definition           = null;
				static::$processed_supports = [];

				return;
			}

			$id = $ids[ $index ];

			try {
				// Prepare all items while definition index equals with $id.
				foreach ($items as $key => $support) {
					if (isset($support['id']) && $support['id'] === $id) {
						// Attempt to create new instance.
						$this->definition = $this->app->make($support['definition'], [ 'supports' => $this->supports ]);
						$this->definition->setSupportType($support['type'] ?? 'single');
						$this->definition->setId($key);
	
						return;
					}
				}
			} catch (\Exception $e) {
				return;
			}
		}

		// Get definition class name.
		$definition = $this->supports[ $id ]['definition'];

		// Attempt to create new instance.
		try {
			$this->definition = $this->app->make($definition, [ 'supports' => $this->supports ]);
			$this->definition->setId($id);
		} catch (\Exception $e) {
			return;
		}
	}

	/**
	 * Generating css based on block settings.
	 *
	 * @param array  $settings The settings item.
	 * @param string $id The settings identifier.
	 * 
	 * @return array generated css rules for current block settings.
	 */
	protected function generateCss( $settings, string $id ):array {

		if ('blockeraInnerBlocks' === $id) {

			return [];
		}

		$this->setDefinition($id);

		if (! $this->definition) {
			
			return [];
		}

		return $this->generateBlockCss(is_string($settings) || ! isset($settings['value']) ? [ 'value' => $settings ] : $settings, $id);
	}

	/**
	 * Preparing css of current state settings.
	 *
	 * @param array $settings the breakpoint current state settings.
	 *
	 * @return array The state css rules.
	 */
	protected function prepareStateStyles( array $settings ): array {

		$block_css = array_filter(
			array_map(
				function ( $settings, string $id): array {
					return $this->generateCss($settings, $id);
				},
				$settings,
				array_keys($settings)
			)
		);

		if (isset($settings['blockeraInnerBlocks'])) {
			
			$inner_blocks_css = array_map(
				function ( array $settings, string $blockType): array {
					return array_map(
						function ( $settings, $id) use ( $blockType): array {

							if ('blockeraBlockStates' === $id && ! empty($settings)) {

								return blockera_array_flat(
									array_map(
										function ( array $settings, string $state) use ( $blockType): array {

											if (empty($settings['breakpoints']) && ! empty($settings['content'])) {
												$id = 'blockeraContentPseudoElement';

												$this->setDefinition($id);

												if (! $this->definition) {

													return [];
												}

												return $this->generateInnerBlockCss(
													[
														'value' => '"' . $settings['content'] . '"',
													],
													$blockType,
													compact('id', 'state')
												);
											}

											if (empty($settings['breakpoints']) || blockera_is_normal_on_base_breakpoint($state, $this->breakpoint)) {

												return [];
											}

											return blockera_array_flat(
												array_map(
													function ( array $breakpointSettings) use ( $blockType, $state, $settings): array {
														return blockera_array_flat(
															array_map(
																function ( $_settings, string $id) use ( $blockType, $state, $settings): array {

																	$this->setDefinition($id);

																	if (! $this->definition) {

																		return [];
																	}

																	$css_rules = $this->generateInnerBlockCss(is_string($_settings) ? [ 'value' => $_settings ] : $_settings, $blockType, compact('id', 'state'));

																	if (isset($settings['content'])) {
																		$id = 'blockeraContentPseudoElement';

																		$this->setDefinition($id);

																		if (! $this->definition) {

																			return [];
																		}

																		$css_rules = blockera_get_array_deep_merge(
																			$css_rules,
																			$this->generateInnerBlockCss(
																				[
																					'value' => '"' . $settings['content'] . '"',
																				],
																				$blockType,
																				compact('id', 'state')
																			)
																		);
																	}

																	return $css_rules;
																},
																$breakpointSettings['attributes'] ?? [],
																array_keys($breakpointSettings['attributes'] ?? [])
															)
														);
													},
													$settings['breakpoints'],
												)
											);
										},
										$settings,
										array_keys($settings)
									)
								);
							}

							$this->setDefinition($id, true);

							if (! $this->definition) {

								return [];
							}

							return $this->generateInnerBlockCss(is_string($settings) ? [ 'value' => $settings ] : $settings, $blockType, compact('id'));
						},
						$settings['attributes'] ?? [],
						array_keys($settings['attributes'] ?? [])
					);
				},
				$settings['blockeraInnerBlocks']['value'] ?? $settings['blockeraInnerBlocks'] ?? [],
				array_keys($settings['blockeraInnerBlocks']['value'] ?? $settings['blockeraInnerBlocks'] ?? [])
			);

			$block_css = array_merge( $block_css, array_filter(blockera_array_flat($inner_blocks_css)) );
		}

		$block_css = blockera_combine_css($block_css);

		if (blockera_is_normal_on_base_breakpoint($this->pseudo_state, $this->breakpoint) && ! empty($this->inline_styles)) {
			$selectors           = blockera_get_block_type_property($this->block['blockName'], 'selectors');
			$block_root_selector = blockera_get_compatible_block_css_selector(
				$selectors,
				'root',
				[
					'fallback'                 => 'root',
					'block-type'               => 'master',
					'inner-pseudo-class'       => 'normal',
					'blockera-unique-selector' => $this->selector,
					'breakpoint'               => $this->breakpoint,
					'pseudo-class'             => $this->pseudo_state,
					'block-settings'           => $this->block['attrs'],
					'block-name'               => $this->block['blockName'],
					'root'                     => $selectors['root'] ?? null,
				]
			);

			$block_css = $this->mergeInlineStyles($block_css, $block_root_selector);
		}

		return $this->normalizeCssRules(blockera_convert_css_declarations_to_css_valid_rules($block_css));
	}

	/**
	 * Generating current block css styles.
	 * 
	 * @param array  $settings the settings to generate css.
	 * @param string $id the settings id.
	 * @param array  $previous_css_rules the previous css rules. It's has value while calling this method recursively.
	 *
	 * @return array The array of collection of selector and declaration.
	 */
	protected function generateBlockCss( array $settings, string $id, array $previous_css_rules = []): array {

		if ( empty( $settings['value'] ) || empty($id) ) {

			return [];
		}

		$this->definition->setStyleId($id);
		$this->definition->resetProperties();
		$this->configureDefinition( $this->definition );
		$this->definition->setSettings( $settings );
		$this->definition->setBreakpoint( $this->breakpoint );
		$this->definition->setBlockType( 'master' );
		$this->definition->setPseudoState( $this->pseudo_state );
		$this->definition->setIsGlobalStyle( $this->is_global_style );
		$this->definition->setIsStyleVariation( $this->is_style_variation );
		$this->definition->setBlockeraUniqueSelector( $this->selector );

		if (empty($previous_css_rules)) {
			$css_rules = $this->definition->getCssRules();
		} else {
			$css_rules = blockera_get_array_deep_merge($previous_css_rules, $this->definition->getCssRules());
		}

		// This is a multiple support definition.
		// So we need to generate the css rules for the next support.
		if ('multiple' === $this->definition->getSupportType()) {
			// Get the supports stack to filter out the current support.
			$supports = ! empty(static::$processed_supports) ? static::$processed_supports : $this->supports;

			// Filter out the current support from the supports stack.
			// Filter out the previous processed supports.
			static::$processed_supports = array_filter(
                $supports,
                function( $support) {
					return $this->definition->getId() !== $support;
				},
                ARRAY_FILTER_USE_KEY
            );

			$this->definition = null;

			// Set the next support definition.
			$this->setDefinition($id);

			// Generate the css rules for the next support.
			if ($this->definition) {
				$css_rules = $this->generateBlockCss($settings, $id, $css_rules);
			}
		}
		
		// Reset definition property.
		$this->definition = null;

		return $css_rules;
	}

	/**
	 * Preparing css styles of inner blocks for current received state.
	 *
	 * @param array  $settings the inner block settings of current received state.
	 * @param string $blockType the block type of available inner block.
	 * @param array  $args includes the pseudo state of inner block type, and settings id.
	 *
	 * @throws BaseException Exception for invalid selector.
	 *
	 * @return array the generated css rules for inner blocks in current state.
	 */
	protected function generateInnerBlockCss( array $settings, string $blockType, array $args = [] ): array {

		if ( empty( $settings ) ) {

			return [];
		}

		$this->definition->resetProperties();
		$this->configureDefinition( $this->definition );
		$this->definition->setStyleId($args['id']);
		$this->definition->setBlockType( $blockType );
		$this->definition->setBreakpoint( $this->breakpoint );
		$this->definition->setIsGlobalStyle( $this->is_global_style );
		$this->definition->setInnerPseudoState( $args['state'] ?? '' );
		$this->definition->setPseudoState( $this->pseudo_state );
		$this->definition->setSettings( $settings );
		$this->definition->setNoChecks( true );
		$this->definition->setIsStyleVariation( $this->is_style_variation );
		$this->definition->setBlockeraUniqueSelector( $this->selector );

		$css_rules = $this->definition->getCssRules();

		// This is a multiple support definition.
		// So we need to generate the css rules for the next support.
		if ('multiple' === $this->definition->getSupportType()) {
			// Get the supports stack to filter out the current support.
			$supports = ! empty(static::$processed_supports) ? static::$processed_supports : $this->supports;

			// Filter out the current support from the supports stack.
			// Filter out the previous processed supports.
			static::$processed_supports = array_filter(
                $supports,
                function( $support) {
					return $this->definition->getId() !== $support;
				},
                ARRAY_FILTER_USE_KEY
            );

			$this->definition = null;

			// Set the next support definition.
			$this->setDefinition($args['id']);

			// Generate the css rules for the next support.
			if ($this->definition) {
				// Merge the css rules with the generated css rules for the next support.
				$css_rules = blockera_get_array_deep_merge($css_rules, $this->generateInnerBlockCss($settings, $blockType, $args));
			}
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

	/**
	 * Merge inline styles with generated CSS rules, avoiding duplicates.
	 * 
	 * @param array  $css_rules The existing CSS rules.
	 * @param string $definition_selector The current definition's selector.
	 * 
	 * @return array The merged CSS rules.
	 */
	protected function mergeInlineStyles( array $css_rules, string $definition_selector): array {
		// Early return if no definition selector.
		if (empty($definition_selector)) {
			return $css_rules;
		}

		$base_selector = preg_replace('/^\w+\./i', '.', $definition_selector);

		foreach ($this->inline_styles as $selector => $declarations) {
			// If selector matches the base selector pattern, include it.
			// If $selector is root selector, it should not contains space and ends with base selector.
			if (str_contains($selector, ' ') || ! str_contains($base_selector, $selector)) {
				continue;
			}

			// Skip if declarations are empty.
			if (empty($declarations)) {
				continue;
			}

			if (! isset($css_rules[ $definition_selector ])) {
				// Set css rule for definition selector as a root collected inline styles.
				$css_rules[ $definition_selector ] = $declarations;
			} else {
				// Cache reference to avoid repeated array access in loop to improve performance.
				$existing_rules = &$css_rules[ $definition_selector ];

				// Clean up individual properties when shorthand exists.
				// Build removal array first, then remove all at once for better performance.
				$properties_to_remove = [];
				foreach (self::$properties_clean_map as $cleanProperty => $properties) {
					if ( isset($existing_rules[ $cleanProperty ]) ) {
						array_push($properties_to_remove, ...$properties);
					}
				}

				if ( ! empty($properties_to_remove) ) {
					// array_diff_key() with array_flip() removes all properties in one native PHP operation (C-level), which is faster than multiple unset() calls.
					$declarations = array_diff_key($declarations, array_flip($properties_to_remove));
				}

				// Merge same declaration with the style engine generated declarations.
				$css_rules[ $definition_selector ] = array_merge($declarations, $existing_rules);
			}
		}

		return $css_rules;
	}
}
