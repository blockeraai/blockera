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
	protected array $pseudo_classes = [
		'hover',
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
	 */
	public function __construct( array $block, string $fallbackSelector ) {

		[
			'attrs' => $settings,
		] = $block;

		$this->block    = $block;
		$this->settings = $settings;
		$this->selector = $fallbackSelector;
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

		$this->supports = blockera_array_flat(array_column($supports, 'supports'));
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

			// Filter pseudo classes to only include states that exist in the block.
			$this->pseudo_classes = array_filter(
                $states,
                function( string $state):bool {
					return 'normal' === $state || in_array($state, $this->pseudo_classes, true);
				},
				ARRAY_FILTER_USE_KEY
            );

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
			if (! array_key_exists('normal', $this->pseudo_classes)) {

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

			$breakpointsCssRules = blockera_array_flat(
				array_filter(
					array_map(
                        function( array $stateSettings, string $state): array {
							$this->pseudo_state = $state;
							$breakpoints        = blockera_get_array_deep_merge($this->breakpoints, $stateSettings['breakpoints']);

							return array_map(
                                function ( $breakpointSettings, string $breakpoint): string {
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
	protected function setDefinition( string $id): void {
		
		// Early returns for invalid conditions.
		if (empty($this->supports) ||
			! isset($this->supports[ $id ], $this->supports[ $id ]['definition'])) {
			return;
		}

		// Get definition class name.
		$definition = $this->supports[ $id ]['definition'];

		// Attempt to create new instance.
		try {
			$this->definition = $this->app->make($definition, [ 'supports' => $this->supports ]);
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

							$this->setDefinition($id);

							if (! $this->definition) {

								return [];
							}

							return $this->generateInnerBlockCss(is_string($settings) ? [ 'value' => $settings ] : $settings, $blockType, compact('id'));

						},
						$settings['attributes'] ?? [],
						array_keys($settings['attributes'] ?? [])
					);
				},
				blockera_is_normal_on_base_breakpoint($this->pseudo_state, $this->breakpoint) ? $settings['blockeraInnerBlocks']['value'] ?? [] : $settings['blockeraInnerBlocks'] ?? [],
				array_keys(blockera_is_normal_on_base_breakpoint($this->pseudo_state, $this->breakpoint) ? $settings['blockeraInnerBlocks']['value'] ?? [] : $settings['blockeraInnerBlocks'] ?? [])
			);

			$block_css = array_merge( $block_css, array_filter(blockera_array_flat($inner_blocks_css)) );
		}

		return $this->normalizeCssRules(blockera_convert_css_declarations_to_css_valid_rules(blockera_combine_css($block_css)));
	}

	/**
	 * Generating current block css styles.
	 * 
	 * @param array  $settings the settings to generate css.
	 * @param string $id the settings id.
	 *
	 * @return array The array of collection of selector and declaration.
	 */
	protected function generateBlockCss( array $settings, string $id): array {

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
		$this->definition->setBlockeraUniqueSelector( $this->selector );

		$css_rules = $this->definition->getCssRules();

		// Only process inline styles for normal state on base breakpoint.
		if (blockera_is_normal_on_base_breakpoint($this->pseudo_state, $this->breakpoint) && ! empty($this->inline_styles)) {
			$css_rules = $this->mergeInlineStyles($css_rules);
		}

		// Reset definition property.
		$this->definition = null;

		return $css_rules;
	}

	/**
	 * Merge inline styles with generated CSS rules, avoiding duplicates.
	 * 
	 * @param array $css_rules The existing CSS rules.
	 * @return array The merged CSS rules.
	 */
	protected function mergeInlineStyles( array $css_rules): array {
		$definition_selector = $this->definition->getSelector();

		// Early return if no definition selector.
		if (empty($definition_selector)) {
			return $css_rules;
		}

		// Get all inline styles that match the current definition's selector pattern.
		$matching_styles = $this->getMatchingInlineStyles($definition_selector);

		foreach ($matching_styles as $selector => $declarations) {
			// Skip if declarations are empty.
			if (empty($declarations)) {
				continue;
			}
			
			$filtered_declarations       = array_filter(
                $declarations,
                function( $declaration):bool {
					return ! empty($declaration) && ! is_array($declaration);
				}
            );
			$filtered_child_declarations = array_diff_key($declarations, $filtered_declarations);

			// Convert declarations to property-value pairs.
			$prepared_styles       = $this->prepareInlineStyles($filtered_declarations);
			$prepared_child_styles = $this->prepareInlineStyles(blockera_array_flat($filtered_child_declarations));

			$is_wp_block_child_class = blockera_is_wp_block_child_class($this->definition->getSelector());

			// Merge with existing rules, avoiding duplicates.
			if (isset($css_rules[ $selector ]) && ! empty($prepared_styles) && ! $is_wp_block_child_class) {				
				$css_rules[ $selector ] = array_merge($css_rules[ $selector ], $prepared_styles);
			}

			if (! empty($prepared_child_styles)) {
				$css_rules[ array_keys($filtered_child_declarations)[0] ] = array_merge($css_rules[ array_keys($filtered_child_declarations)[0] ] ?? [], $prepared_child_styles);
			}
		}

		return $css_rules;
	}

	/**
	 * Get inline styles that match the current definition's selector.
	 * 
	 * @param string $definition_selector The current definition's selector.
	 * @return array Matching inline styles.
	 */
	protected function getMatchingInlineStyles( string $definition_selector): array {
		$matching_styles = [];
		$base_selector   = preg_replace('/^\w+\./i', '.', $definition_selector);

		foreach ($this->inline_styles as $selector => $declarations) {
			// If selector matches the base selector pattern, include it.
			if (false !== strpos($selector, $base_selector) || false !== strpos($base_selector, $selector)) {
				$matching_styles[ $selector ] = $declarations;
			}
		}

		return $matching_styles;
	}

	/**
	 * Convert inline style declarations to property-value pairs.
	 * 
	 * @param array|string $declarations The style declarations.
	 * @return array The prepared styles.
	 */
	protected function prepareInlineStyles( $declarations): array {
		$prepared_styles = [];

		// Handle string declarations.
		if (is_string($declarations)) {
			$parts = explode(':', $declarations);
			if (count($parts) === 2) {
				$prepared_styles[ trim($parts[0]) ] = trim($parts[1]);
			}
			return $prepared_styles;
		}

		// Handle array declarations.
		foreach ($declarations as $declaration) {
			if (is_string($declaration)) {
				$parts = explode(':', $declaration);
				if (count($parts) === 2) {
					$prepared_styles[ trim($parts[0]) ] = trim($parts[1]);
				}
			}
		}

		return $prepared_styles;
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
		$this->definition->setInnerPseudoState( $args['state'] ?? '' );
		$this->definition->setPseudoState( $this->pseudo_state );
		$this->definition->setSettings( $settings );
		$this->definition->setBlockeraUniqueSelector( $this->selector );

		return $this->definition->getCssRules();
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

}
