<?php

namespace Blockera\Editor\StyleDefinitions;

use Blockera\Editor\StyleDefinitions\Contracts\CustomStyle;
use Blockera\Editor\StyleDefinitions\Contracts\HasIgnoreChecks;

abstract class BaseStyleDefinition {

	/**
	 * Store the style definition identifier.
	 *
	 * @var string $id The style definition identifier.
	 */
	protected string $id = '';

    /**
     * Store the block details includes all settings.
     *
     * @var array $block The block details.
     */
    protected array $block = [];

	/**
	 * Store the flag to determine if the style is a global style.
	 *
	 * @var bool $is_global_style
	 */
	protected bool $is_global_style = false;

	/**
	 * Store the flag to determine if the style is a style variation.
	 *
	 * @var boolean $is_style_variation the flag to indicate current style is variation style or not!
	 */
	protected bool $is_style_variation = false;

    /**
     * Store style definition identifier.
     *
     * @var string $style_id The style definition id.
     */
    protected string $style_id;

    /**
     * Hold style definition settings for specific state and breakpoint.
     *
     * @var mixed $settings The specific state and breakpoint settings.
     */
    protected $settings;

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
        'is-important' => false,
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

	/**
	 * Store the support type.
	 *
	 * @var string $support_type the support type.
	 */
	protected string $support_type = 'single';

	/**
	 * Store the no checks flag.
	 *
	 * @var bool $no_checks the no checks flag.
	 */
	protected bool $no_checks = false;

    /**
     * The constructor.
     *
     * @param array $supports The supports.
     *
     * @throws \Exception If the supports are not valid.
     *
     * @return void
     */
    public function __construct( array $supports) { 
        $this->support = $supports;
    }

	/**
	 * Get the style definition identifier.
	 *
	 * @return string the style definition identifier.
	 */
	public function getId():string{

		return $this->id;
	}

	/**
	 * Set the style definition identifier.
	 *
	 * @param string $id the style definition identifier.
	 *
	 * @return void
	 */
	public function setId( string $id):void{
		$this->id = $id;
	}

	/**
	 * Set the no checks flag.
	 *
	 * @param bool $no_checks the no checks flag.
	 *
	 * @return void
	 */
	public function setNoChecks( bool $no_checks): void {

		$this->no_checks = $no_checks;
	}

    /**
     * Sets the style identifier property.
     *
     * @param string $id the identifier.
     *
     * @return void
     */
    public function setStyleId( string $id): void {

        $this->style_id = $id;
    }

	/**
	 * Get the style identifier.
	 *
	 * @return string the style identifier.
	 */
	public function getStyleId(): string {

		return $this->style_id;
	}

