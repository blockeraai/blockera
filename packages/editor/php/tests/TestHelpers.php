<?php

namespace Blockera\Editor\Tests;

use Blockera\Exceptions\BaseException;
use Blockera\WordPress\RenderBlock\Setup;

class TestHelpers extends \WP_UnitTestCase {

	public array $selectors = [
		'root'                   => '.wp-block-sample, .wp-block-sample .first-child, .wp-block-sample .second-child',
		'blockera/elements/link' => [
			'root'  => 'a:not(.wp-element-button)',
			'width' => '.wp-block-sample a'
		],
		'fallback'               => '.blockera-block.blockera-block--phggmy',
	];

	public function set_up() {

		$selectors = $this->selectors;

		add_filter( 'register_block_type_args', function ( array $args ) use ( $selectors ): array {

			return array_merge(
				$args,
				[
					'selectors' => $selectors,
				]
			);
		}, 10 );
	}

	public function testItShouldRetrieveCssUniqueClassname(): void {

		$blocks = [
			'core/paragraph',
			'core/paragraph',
		];

		$expects = [
			'blockera'
		];

		$classnames = [];

		foreach ( $blocks as $block ) {

			$classnames[] = blockera_get_unique_classname( $block );
		}

		$this->assertFalse( in_array( 2, array_values( array_count_values( $classnames ) ) ) );
	}

	public function testItShouldRetrieveCssMediaQueriesEqualsWithExpects(): void {

		$this->assertEquals(
			[
				'desktop'          => '',
				'tablet'           => '@media screen and (max-width: 991px) and (min-width: 768px)',
				'mobile-landscape' => '@media screen and (max-width: 767px) and (min-width: 479px)',
				'mobile'           => '@media screen and (max-width: 478px) and (min-width: 0px)',
				'2xl-desktop'      => '@media screen and (min-width: 1920px)',
				'xl-desktop'       => '@media screen and (max-width: 1919px) and (min-width: 1440px)',
				'l-desktop'        => '@media screen and (max-width: 1439px) and (min-width: 1280px)',
			],
			blockera_get_css_media_queries(blockera_core_config('breakpoints.list'))
		);
	}

	/**
	 * FIXME: please double check functionality.
	 *
	 * @return void
	 */
	public function testItShouldValidateBlockState(): void {

		$this->assertEquals(
			blockera_block_state_validate(
				[
					'normal' => [
						'type'        => 'normal',
						'label'       => 'Normal',
						'breakpoints' => [
							'laptop' => [
								'attributes' => [],
							]
						]
					]
				],
				'normal'
			),
			[
				'type'        => 'normal',
				'label'       => 'Normal',
				'breakpoints' => [
					'laptop' => [
						'attributes' => [],
					]
				]
			]
		);

		$this->assertEquals(
			blockera_block_state_validate(
				[
					'normal' => [
						'type'        => 'normal',
						'label'       => 'Normal',
						'breakpoints' => [
							'laptop' => [
								'attributes' => [],
							]
						]
					]
				],
				'hover'
			),
			[]
		);
	}

	/**
	 * @dataProvider getDataProviderForCalculationCssSelector
	 *
	 * @param string       $featureId
	 * @param string|array $fallbackId
	 * @param string       $expected
	 *
	 * @return void
	 */
	public function testItShouldGetBlockeraCompatibleBlockCssSelectorWithWPAPI( string $blockType, string $featureId, $fallbackId, string $expected ): void {

		register_block_type( 'core/sample' );

		$this->assertEquals(
			$expected,
			blockera_get_compatible_block_css_selector( $this->selectors, $featureId, [
				'block-name'               => 'core/sample',
				'fallback'                 => $fallbackId,
				'block-type'               => $blockType,
				'blockera-unique-selector' => '.blockera-block.blockera-block--phggmy',
			] )
		);
	}

