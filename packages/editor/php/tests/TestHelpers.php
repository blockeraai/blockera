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
				'tablet'           => '@media screen and (max-width: 991px)',
				'mobile-landscape' => '@media screen and (max-width: 767px)',
				'mobile'           => '@media screen and (max-width: 478px)',
				'2xl-desktop'      => '@media screen and (min-width: 1920px)',
				'xl-desktop'       => '@media screen and (min-width: 1440px)',
				'l-desktop'        => '@media screen and (min-width: 1280px)',
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
		$optimizeStyleGeneration = blockera_get_experimental(['earlyAccessLab', 'optimizeStyleGeneration']);

		$this->assertEquals( $optimizeStyleGeneration ? '.my-root.wp-block-my-block' : '.my-root.wp-block-my-block, .wp-block-my-block.my-root', $result );
	}

	public function testSelectorWithBlockNameAndOtherClasses() {

		$selector = '.wp-block-my-block.other-class';
		$root     = '.my-root';
		$args     = [ 'block-name' => 'my-block' ];

		$result = blockera_append_root_block_css_selector( $selector, $root, $args );
		$optimizeStyleGeneration = blockera_get_experimental(['earlyAccessLab', 'optimizeStyleGeneration']);

		$this->assertEquals( $optimizeStyleGeneration ? '.my-root.wp-block-my-block.other-class' : '.my-root.wp-block-my-block.other-class, .wp-block-my-block.my-root.other-class', $result );
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
		$this->assertEquals( '.container:active .element:hover', $result );
	}

	public function testCssSelectorFormatWithoutPseudoClasses() {

		$picked_selector = '.element';
		$args            = [];

		$result = blockera_get_css_selector_format( '.container', $picked_selector, $args );
		$this->assertEquals( '.container .element', $result );
	}

	public function testCssSelectorFormatWithAmpersandInPickedSelector() {

		$picked_selector = '&.element';
		$args            = [
			'pseudo_class' => 'hover'
		];

		$result = blockera_get_css_selector_format( '.container', $picked_selector, $args );
		$this->assertEquals( '.container.element:hover', $result );
	}

	public function testCssSelectorFormatFallbackWhenParentRootMissing() {

		$picked_selector = '.element';
		$args            = [];

		$result = blockera_get_css_selector_format( '.fallback', $picked_selector, $args );
		$this->assertEquals( '.fallback .element', $result );
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
            ['.block', '.item', [], '.block .item'],
            ['', '.item', [], '.item'],
            ['.block', '.item, .other', [], '.block .item, .block .other'],
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
                '.block .item:hover'
            ],
            [
                '.block', 
                '.blockera__item, .blockera__other', 
                ['pseudo_class' => 'active'], 
                '.block .blockera__item:active, .block .blockera__other:active'
            ],
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
                '.block:hover .item'
            ],
            [
                '.block', 
                '.blockera-item', 
                ['parent_pseudo_class' => 'focus'], 
                '.block:focus .blockera-item'
            ],
            [
                '.block', 
                '.blockera__item, .blockera__other', 
                ['parent_pseudo_class' => 'active'], 
                '.block:active .blockera__item, .block:active .blockera__other'
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
                '.block:hover .item:focus'
            ],
            [
                '.block', 
                '.blockera-item', 
                [
                    'pseudo_class' => 'active',
                    'parent_pseudo_class' => 'focus'
                ], 
                '.block:focus .blockera-item:active'
            ],
        ];

        foreach ($cases as [$root, $picked, $args, $expected]) {
            $result = blockera_get_css_selector_format($root, $picked, $args);
            $this->assertEquals($expected, $result, "Failed formatting with both pseudo classes for root: $root, picked: $picked");
        }
    }

    /**
     * Test invalid selector cases
     */
    public function testInvalidSelectors() {
        $this->expectException(BaseException::class);
        $this->expectExceptionMessage('Invalid &item selector!');
        blockera_get_css_selector_format('.block', '&item', []);
    }
}