	/**
	 * Set the flag to determine if the style is a global style.
	 *
	 * @param bool $is_global_style the flag to determine if the style is a global style.
	 *
	 * @return void
	 */
	public function setIsGlobalStyle( bool $is_global_style): void {
		
		$this->is_global_style = $is_global_style;
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
     * @param array $options the options to generate css properties.
     *
     * @return void
     */
    public function setOptions( array $options): void {

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
	 * Get the flag to determine if the style is a style variation.
	 *
	 * @return boolean
	 */
	public function getIsStyleVariation(): bool {
		return $this->is_style_variation;
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
     * Sets suitable css selector for related property.
     *
     * @param string $support The feature identifier.
     */
    public function setSelector( string $support): void {

        if (empty($support)) {
            $this->selector = $support;

            return;
        }

        $fallback  = $this->getFallbackSupport($support);
        $selectors = blockera_get_block_type_property($this->block['blockName'], 'selectors');

		$prepared_selector = blockera_get_compatible_block_css_selector(
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
                'breakpoint'               => $this->breakpoint,
				'is-global-style'          => $this->is_global_style,
            ]
		);

		$this->selector = $prepared_selector;
    }

    /**
     * Sets configuration.
     *
     * @param array $config The style recieved definition config.
     *
     * @return void
     */
    public function setConfig( array $config): void {

        $this->config = $config;
    }

    /**
     * Sets default settings.
     *
     * @param array $default_settings The default settings.
     *
     * @return void
     */
    public function setDefaultSettings( array $default_settings): void {

        $this->default_settings = $default_settings;
    }

    /**
     * Sets block name property.
     *
     * @param array $block The block details.
     *
     * @return void
     */
    public function setBlock( array $block): void {

        $this->block = $block;
    }

	/**
	 * Sets the support type.
	 *
	 * @param string $support_type the support type.
	 *
	 * @return void
	 */
	public function setSupportType( string $support_type): void {

		$this->support_type = $support_type;
	}

	/**
	 * Get the support type.
	 *
	 * @return string the support type.
	 */
	public function getSupportType(): string {

		return $this->support_type;
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
    public function setSelectors( array $selectors): void {

        $this->selectors = $selectors;
    }

    /**
     * @param string $pseudo_state the available pseudo state on blockera style engine.
     *
     * @return void
     */
    public function setPseudoState( string $pseudo_state): void {

        $this->pseudo_state = $pseudo_state;
    }

    /**
     * @param string $block_type the block type.
     *
     * @return void
     */
    public function setBlockType( string $block_type): void {

        $this->block_type = $block_type;
    }

    /**
     * @param string $blockera_unique_selector The generated blockera unique css selector.
     *
     * @return void
     */
    public function setBlockeraUniqueSelector( string $blockera_unique_selector): void {

        $this->blockera_unique_selector = $blockera_unique_selector;
    }

    /**
     * @param string $inner_pseudo_state the inner block pseudo state.
     *
     * @return void
     */
    public function setInnerPseudoState( string $inner_pseudo_state): void {

        $this->inner_pseudo_state = $inner_pseudo_state;
    }

    /**
     * Check if the style definition is available in inner block.
     *
     * @param string $style_id The style identifier.
     *
     * @return bool true if the style definition is available in inner block, false otherwise.
     */
    protected function availableInInnerBlock( string $style_id): bool {

		if ($this instanceof HasIgnoreChecks) {

			return $this->isIgnoreChecks();
		}

		if ($this->no_checks) {

			return true;
		}

        $is_inner_block = blockera_is_inner_block($this->block_type);

        if (! isset($this->getSupports(false)[ $style_id ]['inner-blocks'])) {

            return ! $is_inner_block;
        }

        $current_block        = $is_inner_block ? $this->block_type : $this->block['blockName'];
        $allowed_inner_blocks = $this->getSupports(false)[ $style_id ]['inner-blocks'];

        if (isset($allowed_inner_blocks[ $current_block ]) && ! $allowed_inner_blocks[ $current_block ]) {

            return false;
        }

        return ! empty($allowed_inner_blocks['all']);
    }

	/**
	 * Runs {@see self::css()} with a clean declaration buffer (for global style presets → CSS custom properties).
	 *
	 * @param array $setting Same shape as the inner `css( array $setting )` entry point.
	 * @return array Map of selector → CSS declarations, as returned by `css()`.
	 */
	public function computeCssDeclarations( array $setting ): array {
		$this->css          = array();
		$this->declarations = array();

		return $this->css( $setting );
	}

    /**
	 * Get the css rules.
	 *
     * @return array
     */
    public function getCssRules(): array {

        $this->generateCssRules();

        return array_filter($this->css, 'blockera_get_filter_empty_array_item');
    }

    /**
     * Generating css rules.
     *
     * @return void
     */
    protected function generateCssRules(): void {

        $value = $this->settings;

        if (isset($value['value']) && 1 === count($value)) {

            $value = $value['value'];
        }

        $supports = $this->getSupports(false);
        $id       = $this->getId();
        
        $support = isset($supports[ $id ]) ? $supports[ $id ] : null;
        
        if (! $support) {

            return;
        }

        $cssProperty = $support['css-property'] ?? null;

        // Skip if no CSS property is defined.
        if (! $cssProperty) {

            return;
        }

        // Skip processing mask and divider properties if they are not enabled in experimental features.
        if (( 'divider' === $cssProperty || 'mask' === $cssProperty ) && ! blockera_get_experimental([ 'editor', 'extensions', 'effectsExtension', $cssProperty ])) {

            return;
        }

        $is_available = $this->availableInInnerBlock($id);

        if ($this instanceof CustomStyle) {

            $settings = $this->getCustomSettings($this->settings, $id, $cssProperty);

        } else {

            $settings = [
                [
                    'isVisible'  => true,
                    'type'       => $cssProperty,
                    $cssProperty => $value,
                ],
            ];
        }

        if ($support && $is_available) {
            foreach ($settings as $setting) {

				$this->css($setting);
            }
        }
    }

    /**
     * Sets css declaration into current selector.
     *
     * @param array  $declaration the generated css declarations array.
     * @param string $customSupportId the customized support identifier.
     * @param string $selectorSuffix the css selector suffix.
     */
    public function setCss( array $declaration, string $customSupportId = '', string $selectorSuffix = ''): void {

        if (empty($declaration)) {
            return;
        }

        if ($this->isImportant()) {
            $important_suffix = $this->getImportant();
            foreach ($declaration as $key => $value) {
                if (is_string($value)) {
                    $declaration[ $key ] = $value . $important_suffix;
                } else {
                    unset($declaration[ $key ]);
                }
            }
        }

        if (! empty($selectorSuffix) && ! empty($customSupportId)) {

            $this->setSelector($customSupportId);
            $this->selector = blockera_append_css_selector_suffix($this->selector, $selectorSuffix);

        } else {

            $this->setSelector($this->getId());
        }

        $selector = $this->selector;

        if (isset($this->css[ $selector ])) {

            $this->css[ $selector ] = array_merge($this->css[ $selector ], $declaration);

            return;
        }

        $this->css[ $selector ] = $declaration;
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
    protected function setDeclarations( array $props): void {

        $this->declarations = $props;
    }

    /**
     * @param string $id
     * @param        $value
     *
     * @return void
     */
    protected function setDeclaration( string $id, $value): void {

        $this->declarations[ $id ] = $value;
    }

    /**
     * Sets settings for generating css process.
     *
     * @param mixed $settings
     *
     * @return void
     */
    public function setSettings( $settings): void {

        $this->settings = $settings;
    }

	/**
	 * Get the support.
	 *
	 * @return array the support.
	 */
	protected function getSupport():array{

		$supports = $this->getSupports(false);

		return $supports[ $this->getId() ];
	}

    /**
     * Get blockera support standard css property name.
     *
     * @return string the standard css property name.
     */
    public function getSupportCssProperty(): ?string {

        return $this->getSupport()['css-property'] ?? null;
    }

    /**
     * Get blockera supports.
     *
     * @param bool $array_keys The array keys flag.
     *
     * @return array the supports stack.
     */
    public function getSupports( bool $array_keys = true): array {

        return $array_keys ? array_keys($this->support) : $this->support;
    }

    /**
     * @return array the css declarations.
     */
    public function getDeclarations(): array {

        return $this->declarations;
    }

	/**
	 * Build one declaration value for theme.json preset CSS variables (no selectors / setCss).
	 *
	 * @param array  $setting         Block-shaped setting; set `_blockeraGlobalPreset` for preset repeater row rules.
	 * @param string $declaration_key Declaration key to read (e.g. transition, transform, filter, text-shadow, border).
	 */
	public function getPresetCssDeclarationValue( array $setting, string $declaration_key ): string {
		$this->declarations                  = [];
		$this->css                           = [];
		$setting['_blockeraDeclarationOnly'] = true;
		$this->css( $setting );

		return (string) ( $this->declarations[ $declaration_key ] ?? '' );
	}

	/**
	 * Decode value-addon variable settings for repeater-style CSS (transition, transform, filter).
	 * Supports top-level `items` (global preset var picker), JSON string or array in `value`.
	 *
	 * @param array $settings Variable payload `settings` array.
	 * @return array<string, mixed>|null Shape with optional `declaration` and `items`.
	 */
	protected static function decodeVariableRepeaterSettings( array $settings ): ?array {
		if ( isset( $settings['items'] ) && is_array( $settings['items'] ) ) {
			return array( 'items' => $settings['items'] );
		}
		$raw = $settings['value'] ?? null;
		if ( is_array( $raw ) ) {
			return $raw;
		}
		if ( ! is_string( $raw ) || '' === $raw ) {
			return null;
		}
		$decoded = json_decode( $raw, true );

		return is_array( $decoded ) ? $decoded : null;
	}

	/**
	 * Sorted repeater rows from stored value (raw map or `valueType: variable` + JSON).
	 *
	 * Variable branch: `settings.value` may be a JSON string or array; global preset variables from the
	 * picker may use `settings.items` instead. Payload may include `declaration` or `items`. The computed
	 * CSS string is written to
	 * `$value['settings']['value']`, then `blockera_get_value_addon_real_value( $value )` runs for the final
	 * `var(--token, fallback)` value. When that succeeds, `$resolved_from_variable` is set and `[]` is returned.
	 *
	 * @param array         $value                  Value under the style key; updated in place for variable payloads.
	 * @param callable|null $build_declaration      `function( array $sorted_rows ): string` for `items`-based CSS.
	 * @param string|null   $resolved_from_variable Output: final declaration string when variable path resolves.
	 * @return array<int, mixed>
	 */
	protected static function getSortedRepeaterRowsFromValue( array &$value, ?callable $build_declaration = null, ?string &$resolved_from_variable = null ): array {
		$resolved_from_variable = null;

		if ( ! isset( $value['valueType'] ) ) {
			return blockera_get_sorted_repeater( $value );
		}
		if ( 'variable' !== ( $value['valueType'] ?? '' ) || ! isset( $value['settings'] ) || ! is_array( $value['settings'] ) ) {
			return [];
		}

		$decoded = static::decodeVariableRepeaterSettings( $value['settings'] );
		if ( null === $decoded ) {
			return [];
		}

		$raw_restore = '';
		if ( isset( $value['settings']['value'] ) && is_string( $value['settings']['value'] ) ) {
			$raw_restore = $value['settings']['value'];
		} elseif ( isset( $decoded['items'] ) && is_array( $decoded['items'] ) ) {
			$raw_restore = wp_json_encode( array( 'items' => $decoded['items'] ) );
		}

		$declaration_string = '';

		if ( array_key_exists( 'declaration', $decoded ) && '' !== $decoded['declaration'] && null !== $decoded['declaration'] ) {
			$resolved_decl      = blockera_get_value_addon_real_value( $decoded['declaration'] );
			$declaration_string = is_scalar( $resolved_decl ) ? (string) $resolved_decl : '';
		} elseif ( null !== $build_declaration ) {
			$items = $decoded['items'] ?? [];
			if ( ! is_array( $items ) ) {
				return [];
			}
			$sorted             = blockera_get_sorted_repeater( $items );
			$declaration_string = $build_declaration( $sorted );
		} else {
			$items = $decoded['items'] ?? [];
			if ( ! is_array( $items ) ) {
				return [];
			}

			return blockera_get_sorted_repeater( $items );
		}

		if ( '' === $declaration_string ) {
			$items = $decoded['items'] ?? [];
			if ( ! is_array( $items ) ) {
				return [];
			}

			return blockera_get_sorted_repeater( $items );
		}

		$value['settings']['value'] = $declaration_string;
		$resolved_raw               = blockera_get_value_addon_real_value( $value );
		$final                      = is_scalar( $resolved_raw ) ? (string) $resolved_raw : '';

		if ( '' !== $final ) {
			$resolved_from_variable = $final;

			return [];
		}

		// Var resolution returned empty (e.g. missing token): put JSON back so callers can still expand `items` row-by-row.
		$value['settings']['value'] = $raw_restore;
		$items                      = $decoded['items'] ?? [];
		if ( ! is_array( $items ) ) {
			return [];
		}

		return blockera_get_sorted_repeater( $items );
	}

    /**
     * Collect all css selectors and declarations.
     *
     * @param array $setting the block setting.
     *
     * @return array Retrieve array of collection of css selectors and css declarations.
     */
    abstract protected function css( array $setting): array;

    /**
     * Get reserved fallback list or string by support name.
     * To be compatible with WordPress wp_get_block_css_selector() api.
     *
     * @param string $support The blockera support name.
     *
     * @return string|array The path to fallback support id, or query as string, or array on success, "root" while failure access to fallback property.
     */
    protected function getFallbackSupport( string $support) { 
        return $this->getSupports(false)[ $support ]['fallback'] ?? 'root';
    }

    /**
     * Get supports.
     *
     * @return array
     */
    protected function getStyleEngineConfig( string $support): array {

        $block_type = \WP_Block_Type_Registry::get_instance()->get_registered($this->block['blockName']);

        $default_style_engine_config = $this->getSupports(false)[ $support ]['style-engine-config'] ?? [];

        if (! $block_type) {

            return $default_style_engine_config;
        }

        return  array_merge($default_style_engine_config, $block_type->supports['blockeraStyleEngineConfig'][ $support ] ?? []);
    }

	/**
	 * Get current breakpoint settings.
	 * 
	 * @param bool $is_inner_block The flag to determine if the current settings are for an inner block.
	 *
	 * @return array
	 */
	protected function getCurrentBreakpointSettings( bool $is_inner_block = false): array {

		if ($is_inner_block) {

			// Try prepare from current inner block state.
			$settings = $this->getCurrentInnerBlockSettings();

			$block_states = $settings['blockeraBlockStates']['value'] ?? [];
			
			if (! empty($block_states[ $this->pseudo_state ]['breakpoints'][ $this->breakpoint ])) {

				return $block_states[ $this->pseudo_state ]['breakpoints'][ $this->breakpoint ]['attributes'] ?? [];
			}

			// Try prepare from master current state as a fallback way.
			$settings = $this->getCurrentInnerBlockSettings(true);

			$block_states = $settings['blockeraBlockStates']['value'] ?? [];
			
			if (! empty($block_states[ $this->pseudo_state ]['breakpoints'][ $this->breakpoint ])) {

				return $block_states[ $this->pseudo_state ]['breakpoints'][ $this->breakpoint ]['attributes'] ?? [];
			}

			return $settings;
		}

		if (empty($this->block['attrs']['blockeraBlockStates']['value'])) {

			return $this->block['attrs'] ?? [];
		}

		$block_states = $this->block['attrs']['blockeraBlockStates']['value'] ?? [];

		if (empty($block_states[ $this->pseudo_state ])) {

			return [];
		}

		if (empty($block_states[ $this->pseudo_state ]['breakpoints'][ $this->breakpoint ])) {

			return [];
		}

		return $block_states[ $this->pseudo_state ]['breakpoints'][ $this->breakpoint ]['attributes'] ?? [];
	}

	/**
	 * Get current inner block settings.
	 * 
	 * @param bool $from_master_state flag to determine if the current settings are from master state. Default is false.
	 *
	 * @return array
	 */
	protected function getCurrentInnerBlockSettings( bool $from_master_state = false): array {
		
		if (! blockera_is_normal_on_base_breakpoint($this->pseudo_state, $this->breakpoint) && $from_master_state) {

			$states     = $this->block['attrs']['blockeraBlockStates']['value'] ?? [];
			$breakpoint = $states[ $this->pseudo_state ]['breakpoints'][ $this->breakpoint ]['attributes'] ?? [];

			return $breakpoint['blockeraInnerBlocks'][ $this->block_type ]['attributes'] ?? [];
		}

		if (empty($this->block['attrs']['blockeraInnerBlocks']['value'][ $this->block_type ])) {

			return [];
		}
		
		$current_block = $this->block['attrs']['blockeraInnerBlocks']['value'][ $this->block_type ]['attributes'] ?? [];

		if (empty($current_block)) {

			return [];
		}

		return $current_block;
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