	public function getDataProviderForCalculationCssSelector(): array {

		return require __DIR__ . '/Fixtures/StyleEngine/calculation-css-selector.php';
	}

	/**
	 * @dataProvider getDataProviderForShorthandCss
	 *
	 * @param string $longCss
	 * @param string $expectedCss
	 *
	 * @return void
	 */
	public function testItShouldConvertLongCssToShorthandCss( string $longCss, string $expectedCss ): void {

		$this->assertSame(
			$expectedCss,
			blockera_get_shorthand_css( $longCss )
		);
	}

	public function getDataProviderForShorthandCss(): array {

		return require __DIR__ . '/Fixtures/StyleEngine/helpers/long-css.php';
	}

	/**
	 * @group        blockStateSelectors
	 * @dataProvider getBlockStateSelectorsDataProvider
	 *
	 * @param array  $args
	 * @param string $selectors
	 * @param string $blockStateSelectors
	 *
	 * @return void
	 */
	public function testItShouldRetrieveBlockStateSelectors( array $args, string $selector, string $blockStateSelectors = '' ): void {

		$this->assertSame(
			$blockStateSelectors,
			blockera_get_master_block_state_selector( $selector, $args )
		);
	}

	/**
	 * @group        innerBlockStateSelectors
	 * @dataProvider getInnerBlockStateSelectorsDataProvider
	 *
	 * @param array  $args
	 * @param string $selectors
	 * @param string $blockStateSelectors
	 *
	 * @throws BaseException Exception for invalid selector.
	 *
	 * @return void
	 */
	public function testItShouldRetrieveInnerBlockStateSelectors( array $args, string $selector, string $blockStateSelector = '' ): void {

		$this->assertSame(
			$blockStateSelector,
			blockera_get_inner_block_state_selector( $selector, $args )
		);
	}

	public function getBlockStateSelectorsDataProvider(): array {

		return require __DIR__ . '/Fixtures/StyleEngine/block-state-selectors.php';
	}

	public function getInnerBlockStateSelectorsDataProvider(): array {

		return require __DIR__ . '/Fixtures/StyleEngine/inner-block-state-selectors.php';
	}

	/**
	 * @dataProvider getCombineCssDataProvider
	 *
	 * @group        combineCss
	 *
	 * @param array $separatelyCss
	 * @param array $expected
	 *
	 * @return void
	 */
	public function testItShouldCombineCssRules( array $separatelyCss, array $expected ): void {

		$this->assertSame(
			$expected,
			blockera_combine_css( $separatelyCss )
		);
	}

	public function getCombineCssDataProvider(): array {

		return require __DIR__ . '/Fixtures/StyleEngine/combine-css.php';
	}

	/**
	 * @dataProvider getValidCssRulesDataProvider
	 *
	 * @group        validCssRules
	 *
	 * @param array $css
	 * @param array $expected
	 *
	 * @return void
	 */
	public function testItShouldRetrieveValidCssRules( array $css, array $expected ): void {

		$this->assertSame(
			$expected,
			blockera_convert_css_declarations_to_css_valid_rules( $css )
		);
	}

	public function getValidCssRulesDataProvider(): array {

		return require __DIR__ . '/Fixtures/StyleEngine/valid-css-rules.php';
	}

	/**
	 *
	 * @group        normalizingSelectors
	 *
	 * @return void
	 */
	public function testItShouldRetrieveNormalizedCssSelectors(): void {

		$this->assertSame(
			'.blockera-block',
			blockera_get_normalized_selector( 'test blockera-block' )
		);

		$this->assertSame(
			'.blockera-block',
			blockera_get_normalized_selector( '.test blockera-block' )
		);

		$this->assertSame(
			'',
			blockera_get_normalized_selector( '.test .blockera .block' )
		);
	}

	public function testItShouldRetrieveDesktopAsBaseBreakpoint(): void {

		$this->assertEquals( 'desktop', blockera_get_base_breakpoint() );
	}

