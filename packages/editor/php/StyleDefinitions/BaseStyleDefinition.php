<?php

namespace Blockera\Editor\StyleDefinitions;

use Blockera\Utils\Utils;
use Blockera\Editor\StyleDefinitions\Contracts\CustomStyle;

abstract class BaseStyleDefinition {

	/**
	 * Store the block details includes all settings.
	 *
	 * @var array $block The block details.
	 */
	protected array $block = [];

	/**
	 * Hold style definition settings for specific state and breakpoint.
	 *
	 * @var array $settings The specific state and breakpoint settings.
	 */
	protected array $settings = [];

	/**
	 * Store configuration for style definitions.
	 *
	 * @var array $config The style engine config.
	 */
	protected array $config = [];

	/**
	 * Hold style definition default settings from consumer request.
	 *
	 * @var array
	 */
	protected array $default_settings = [];

	/**
	 * Hold collection of properties of current style definition.
	 *
	 * @var array
	 */
	protected array $declarations = [];

	/**
	 * Store all css selectors.
	 *
	 * @var array
	 */
	protected array $selectors = [];

	/**
	 * Store css selector.
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
	 * Hold collection of options to generate style
	 *
	 * @var array
	 */
	protected array $options = [
		'is-important' => true,
	];

	/**
	 * Store available pseudo state on blockera style engine.
	 *
	 * @var string $pseudo_state the pseudo state value.
	 */
	protected string $pseudo_state = 'normal';

	/**
	 * Store available pseudo state on blockera style engine for inner block.
	 *
	 * @var string $inner_pseudo_state the pseudo state value.
	 */
	protected string $inner_pseudo_state = 'normal';

	/**
	 * Store the block type.
	 *
	 * @var string $block_type the block type.
	 */
	protected string $block_type = '';

	/**
	 * Store blockera unique css selector.
	 *
	 * @var string $blockera_unique_selector the generated unique css selector for blockera block.
	 */
	protected string $blockera_unique_selector = '';

	/**
	 * Store the current feature identifier being processed.
	 * This is used to track which block support feature (like layout, typography, etc.)
	 * is currently being processed during style generation.
	 *
	 * @var string
	 */
	protected string $current_feature_id;

	/**
	 * Store inline styles.
	 *
	 * @var array
	 */
	protected array $inline_styles = [];

	/**
	 * Store the current breakpoint.
	 *
	 * @var string $breakpoint the current breakpoint.
	 */
	protected string $breakpoint;

	/**
	 * Store the supports.
	 *
	 * @var array $supports the supports.
	 */
	protected array $support = [];

	public function __construct( array $supports) {

		$this->support = $supports[ Utils::kebabCase($this->getId()) ];
	}

	/**
	 * Set the current breakpoint.
	 *
	 * @param string $breakpoint the current breakpoint.
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
	 * Get inline styles.
	 *
	 * @return array
	 */
	public function getInlineStyles(): array {

		return $this->inline_styles;
	}

	/**
	 * @param array $options the options to generate css properties.
	 *
	 * @return void
	 */
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
	 * @param string $support The feature identifier.
	 */
	public function setSelector( string $support ): void {

		if (empty($support)) {
			$this->selector = $support;

			return;
		}

		$fallback  = $this->getFallbackSupport( $support );
		$selectors = blockera_get_block_type_property( $this->block['blockName'], 'selectors' );

		$this->selector = blockera_get_compatible_block_css_selector(
			$selectors,
			$support,
			[
				'fallback'                 => $fallback,
				'block-type'               => $this->block_type,
				'pseudo-class'             => $this->pseudo_state,
				'block-settings'           => $this->block['attrs'],
				'block-name'               => $this->block['blockName'],
				'inner-pseudo-class'       => $this->inner_pseudo_state,
				'root'                     => $selectors['root'] ?? null,
				'blockera-unique-selector' => $this->blockera_unique_selector,
			]
		);
	}

	/**
	 * Sets configuration.
	 *
	 * @param array $config The style recieved definition config.
	 *
	 * @return void
	 */
	public function setConfig( array $config ): void {

		$this->config = $config;
	}

