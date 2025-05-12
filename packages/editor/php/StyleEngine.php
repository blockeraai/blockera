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
					'breakpoints' => array_merge(
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
							return array_map(
                                function ( $breakpointSettings, string $breakpoint) use ( $state): string {
                                    return $this->prepareBreakpointStyles($breakpoint, $breakpointSettings['attributes'], $state);
                                },
                                $stateSettings['breakpoints'],
                                array_keys($stateSettings['breakpoints'])
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
	 * @param string $state The block state. Default is 'normal'.
	 *
	 * @return string The generated css rule for current breakpoint.
	 */
	protected function prepareBreakpointStyles( string $breakpoint, array $settings, string $state = 'normal' ): string {

		// Get css media queries.
		$mediaQueries = blockera_get_css_media_queries($this->breakpoints['list']);

		// Validate breakpoint type.
		if ( ! isset( $breakpoint, $mediaQueries[ $breakpoint ] ) ) {

			return '';
		}

		// Set current breakpoint for generating styles process.
		$this->breakpoint = $breakpoint;

		// We should just prepare normal state styles because not exists any other states.
		$state_css_rules = $this->prepareStateStyles($state, $settings);

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
	 * @param array $supports The related supports with current definition instance.
	 *
	 * @return void
	 */
	protected function setDefinition( array $supports, string $id): void {
		
		try {

			if (! isset($supports[ $id ]['definition'])) {
				
				return;
			}

			$abstract = '\Blockera\Editor\StyleDefinitions\\' . $supports[ $id ]['definition'];

			$this->definition = $this->app->make($abstract, compact('supports'));

		} catch (\Exception $e) {

			// Debug.
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

		$flattenSupports = blockera_array_flat(array_column($this->supports, 'supports'));

		if (empty($flattenSupports) || ! isset($flattenSupports[ $id ])) {
			
			return [];
		}

		$this->setDefinition($flattenSupports, $id);

		if (! $this->definition) {
			
			return [];
		}

		return $this->generateBlockCss(is_string($settings) || ! isset($settings['value']) ? [ 'value' => $settings ] : $settings, $id);
	}

	/**
	 * Preparing css of current state settings.
	 *
	 * @param string $state The state name (as pseudo class in css).
	 * @param array  $settings the breakpoint current state settings.
	 *
	 * @return array The state css rules.
	 */
	protected function prepareStateStyles( string $state, array $settings ): array {

		$this->pseudo_state = $state;

		$block_css = array_map(
            function ( $settings, string $id): array {
				return $this->generateCss($settings, $id);
			},
            $settings,
            array_keys($settings)
        );

		$inner_blocks_css = isset($settings['blockeraInnerBlocks']) ? array_map(
            function( array $settings, string $blockType): array {
				return array_map(
                    function ( $settings, $id) use ( $blockType): array{

						$flattenSupports = blockera_array_flat(array_column($this->supports, 'supports'));

						if (empty($flattenSupports) || ! isset($flattenSupports[ $id ])) {

							return [];
						}

						$this->setDefinition($flattenSupports, $id);

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
        ) : [];

		$block_css = array_merge( array_filter($block_css), array_filter(blockera_array_flat($inner_blocks_css)) );

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
			if (! isset($css_rules[ $selector ])) {
				if (! empty($prepared_styles) && ! $is_wp_block_child_class) {
					$css_rules[ $selector ] = $prepared_styles;
				}
				
				if (! empty($prepared_child_styles)) {
					$css_rules[ array_keys($filtered_child_declarations)[0] ] = $prepared_child_styles;
				}
			} else {

				if (! empty($prepared_styles) && ! $is_wp_block_child_class) {
					$css_rules[ $selector ] = array_merge($css_rules[ $selector ], $prepared_styles);
				}

				if (! empty($prepared_child_styles)) {
					$css_rules[ array_keys($filtered_child_declarations)[0] ] = array_merge($css_rules[ array_keys($filtered_child_declarations)[0] ] ?? [], $prepared_child_styles);
				}
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

		if ( empty( $settings['value'] ) ) {

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

		$css_rules = $this->definition->getCssRules();

		if ( ! empty( $settings['blockeraBlockStates'] ) ) {

			$engine           = $this;
			$innerBlockStates = $settings['blockeraBlockStates'];

			$css_rules = array_merge(
				$css_rules,
				blockera_array_flat(
					array_map(
						static function ( array $settings, string $state ) use ( $engine, $blockType ): array {

							if ( empty( $settings['breakpoints'] ) || ( blockera_is_normal_on_base_breakpoint( $state, $engine->breakpoint ) ) ) {

								return [];
							}

							return blockera_array_flat(
								array_map(
									static function ( array $breakpointSettings, string $id ) use ( $engine, $blockType, $state ): array {

										return $engine->generateInnerBlockCss( $breakpointSettings, $blockType, compact('id', 'state') );
									},
									$settings['breakpoints'],
									array_keys( $settings['breakpoints'] )
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