	public function testItShouldRetrieveResultOfIsNormalStateOnBreakpoint(): void {

		$this->assertTrue( blockera_is_normal_on_base_breakpoint( 'normal', 'desktop' ) );
		$this->assertFalse( blockera_is_normal_on_base_breakpoint( 'normal', 'xl-desktop' ) );
		$this->assertFalse( blockera_is_normal_on_base_breakpoint( 'normal', '2xl-desktop' ) );
		$this->assertFalse( blockera_is_normal_on_base_breakpoint( 'normal', 'mobile' ) );
		$this->assertFalse( blockera_is_normal_on_base_breakpoint( 'hover', 'desktop' ) );
	}

	public function testEmptySelector() {

		$selector = '';
		$root     = '.my-root';
		$args     = [ 'blockName' => 'my-block' ];

		$result = blockera_append_root_block_css_selector( $selector, $root, $args );

		$this->assertEquals( $root, $result );
	}

	public function testSelectorWithBlockName() {

		$selector = '.wp-block-my-block';
		$root     = '.my-root';
		$args     = [ 'block-name' => 'my-block' ];

		$result = blockera_append_root_block_css_selector( $selector, $root, $args );

		$this->assertEquals( '.my-root.wp-block-my-block', $result );
	}

	public function testSelectorWithBlockNameAndOtherClasses() {

		$selector = '.wp-block-my-block.other-class';
		$root     = '.my-root';
		$args     = [ 'block-name' => 'my-block' ];

		$result = blockera_append_root_block_css_selector( $selector, $root, $args );

		$this->assertEquals( '.my-root.wp-block-my-block.other-class', $result );
	}

	public function testSelectorWithTagName() {

		$selector = 'div';
		$root     = '.my-root';
		$args     = [ 'block-name' => 'my-block', 'block-type' => 'master' ];

		$result = blockera_append_root_block_css_selector( $selector, $root, $args );

		$this->assertEquals( 'div.my-root', $result );
	}

	public function testSelectorStartingWithDot() {

		$selector = '.my-class';
		$root     = '.my-root';
		$args     = [ 'block-name' => 'my-block', 'block-type' => 'master' ];

		$result = blockera_append_root_block_css_selector( $selector, $root, $args );

		$this->assertEquals( '.my-root.my-class', $result );
	}

	public function testSelectorWithBlockNameWhenRootAlreadyContainsTarget() {

		$selector = '.wp-block-my-block:hover:focus';
		$root     = '.my-root.wp-block-my-block.is-style-outline.is-size-small';
		$args     = [ 'block-name' => 'my-block' ];

		$result = blockera_append_root_block_css_selector( $selector, $root, $args );

		$this->assertEquals(
			'.my-root.wp-block-my-block.is-style-outline.is-size-small:hover:focus',
			$result
		);
	}

	public function testSelectorWithBlockNameWhenRootContainsTargetWithOnlyStyleVariation() {

		$selector = '.wp-block-my-block:hover';
		$root     = '.my-root.wp-block-my-block.is-style-outline';
		$args     = [ 'block-name' => 'my-block' ];

		$result = blockera_append_root_block_css_selector( $selector, $root, $args );

		$this->assertEquals( '.my-root.wp-block-my-block.is-style-outline:hover', $result );
	}

	public function testPseudoOnlySelectorUsesRootBlockPartAndConcatenatesSelector() {

		$selector = '::before';
		$root     = '.my-root.wp-block-my-block.is-style-outline';
		$args     = [ 'block-name' => 'my-block' ];

		$result = blockera_append_root_block_css_selector( $selector, $root, $args );

		$this->assertEquals( '.my-root.wp-block-my-block.is-style-outline::before', $result );
	}