	/**
	 * Sets default settings.
	 *
	 * @param array $default_settings The default settings.
	 *
	 * @return void
	 */
	public function setDefaultSettings( array $default_settings ): void {

		$this->default_settings = $default_settings;
	}

	/**
	 * Sets block name property.
	 *
	 * @param array $block The block details.
	 *
	 * @return void
	 */
	public function setBlock( array $block ): void {

		$this->block = $block;
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
	 * @param string $pseudo_state the available pseudo state on blockera style engine.
	 *
	 * @return void
	 */
	public function setPseudoState( string $pseudo_state ): void {

		$this->pseudo_state = $pseudo_state;
	}

	/**
	 * @param string $block_type the block type.
	 *
	 * @return void
	 */
	public function setBlockType( string $block_type ): void {

		$this->block_type = $block_type;
	}

	/**
	 * @param string $blockera_unique_selector The generated blockera unique css selector.
	 *
	 * @return void
	 */
	public function setBlockeraUniqueSelector( string $blockera_unique_selector ): void {

		$this->blockera_unique_selector = $blockera_unique_selector;
	}

	/**
	 * @param string $inner_pseudo_state the inner block pseudo state.
	 *
	 * @return void
	 */
	public function setInnerPseudoState( string $inner_pseudo_state ): void {

		$this->inner_pseudo_state = $inner_pseudo_state;
	}

	/**
	 * Filter blockera settings.
	 *
	 * @param string $name the blockera attribute name.
	 *
	 * @return bool true on success, false on otherwise.
	 */
	protected function filterSettings( string $name ): bool {

		return str_starts_with( $name, 'blockera' ) && ! in_array( $name, [ 'blockeraPropsId', 'blockeraCompatId' ], true );
	}

	/**
	 * @return array
	 */
	public function getCssRules(): array {

		$settings = array_filter( $this->settings, [ $this, 'filterSettings' ], ARRAY_FILTER_USE_KEY );

		array_map( [ $this, 'generateCssRules' ], $settings, array_keys( $settings ) );

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

		if ( isset( $value['value'] ) && 1 === count($value) ) {

			$value = $value['value'];
		}

		$cssProperty = $this->getSupportCssProperty( $name );

		// Skip if no CSS property is defined.
		if ( ! $cssProperty) {
			
			return;
		}

		// Skip processing mask and divider properties if they are not enabled in experimental features.
		if ( in_array($cssProperty, [ 'divider', 'mask' ], true) && ! blockera_get_experimental([ 'editor', 'extensions', 'effectsExtension', $cssProperty ])) {

			return;
		}

		// Skip processing for properties with default value.
		if ( isset($this->default_settings[ $name ]['default']['value']) && $value === $this->default_settings[ $name ]['default']['value'] ) {

			return;
		}

		if ( $this instanceof CustomStyle ) {

			$settings = $this->getCustomSettings( $this->settings, $name, $cssProperty );

		} else {

			$settings = [
				[
					'isVisible'  => true,
					'type'       => $cssProperty,
					$cssProperty => $value,
				],
			];
		}

		array_map(
			function ( array $setting ) use ( $name ): void {

				if ( ! $this->support[ $name ] ) {

					return;
				}

				$this->setCurrentFeatureId($name);
				$this->css( $setting );
			},
			$settings
		);
	}

	/**
	 * Sets the current feature identifier.
	 * This is used to track which feature is currently being processed.
	 *
	 * @param string $id
	 * @return void
	 */
	protected function setCurrentFeatureId( string $id):void{
		
		$this->current_feature_id = $id;
	}

	/**
	 * Get current feature id to track that.
	 *
	 * @return string the current feature identifier.
	 */
	protected function getCurrentFeatureId():string {

		return $this->current_feature_id;
	}

	/**
	 * Get the abstraction id.
	 *
	 * @return string the abstract instance id.
	 */
	public function getId(): string {

		return str_replace( [ __NAMESPACE__, '\\' ], '', get_class( $this ) );
	}

	/**
	 * Sets css declaration into current selector.
	 *
	 * @param array  $declaration the generated css declarations array.
	 * @param string $customSupportId the customized support identifier.
	 * @param string $selectorSuffix the css selector suffix.
	 */
	public function setCss( array $declaration, string $customSupportId = '', string $selectorSuffix = '' ): void {

		if (empty($declaration)) {
			return;
		}

		if ( $this->isImportant() ) {

			$declaration = array_map(
				function ( string $declaration_item ): string {

					return $declaration_item . $this->getImportant();
				},
				array_filter($declaration, 'is_string')
			);
		}

		if (! empty($selectorSuffix) && ! empty($customSupportId)) {

			$this->setSelector($customSupportId);
			$this->selector = blockera_append_css_selector_suffix($this->selector, $selectorSuffix);

		} else {

			$this->setSelector($this->getCurrentFeatureId());
		}

		if ( isset( $this->css[ $this->getSelector() ] ) ) {

			$this->css[ $this->getSelector() ] = array_merge( $this->css[ $this->getSelector() ], $declaration );

			return;
		}

		$is_normal_on_base_breakpoint = blockera_is_normal_on_base_breakpoint($this->pseudo_state, $this->breakpoint);

		if ($is_normal_on_base_breakpoint) {

			$selector_inline_styles = blockera_find_selector_declarations($this->getSelector(), $this->inline_styles);

			if (! empty($selector_inline_styles)) {

				$prepared_inline_styles = [];

				foreach ($selector_inline_styles as $selector => $inline_styles) {
					if (is_int($selector) || ! is_array($inline_styles)) {
						$prepared_inline_styles[] = $inline_styles;

						continue;
					}

					$this->css[ $selector ] = array_merge($declaration, $inline_styles);
				}

				$this->css[ $this->getSelector() ] = array_merge($declaration, $prepared_inline_styles);

				// Unset prepared inline styles to free memory.
				unset($prepared_inline_styles);
			} else {
				$this->css[ $this->getSelector() ] = $declaration;
			}		
		} else {

			$this->css[ $this->getSelector() ] = $declaration;
		}

		// Reset selector.
		$this->setSelector('');
	}

	/**
	 * Check is important style property value?
	 *
	 * @return bool true on success, false when otherwise.
	 */
	protected function isImportant(): bool {

		return $this->options['is-important'] && ! blockera_get_admin_options( [ 'earlyAccessLab', 'optimizeStyleGeneration' ] );
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
	 * Get blockera support standard css property name.
	 *
	 * @param string $support the blockera block support name.
	 *
	 * @return string the standard css property name.
	 */
	public function getSupportCssProperty( string $support ): ?string {

		return blockera_get_block_support( $this->getId(), $support, 'css-property' );
	}

	/**
	 * Get blockera supports.
	 *
	 * @return array the supports stack.
	 */
	public function getSupports(): array {

		return array_keys(blockera_get_block_supports_by_category( $this->getId() ));
	}

	/**
	 * @return array the css declarations.
	 */
	public function getDeclarations(): array {

		return $this->declarations;
	}

	/**
	 * Collect all css selectors and declarations.
	 *
	 * @param array $setting the block setting.
	 *
	 * @return array Retrieve array of collection of css selectors and css declarations.
	 */
	abstract protected function css( array $setting ): array;

	/**
	 * Get reserved fallback list or string by support name.
	 * To be compatible with WordPress wp_get_block_css_selector() api.
	 *
	 * @param string $support The blockera support name.
	 *
	 * @return string|array The path to fallback support id, or query as string, or array on success, "root" while failure access to fallback property.
	 */
	protected function getFallbackSupport( string $support ) {

		return blockera_get_block_support( $this->getId(), $support, 'fallback' ) ?? 'root';
	}

	/**
	 * Get supports.
	 *
	 * @return array
	 */
	protected function getStyleEngineConfig( string $support): array {

		$block_type = \WP_Block_Type_Registry::get_instance()->get_registered( $this->block['blockName'] );

		$default_style_engine_config = blockera_get_block_support( $this->getId(), $support, 'style-engine-config' ) ?? [];

		if (! $block_type) {

			return $default_style_engine_config;
		}

		return  array_merge($default_style_engine_config, $block_type->supports['blockeraStyleEngineConfig'][ $support ] ?? []);
	}

	/**
	 * Resettings some properties to fresh before generate new styles.
	 *
	 * @return void
	 */
	public function resetProperties(): void {

		$this->css          = [];
		$this->declarations = [];
	}
}
