<?php

namespace Blockera\Editor\Tests;

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
			blockera_get_css_media_queries()
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
	public function testItShouldGetBlockeraCompatibleBlockCssSelectorWithWPAPI( string $featureId, $fallbackId, string $expected ): void {

		register_block_type( 'core/sample' );

		$this->assertEquals(
			$expected,
			blockera_get_compatible_block_css_selector( $this->selectors, $featureId, [
				'blockName' => 'core/sample',
				'fallback'  => $fallbackId,
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
	 * @param array $args
	 * @param array $selectors
	 * @param array $blockStateSelectors
	 *
	 * @return void
	 */
	public function testItShouldRetrieveBlockStateSelectors( array $args, array $selectors, array $blockStateSelectors = [] ): void {

		$this->assertSame(
			$blockStateSelectors,
			blockera_get_block_state_selectors( $selectors, $args )
		);
	}

	public function getBlockStateSelectorsDataProvider(): array {

		return require __DIR__ . '/Fixtures/StyleEngine/block-state-selectors.php';
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
		$args     = [ 'blockName' => 'my-block' ];

		$result = blockera_append_root_block_css_selector( $selector, $root, $args );

		$this->assertEquals( '.my-root.wp-block-my-block, .wp-block-my-block.my-root', $result );
	}

	public function testSelectorWithBlockNameAndOtherClasses() {

		$selector = '.wp-block-my-block.other-class';
		$root     = '.my-root';
		$args     = [ 'blockName' => 'my-block' ];

		$result = blockera_append_root_block_css_selector( $selector, $root, $args );

		$this->assertEquals( '.my-root.wp-block-my-block.other-class, .wp-block-my-block.other-class.my-root', $result );
	}

	public function testSelectorWithTagName() {

		$selector = 'div';
		$root     = '.my-root';
		$args     = [ 'blockName' => 'my-block' ];

		$result = blockera_append_root_block_css_selector( $selector, $root, $args );

		$this->assertEquals( 'div.my-root', $result );
	}

	public function testSelectorStartingWithDot() {

		$selector = '.my-class';
		$root     = '.my-root';
		$args     = [ 'blockName' => 'my-block' ];

		$result = blockera_append_root_block_css_selector( $selector, $root, $args );

		$this->assertEquals( '.my-root.my-class', $result );
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

}