	public function testPseudoOnlySelectorWithChildCompoundUsesRootAndConcatenatesSelector() {

		$selector = ' :where(li)::marker';
		$root     = '.my-root.wp-block-page-list.is-style-outline';
		$args     = [ 'block-name' => 'page-list' ];

		$result = blockera_append_root_block_css_selector( $selector, $root, $args );

		$this->assertEquals( '.my-root.wp-block-page-list.is-style-outline :where(li)::marker', $result );
	}

	public function testPseudoOnlySelectorFallsBackWhenRootHasNoBlockPart() {

		$selector = '::before';
		$root     = '.my-root';
		$args     = [ 'block-name' => 'my-block', 'block-type' => 'master' ];

		$result = blockera_append_root_block_css_selector( $selector, $root, $args );

		$this->assertEquals( '.my-root::before', $result );
	}

	public function testListItemRootSelectorMatchesParentListBlockClassSegment() {

		$selector = '::marker';
		$root     = '.blockera-block.blockera-block--abc';
		$args     = [
			'block-name' => 'list-item',
			'block-type' => 'master',
			'root'       => '.wp-block-list > li',
		];

		$result = blockera_append_root_block_css_selector( $selector, $root, $args );

		$this->assertEquals(
			'.wp-block-list > li.blockera-block.blockera-block--abc::marker',
			$result
		);
	}

	public function testListItemMasterBlockCompoundSelectorAppendsRootOnLastCompound() {

		$selector = '.wp-block-list > li';
		$root     = '.blockera-block.blockera-block--abc';
		$args     = [
			'block-name' => 'list-item',
			'block-type' => 'master',
			'root'       => '.wp-block-list > li',
		];

		$result = blockera_append_root_block_css_selector( $selector, $root, $args );

		$this->assertEquals(
			'.wp-block-list > li.blockera-block.blockera-block--abc',
			$result
		);
	}

	public function testListItemRootSelectorAppendsVariationsOnLastCompoundForPseudoOnly() {

		$selector = '::marker';
		$root     = '.blockera-block.blockera-block--abc.is-style-x';
		$args     = [
			'block-name' => 'list-item',
			'block-type' => 'master',
			'root'       => '.wp-block-list > li',
		];

		$result = blockera_append_root_block_css_selector( $selector, $root, $args );

		$this->assertEquals(
			'.wp-block-list > li.blockera-block.blockera-block--abc.is-style-x::marker',
			$result
		);
	}

	public function testListItemPreferredRootReappendsVariationsOnBlockTypeRoot() {

		$selector = '::marker';
		$root     = '.wp-block-list > li.is-style-x';
		$args     = [
			'block-name' => 'list-item',
			'block-type' => 'master',
			'root'       => '.wp-block-list > li',
		];

		$result = blockera_append_root_block_css_selector( $selector, $root, $args );

		$this->assertEquals(
			'.wp-block-list > li.is-style-x::marker',
			$result
		);
	}

	public function testListItemUsesCanonicalBlockClassWhenPresentOnRoot() {

		$selector = '::before';
		$root     = '.blockera-block.blockera-block--abc.wp-block-list-item.is-style-outline';
		$args     = [
			'block-name' => 'list-item',
			'block-type' => 'master',
			'root'       => '.wp-block-list > li',
		];

		$result = blockera_append_root_block_css_selector( $selector, $root, $args );

		$this->assertEquals(
			'.blockera-block.blockera-block--abc.wp-block-list-item.is-style-outline::before',
			$result
		);
	}

	public function testListBlockStillMatchesWpBlockListClass() {

		$selector = ' li:not([class*="blockera-has-icon-"])::before';
		$root     = '.blockera-block.wp-block-list.is-style-outline';
		$args     = [
			'block-name' => 'list',
			'block-type' => 'master',
			'root'       => '.wp-block-list',
		];

		$result = blockera_append_root_block_css_selector( $selector, $root, $args );

		$this->assertEquals(
			'.blockera-block.wp-block-list.is-style-outline li:not([class*="blockera-has-icon-"])::before',
			$result
		);
	}

