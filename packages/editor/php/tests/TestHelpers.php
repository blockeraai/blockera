<?php

namespace Blockera\Editor\Tests;

class TestHelpers extends \WP_UnitTestCase {

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
			blockera_get_css_media_queries(),
			[
				"extra-large"      => "@media screen and (min-width: 2561px)",
				"large"            => "@media screen and (max-width: 2560px) and (min-width: 1921px)",
				"desktop"          => "@media screen and (max-width: 1920px) and (min-width: 1441px)",
				"laptop"           => "@media screen and (max-width: 1440px) and (min-width: 1025px)",
				"tablet"           => "@media screen and (max-width: 1024px) and (min-width: 768px)",
				"mobile-landscape" => "@media screen and (max-width: 767px) and (min-width: 481px)",
				"mobile"           => "@media screen and (max-width: 480px)",
			]
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
	 * @dataProvider getBlocksWithSelectors
	 *
	 * @param string $blockType
	 * @param array  $expectedSelectors
	 *
	 * @return void
	 */
	public function testItShouldRetrieveBlockTypeCssSelectorsExpectedList( string $blockType = '', array $expectedSelectors = [] ): void {

		$this->assertSame( $expectedSelectors, blockera_get_block_type_selectors( $blockType ) );
	}

	public function getBlocksWithSelectors(): array {

		return require __DIR__ . '/Fixtures/StyleEngine/blocks-with-selectors.php';
	}

	/**
	 * @dataProvider getDataProviderForCalculationCssSelector
	 *
	 * @param array  $selectors
	 * @param string $featureId
	 * @param string $fallbackId
	 * @param string $expected
	 *
	 * @return void
	 */
	public function testItShouldCalculatedSuitableCssSelectorForRelatedPropertyOfRecievedList( array $selectors, string $featureId, string $fallbackId, string $expected ): void {

		$this->assertEquals(
			$expected,
			blockera_calculate_feature_css_selector( $selectors, $featureId, $fallbackId )
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
			'.test.blockera.block',
			blockera_get_normalized_selector( 'test blockera block' )
		);

		$this->assertSame(
			'.test.blockera.block',
			blockera_get_normalized_selector( '.test blockera block' )
		);

		$this->assertSame(
			'.test.blockera.block',
			blockera_get_normalized_selector( '.test .blockera .block' )
		);
	}

}
