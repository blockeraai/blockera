<?php

namespace Publisher\Framework\Tests\Illuminate\StyleEngine;

class TestHelpers extends \WP_UnitTestCase {

	public function testItShouldRetrieveCssUniqueClassname(): void {

		$blocks = [
			'core/paragraph',
			'core/paragraph',
		];

		$expects = [
			'publisher'
		];

		$classnames = [];

		foreach ( $blocks as $block ) {

			$classnames[] = pb_get_unique_classname( $block );
		}

		$this->assertFalse( in_array( 2, array_values( array_count_values( $classnames ) ) ) );
	}

	public function testItShouldRetrieveCssMediaQueriesEqualsWithExpects(): void {

		$this->assertEquals(
			pb_get_css_media_queries(),
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
			pb_block_state_validate(
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
			pb_block_state_validate(
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

		$this->assertSame( $expectedSelectors, pb_get_block_type_selectors( $blockType ) );
	}

	public function getBlocksWithSelectors(): array {

		return require __PB_TEST_DIR__ . '/Fixtures/Illuminate/StyleEngine/blocks-with-selectors.php';
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
			pb_calculate_feature_css_selector( $selectors, $featureId, $fallbackId )
		);
	}

	public function getDataProviderForCalculationCssSelector(): array {

		return require __PB_TEST_DIR__ . '/Fixtures/Illuminate/StyleEngine/calculation-css-selector.php';
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
			pb_get_shorthand_css( $longCss )
		);
	}

	public function getDataProviderForShorthandCss(): array {

		return require __PB_TEST_DIR__ . '/Fixtures/Illuminate/StyleEngine/helpers/long-css.php';
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
			pb_get_block_state_selectors( $selectors, $args )
		);
	}

	public function getBlockStateSelectorsDataProvider(): array {

		return require __PB_TEST_DIR__ . '/Fixtures/Illuminate/StyleEngine/block-state-selectors.php';
	}

}