	public function testListItemInnerBlockLinkSelectorScopesToUniqueClass() {

		$result = blockera_get_inner_block_state_selector(
			'a:not(.wp-element-button)',
			[
				'block-name'               => 'core/list-item',
				'block-type'               => 'elements/link',
				'root'                     => '.wp-block-list > li',
				'blockera-unique-selector' => '.blockera-block.blockera-block--abc',
				'pseudo-class'             => 'normal',
				'inner-pseudo-class'       => 'normal',
			]
		);

		$this->assertSame(
			'html:root body :where(.wp-block-list > li.blockera-block.blockera-block--abc) a:not(.wp-element-button)',
			$result
		);
	}

	public function testListItemBackgroundClipSelectorAppendsUniqueClassOnLastCompound(): void {

		$selectors = blockera_get_block_type_property( 'core/list-item', 'selectors' );
		$unique    = '.blockera-block.blockera-block--abc';

		$result = blockera_get_compatible_block_css_selector(
			$selectors,
			'blockeraBackgroundClip',
			[
				'block-type'               => 'master',
				'block-name'               => 'core/list-item',
				'pseudo-class'             => 'normal',
				'inner-pseudo-class'       => 'normal',
				'breakpoint'               => 'desktop',
				'root'                     => $selectors['root'] ?? null,
				'blockera-unique-selector' => $unique,
			]
		);

		$this->assertSame(
			".wp-block-list > li{$unique}",
			$result
		);
	}

	public function testTableInnerBlockHeaderCellsBackgroundColorSelectorScopesToWrapperClass(): void {

		$selectors = blockera_get_block_type_property( 'core/table', 'selectors' );
		$unique    = '.blockera-block.blockera-block--abc';

		$result = blockera_get_compatible_block_css_selector(
			$selectors,
			'blockeraBackgroundColor',
			[
				'block-type'               => 'elements/header-cells',
				'block-name'               => 'core/table',
				'pseudo-class'             => 'normal',
				'inner-pseudo-class'       => 'normal',
				'breakpoint'               => 'desktop',
				'root'                     => $selectors['root'] ?? null,
				'blockera-unique-selector' => $unique,
			]
		);

		$this->assertSame(
			"html:root body :where(.wp-block-table{$unique} > table) thead th",
			$result
		);
	}

	public function testTableBackgroundClipSelectorAppendsUniqueClassOnWrapperCompound(): void {

		$selectors = blockera_get_block_type_property( 'core/table', 'selectors' );
		$unique    = '.blockera-block.blockera-block--abc';

		$result = blockera_get_compatible_block_css_selector(
			$selectors,
			'blockeraBackgroundClip',
			[
				'block-type'               => 'master',
				'block-name'               => 'core/table',
				'pseudo-class'             => 'normal',
				'inner-pseudo-class'       => 'normal',
				'breakpoint'               => 'desktop',
				'root'                     => $selectors['root'] ?? null,
				'blockera-unique-selector' => $unique,
			]
		);

		$this->assertSame(
			".blockera-block.blockera-block--abc.wp-block-table > table",
			$result
		);
	}

	public function testListItemInnerBlockLinkBackgroundColorSelectorScopesToUniqueClass(): void {

		$selectors = blockera_get_block_type_property( 'core/list-item', 'selectors' );
		$unique    = '.blockera-block.blockera-block--abc';

		$result = blockera_get_compatible_block_css_selector(
			$selectors,
			'blockeraBackgroundColor',
			[
				'block-type'               => 'elements/link',
				'block-name'               => 'core/list-item',
				'pseudo-class'             => 'normal',
				'inner-pseudo-class'       => 'normal',
				'breakpoint'               => 'desktop',
				'root'                     => $selectors['root'] ?? null,
				'blockera-unique-selector' => $unique,
			]
		);

		$this->assertSame(
			"html:root body :where(.wp-block-list > li{$unique}) a:not(.wp-element-button)",
			$result
		);
	}

	/**
	 * Paragraph inner span must not run append_root for blockeraFontColor.
	 * str_replace('p', ...) would corrupt [data-rich-text-placeholder].
	 */
	public function testInnerBlockSpanFontColorSelectorSkipsAppendRoot(): void {

		$selectors = array_merge(
			$this->selectors,
			[
				'root'                   => 'p',
				'blockera/elements/span' => [
					'root' => 'span:not([data-rich-text-placeholder])',
				],
			]
		);

		register_block_type(
			'core/paragraph',
			[
				'selectors' => $selectors,
			]
		);

		$result = blockera_get_compatible_block_css_selector(
			$selectors,
			'blockeraFontColor',
			[
				'block-name'               => 'core/paragraph',
				'fallback'                 => [ 'color.text', 'color', 'typography' ],
				'block-type'               => 'elements/span',
				'blockera-unique-selector' => '.blockera-block.blockera-block--phggmy',
				'root'                     => 'p',
				'pseudo-class'             => 'normal',
				'inner-pseudo-class'       => 'normal',
				'breakpoint'               => 'desktop',
			]
		);

		$this->assertSame(
			'html:root body :where(p) span:not([data-rich-text-placeholder])',
			$result
		);
	}

	/**
	 * Test single selector with a suffix.
	 */
	public function testSingleSelectorWithSuffix() {

		$selector = '.my-class';
		$suffix   = '-active';
		$expected = '.my-class-active';

		$this->assertSame( $expected, blockera_append_css_selector_suffix( $selector, $suffix ) );
	}

	/**
	 * Test multiple selectors with a suffix.
	 */
	public function testMultipleSelectorsWithSuffix() {

		$selector = '.my-class, #my-id';
		$suffix   = '-hover';
		$expected = '.my-class-hover, #my-id-hover';

		$this->assertSame( $expected, blockera_append_css_selector_suffix( $selector, $suffix ) );
	}

	/**
	 * Test empty selector.
	 */
	public function testItShouldAppendSuffixIntoEmptySelector() {

		$selector = '';
		$suffix   = '-test';
		$expected = '';

		$this->assertSame( $expected, blockera_append_css_selector_suffix( $selector, $suffix ) );
	}

	/**
	 * Test empty suffix.
	 */
	public function testEmptySuffix() {

		$selector = '.my-class, #my-id';
		$suffix   = '';
		$expected = '.my-class, #my-id';

		$this->assertSame( $expected, blockera_append_css_selector_suffix( $selector, $suffix ) );
	}

	/**
	 * Test with whitespace in selectors.
	 */
	public function testWhitespaceInSelectors() {

		$selector = '.my-class ,    #my-id';
		$suffix   = '-modified';
		$expected = '.my-class-modified, #my-id-modified';

		$this->assertSame( $expected, blockera_append_css_selector_suffix( $selector, $suffix ) );
	}

	/**
	 * Test complex selectors with a suffix.
	 */
	public function testComplexSelectorsWithSuffix() {

		$selector = '.my-class > .inner-class, #my-id + .another-class';
		$suffix   = '-active';
		$expected = '.my-class > .inner-class-active, #my-id + .another-class-active';

		$this->assertSame( $expected, blockera_append_css_selector_suffix( $selector, $suffix ) );
	}

	public function testCssSelectorFormatWithPseudoClasses() {

		$picked_selector = '.element';
		$args            = [
			'pseudo_class'        => 'hover',
			'parent_pseudo_class' => 'active'
		];

		$result = blockera_get_css_selector_format( '.container', $picked_selector, $args );
		$this->assertEquals( 'html:root body :where(.container):active .element:hover', $result );
	}

	public function testCssSelectorFormatWithoutPseudoClasses() {

		$picked_selector = '.element';
		$args            = [];

		$result = blockera_get_css_selector_format( '.container', $picked_selector, $args );
		$this->assertEquals( 'html:root body :where(.container) .element', $result );
	}

	public function testCssSelectorFormatWithAmpersandInPickedSelector() {

		$picked_selector = '&.element';
		$args            = [
			'pseudo_class' => 'hover'
		];

		$result = blockera_get_css_selector_format( '.container', $picked_selector, $args );
		$this->assertEquals( 'html:root body :where(.container).element:hover', $result );
	}

	public function testCssSelectorFormatFallbackWhenParentRootMissing() {

		$picked_selector = '.element';
		$args            = [];

		$result = blockera_get_css_selector_format( '.fallback', $picked_selector, $args );
		$this->assertEquals( 'html:root body :where(.fallback) .element', $result );
	}

	public function testCssSelectorFormatEmptySelectors() {

		$selectors       = [];
		$picked_selector = '.element';
		$args            = [];

		$result = blockera_get_css_selector_format( '', $picked_selector, $args );
		$this->assertEquals( '.element', $result );
	}

	public function tear_down() {

		// Removes test block types registered by test cases.
		$block_types = \WP_Block_Type_Registry::get_instance()->get_all_registered();
		foreach ( $block_types as $block_type ) {
			$block_name = $block_type->name;
			if ( $block_name === 'core/sample' ) {
				unregister_block_type( $block_name );
			}
		}
	}

	/**
     * Test basic selector formatting without pseudo classes
     */
    public function testBasicSelectorFormatting() {
        $cases = [
            // [root, picked, args, expected]
            ['.block', '.item', [], 'html:root body :where(.block) .item'],
            ['', '.item', [], '.item'],
            ['.block', '.item, .other', [], 'html:root body :where(.block) .item, html:root body :where(.block) .other'],
        ];

        foreach ($cases as [$root, $picked, $args, $expected]) {
            $result = blockera_get_css_selector_format($root, $picked, $args);
            $this->assertEquals($expected, $result, "Failed formatting for root: $root, picked: $picked");
        }
    }

    /**
     * Test selector formatting with pseudo classes
     */
    public function testSelectorWithPseudoClasses() {
        $cases = [
            // [root, picked, args, expected]
            [
                '.block', 
                '.item', 
                ['pseudo_class' => 'hover'], 
                'html:root body :where(.block) .item:hover'
            ],
            [
                '.block', 
                '.blockera__item, .blockera__other', 
                ['pseudo_class' => 'active'], 
                'html:root body :where(.block) .blockera__item:active, html:root body :where(.block) .blockera__other:active'
            ],
			[
				'.block',
				'&:before',
				['pseudo_class' => 'hover'],
				'html:root body :where(.block):hover::before'
			],
			[
				'.block',
				'.blockera-icon:before',
				['pseudo_class' => 'hover'],
				'html:root body :where(.block) .blockera-icon:hover::before'
			]
        ];

        foreach ($cases as [$root, $picked, $args, $expected]) {
            $result = blockera_get_css_selector_format($root, $picked, $args);
            $this->assertEquals($expected, $result, "Failed formatting with pseudo class for root: $root, picked: $picked");
        }
    }

    /**
     * Test selector formatting with parent pseudo classes
     */
    public function testSelectorWithParentPseudoClasses() {
        $cases = [
            // [root, picked, args, expected]
            [
                '.block', 
                '.item', 
                ['parent_pseudo_class' => 'hover'], 
                'html:root body :where(.block):hover .item'
            ],
            [
                '.block', 
                '.blockera-item', 
                ['parent_pseudo_class' => 'focus'], 
                'html:root body :where(.block):focus .blockera-item'
            ],
            [
                '.block', 
                '.blockera__item, .blockera__other', 
                ['parent_pseudo_class' => 'active'], 
                'html:root body :where(.block):active .blockera__item, html:root body :where(.block):active .blockera__other'
            ],
        ];

        foreach ($cases as [$root, $picked, $args, $expected]) {
            $result = blockera_get_css_selector_format($root, $picked, $args);
            $this->assertEquals($expected, $result, "Failed formatting with parent pseudo class for root: $root, picked: $picked");
        }
    }

    /**
     * Test selector formatting with both pseudo and parent pseudo classes
     */
    public function testSelectorWithBothPseudoClasses() {
        $cases = [
            // [root, picked, args, expected]
            [
                '.block', 
                '.item', 
                [
                    'pseudo_class' => 'focus',
                    'parent_pseudo_class' => 'hover'
                ], 
                'html:root body :where(.block):hover .item:focus'
            ],
            [
                '.block', 
                '.blockera-item', 
                [
                    'pseudo_class' => 'active',
                    'parent_pseudo_class' => 'focus'
                ], 
                'html:root body :where(.block):focus .blockera-item:active'
            ],
        ];

        foreach ($cases as [$root, $picked, $args, $expected]) {
            $result = blockera_get_css_selector_format($root, $picked, $args);
            $this->assertEquals($expected, $result, "Failed formatting with both pseudo classes for root: $root, picked: $picked");
        }
    }

    /**
     * Test selector formatting with && pattern
     */
    public function testSelectorWithDoubleAmpersandPattern() {
        $cases = [
            // [root, picked, args, expected]
            [
                '.block-class .child', 
                '&& item', 
                [], 
                'html:root body :where(.block-class) item'
            ],
            [
                '.block-class.modifier .child', 
                '&& .item', 
                [], 
                'html:root body :where(.block-class.modifier) .item'
            ],
            [
                '.block-class .sub-class',
                '&&:first-child', 
                [], 
                'html:root body :where(.block-class):first-child'
            ],
            [
                '.block-class .items', 
                '&&.active, .normal', 
                [], 
                'html:root body :where(.block-class).active, html:root body :where(.block-class .items) .normal'
            ],
            [
                '.complex-class.with-modifier .child', 
                '&& .item', 
                ['pseudo_class' => 'hover'], 
                'html:root body :where(.complex-class.with-modifier) .item:hover'
            ],
            [
                '.parent-block .child-block', 
                '&& > .item, .other-item', 
                [], 
                'html:root body :where(.parent-block) > .item, html:root body :where(.parent-block .child-block) .other-item'
            ],
        ];

        foreach ($cases as [$root, $picked, $args, $expected]) {
            $result = blockera_get_css_selector_format($root, $picked, $args);
            $this->assertEquals($expected, $result, "Failed formatting with && pattern for root: $root, picked: $picked");
        }
    }

	/**
	 * @dataProvider dataProviderGetCssSelectorFormat
	 */
	public function testGetCssSelectorFormat(string $picked_selector, string $expected)	{
		$root_selector = '.blockera-block';
		$args = [];
		$result = blockera_get_css_selector_format($root_selector, $picked_selector, $args);
		$this->assertEquals($expected, $result);
	}

	public function dataProviderGetCssSelectorFormat() {
		return [
			[ '.wp-block-sample:is(.a, .b)', 'html:root body :where(.blockera-block) .wp-block-sample:is(.a, .b)' ],
			[ '.wp-block-sample:not(.a, .b)', 'html:root body :where(.blockera-block) .wp-block-sample:not(.a, .b)' ],
			[ '.wp-block-sample:has(.a, .b)', 'html:root body :where(.blockera-block) .wp-block-sample:has(.a, .b)' ],
			[ '.wp-block-sample:host(.a, .b)', 'html:root body :where(.blockera-block) .wp-block-sample:host(.a, .b)' ],
			[ '.wp-block-sample:host-context(.a, .b)', 'html:root body :where(.blockera-block) .wp-block-sample:host-context(.a, .b)' ],
			[ '.wp-block-sample:any(.a, .b)', 'html:root body :where(.blockera-block) .wp-block-sample:any(.a, .b)' ],
		];
	}
}
