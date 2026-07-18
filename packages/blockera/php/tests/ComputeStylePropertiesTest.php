<?php

namespace Blockera\Setup\Tests;

use Blockera\Setup\Compatibility\JSON;
use ReflectionMethod;

/**
 * Input/output contract tests for JSON::compute_style_properties().
 *
 * These lock every branch so a performance refactor can prove identical results.
 *
 * @covers \Blockera\Setup\Compatibility\JSON::compute_style_properties
 */
class ComputeStylePropertiesTest extends \Blockera\Dev\PHPUnit\AppTestCase {

	/**
	 * @var ReflectionMethod
	 */
	private ReflectionMethod $method;

	public function set_up(): void {
		parent::set_up();

		$this->method = new ReflectionMethod( JSON::class, 'compute_style_properties' );
		$this->method->setAccessible( true );
	}

	/**
	 * Invoke the protected static method under test.
	 *
	 * @param array       $styles Styles subtree.
	 * @param array       $settings Theme settings.
	 * @param array|null  $properties Properties metadata override.
	 * @param array|null  $theme_json Theme JSON array.
	 * @param string|null $selector Style selector.
	 * @param bool|null   $use_root_padding Whether root padding custom props are enabled.
	 * @return array
	 */
	private function compute(
		$styles,
		$settings = array(),
		$properties = null,
		$theme_json = null,
		$selector = null,
		$use_root_padding = null
	): array {
		return $this->method->invoke(
			null,
			$styles,
			$settings,
			$properties,
			$theme_json,
			$selector,
			$use_root_padding
		);
	}

	public function testEmptyStylesReturnsEmptyArray(): void {
		$this->assertSame( array(), $this->compute( array() ) );
		$this->assertSame( array(), $this->compute( null ) );
		$this->assertSame( array(), $this->compute( '' ) );
		$this->assertSame( array(), $this->compute( 0 ) );
		$this->assertSame( array(), $this->compute( false ) );
	}

	public function testSkipsNonArrayValuePaths(): void {
		$properties = array(
			'color'      => 'not-an-array',
			'font-weight' => array( 'typography', 'fontWeight' ),
		);

		$this->assertSame(
			array(
				array(
					'name'  => 'font-weight',
					'value' => '700',
				),
			),
			$this->compute(
				array(
					'typography' => array(
						'fontWeight' => '700',
					),
				),
				array(),
				$properties
			)
		);
	}

	public function testBasicColorAndTypographyDeclarations(): void {
		$styles = array(
			'color'      => array(
				'text'       => '#111111',
				'background' => '#ffffff',
			),
			'typography' => array(
				'fontSize'   => '16px',
				'fontWeight' => '400',
				'lineHeight' => '1.5',
			),
		);

		$properties = array(
			'color'        => array( 'color', 'text' ),
			'background-color' => array( 'color', 'background' ),
			'font-size'    => array( 'typography', 'fontSize' ),
			'font-weight'  => array( 'typography', 'fontWeight' ),
			'line-height'  => array( 'typography', 'lineHeight' ),
		);

		$this->assertSame(
			array(
				array(
					'name'  => 'color',
					'value' => '#111111',
				),
				array(
					'name'  => 'background-color',
					'value' => '#ffffff',
				),
				array(
					'name'  => 'font-size',
					'value' => '16px',
				),
				array(
					'name'  => 'font-weight',
					'value' => '400',
				),
				array(
					'name'  => 'line-height',
					'value' => '1.5',
				),
			),
			$this->compute(
				$styles,
				array(
					'typography' => array( 'fluid' => false ),
				),
				$properties
			)
		);
	}

	public function testKeepsNumericZeroValues(): void {
		$properties = array(
			'outline-offset' => array( 'outline', 'offset' ),
			'font-weight'    => array( 'typography', 'fontWeight' ),
		);

		$this->assertSame(
			array(
				array(
					'name'  => 'outline-offset',
					'value' => 0,
				),
				array(
					'name'  => 'font-weight',
					'value' => '0',
				),
			),
			$this->compute(
				array(
					'outline'    => array( 'offset' => 0 ),
					'typography' => array( 'fontWeight' => '0' ),
				),
				array(),
				$properties
			)
		);
	}

	public function testSkipsEmptyAndArrayValues(): void {
		$properties = array(
			'color'        => array( 'color', 'text' ),
			'margin'       => array( 'spacing', 'margin' ),
			'padding-top'  => array( 'spacing', 'padding', 'top' ),
			'font-weight'  => array( 'typography', 'fontWeight' ),
		);

		$this->assertSame(
			array(
				array(
					'name'  => 'font-weight',
					'value' => '600',
				),
			),
			$this->compute(
				array(
					'color'      => array( 'text' => '' ),
					'spacing'    => array(
						'margin'  => array(
							'top'    => '1px',
							'right'  => '2px',
							'bottom' => '3px',
							'left'   => '4px',
						),
						'padding' => array(
							'top' => null,
						),
					),
					'typography' => array( 'fontWeight' => '600' ),
				),
				array(),
				$properties
			)
		);
	}

	public function testRootStyleSkippedWhenNotRootSelectorOrRootPaddingDisabled(): void {
		$styles = array(
			'spacing' => array(
				'padding' => array(
					'top'    => '10px',
					'right'  => '20px',
					'bottom' => '30px',
					'left'   => '40px',
				),
			),
		);

		$properties = array(
			'padding-top'                    => array( 'spacing', 'padding', 'top' ),
			'--wp--style--root--padding-top' => array( 'spacing', 'padding', 'top' ),
		);

		// Non-root selector: root custom property skipped.
		$this->assertSame(
			array(
				array(
					'name'  => 'padding-top',
					'value' => '10px',
				),
			),
			$this->compute( $styles, array(), $properties, null, '.wp-block-group', true )
		);

		// Root selector but root padding disabled: root custom property skipped.
		$this->assertSame(
			array(
				array(
					'name'  => 'padding-top',
					'value' => '10px',
				),
			),
			$this->compute( $styles, array(), $properties, null, 'body', false )
		);
	}

	public function testRootPaddingStringShorthandIsSkipped(): void {
		$properties = array(
			'--wp--style--root--padding' => array( 'spacing', 'padding' ),
			'color'                      => array( 'color', 'text' ),
		);

		$this->assertSame(
			array(
				array(
					'name'  => 'color',
					'value' => 'red',
				),
			),
			$this->compute(
				array(
					'spacing' => array( 'padding' => '1rem' ),
					'color'   => array( 'text' => 'red' ),
				),
				array(),
				$properties,
				null,
				'body',
				true
			)
		);
	}

	public function testRootVariableDuplicatesRemoveMatchingLonghandDeclarations(): void {
		$styles = array(
			'spacing' => array(
				'padding' => array(
					'top'    => '10px',
					'right'  => '20px',
					'bottom' => '30px',
					'left'   => '40px',
				),
			),
		);

		$properties = array(
			'padding-top'                       => array( 'spacing', 'padding', 'top' ),
			'padding-right'                     => array( 'spacing', 'padding', 'right' ),
			'--wp--style--root--padding-top'    => array( 'spacing', 'padding', 'top' ),
			'--wp--style--root--padding-right'  => array( 'spacing', 'padding', 'right' ),
			'--wp--style--root--padding-bottom' => array( 'spacing', 'padding', 'bottom' ),
		);

		// Root vars are emitted; matching longhands (padding-top/right) are discarded.
		$this->assertSame(
			array(
				array(
					'name'  => '--wp--style--root--padding-top',
					'value' => '10px',
				),
				array(
					'name'  => '--wp--style--root--padding-right',
					'value' => '20px',
				),
				array(
					'name'  => '--wp--style--root--padding-bottom',
					'value' => '30px',
				),
			),
			$this->compute( $styles, array(), $properties, null, 'body', true )
		);
	}

	public function testRootDuplicateDiscardWhenNameNotPresentIsNoOp(): void {
		$properties = array(
			'--wp--style--root--padding-top' => array( 'spacing', 'padding', 'top' ),
			'color'                          => array( 'color', 'text' ),
		);

		// Root var is added (and queued for discard of "padding-top"), but padding-top was never declared.
		$this->assertSame(
			array(
				array(
					'name'  => '--wp--style--root--padding-top',
					'value' => '8px',
				),
				array(
					'name'  => 'color',
					'value' => 'blue',
				),
			),
			$this->compute(
				array(
					'spacing' => array(
						'padding' => array( 'top' => '8px' ),
					),
					'color'   => array( 'text' => 'blue' ),
				),
				array(),
				$properties,
				null,
				'body',
				true
			)
		);
	}

	public function testBackgroundImageIsConvertedViaStyleEngine(): void {
		$properties = array(
			'background-image' => array( 'background', 'backgroundImage' ),
		);

		$result = $this->compute(
			array(
				'background' => array(
					'backgroundImage' => array(
						'url' => 'https://example.com/bg.jpg',
					),
				),
			),
			array(),
			$properties,
			null,
			'.wp-block-cover'
		);

		$this->assertCount( 1, $result );
		$this->assertSame( 'background-image', $result[0]['name'] );
		$this->assertStringContainsString( 'url(', $result[0]['value'] );
		$this->assertStringContainsString( 'https://example.com/bg.jpg', $result[0]['value'] );
	}

	public function testBackgroundDefaultsWhenImageIdPresentAndValuesEmpty(): void {
		$styles = array(
			'background' => array(
				'backgroundImage' => array(
					'id'  => 123,
					'url' => '',
				),
				'backgroundSize'  => 'contain',
			),
		);

		$properties = array(
			'background-size'     => array( 'background', 'backgroundSize' ),
			'background-position' => array( 'background', 'backgroundPosition' ),
			'background-repeat'   => array( 'background', 'backgroundRepeat' ),
		);

		// backgroundSize is already "contain" (non-empty), so default cover branch is not used for size.
		// Empty position + contain → 50% 50%.
		$this->assertSame(
			array(
				array(
					'name'  => 'background-size',
					'value' => 'contain',
				),
				array(
					'name'  => 'background-position',
					'value' => '50% 50%',
				),
			),
			$this->compute( $styles, array(), $properties, null, '.wp-block-cover' )
		);
	}

	public function testBackgroundSizeDefaultsToCoverWhenEmptyWithImageId(): void {
		$styles = array(
			'background' => array(
				'backgroundImage' => array(
					'id' => 99,
				),
			),
		);

		$properties = array(
			'background-size'     => array( 'background', 'backgroundSize' ),
			'background-position' => array( 'background', 'backgroundPosition' ),
		);

		$this->assertSame(
			array(
				array(
					'name'  => 'background-size',
					'value' => 'cover',
				),
			),
			$this->compute( $styles, array(), $properties, null, '.wp-block-cover' )
		);
	}

	public function testBackgroundDefaultsSkippedOnRootSelector(): void {
		$styles = array(
			'background' => array(
				'backgroundImage' => array(
					'id' => 99,
				),
			),
		);

		$properties = array(
			'background-size' => array( 'background', 'backgroundSize' ),
		);

		$this->assertSame(
			array(),
			$this->compute( $styles, array(), $properties, null, 'body', false )
		);
	}

	public function testProtectedPropertySkippedWhenSettingIsNull(): void {
		$properties = array(
			'gap'   => array( 'spacing', 'blockGap' ),
			'color' => array( 'color', 'text' ),
		);

		$this->assertSame(
			array(
				array(
					'name'  => 'color',
					'value' => 'green',
				),
			),
			$this->compute(
				array(
					'spacing' => array( 'blockGap' => '1.5rem' ),
					'color'   => array( 'text' => 'green' ),
				),
				array(
					'spacing' => array( 'blockGap' => null ),
				),
				$properties
			)
		);
	}

	public function testProtectedPropertyAllowedWhenSettingEnabled(): void {
		$properties = array(
			'gap' => array( 'spacing', 'blockGap' ),
		);

		$this->assertSame(
			array(
				array(
					'name'  => 'gap',
					'value' => '1.5rem',
				),
			),
			$this->compute(
				array(
					'spacing' => array( 'blockGap' => '1.5rem' ),
				),
				array(
					'spacing' => array( 'blockGap' => true ),
				),
				$properties
			)
		);
	}

	public function testAspectRatioAddsMinHeightUnset(): void {
		$properties = array(
			'aspect-ratio' => array( 'dimensions', 'aspectRatio' ),
			'width'        => array( 'dimensions', 'width' ),
		);

		$this->assertSame(
			array(
				array(
					'name'  => 'min-height',
					'value' => 'unset',
				),
				array(
					'name'  => 'aspect-ratio',
					'value' => '16/9',
				),
				array(
					'name'  => 'width',
					'value' => '100%',
				),
			),
			$this->compute(
				array(
					'dimensions' => array(
						'aspectRatio' => '16/9',
						'width'       => '100%',
					),
				),
				array(),
				$properties
			)
		);
	}

	public function testFontSizePassesThroughWhenFluidDisabled(): void {
		$properties = array(
			'font-size' => array( 'typography', 'fontSize' ),
		);

		$this->assertSame(
			array(
				array(
					'name'  => 'font-size',
					'value' => '20px',
				),
			),
			$this->compute(
				array(
					'typography' => array( 'fontSize' => '20px' ),
				),
				array(
					'typography' => array( 'fluid' => false ),
				),
				$properties
			)
		);
	}

	public function testFontSizeCanProduceFluidClampWhenEnabled(): void {
		$properties = array(
			'font-size' => array( 'typography', 'fontSize' ),
		);

		$result = $this->compute(
			array(
				'typography' => array( 'fontSize' => '48px' ),
			),
			array(
				'typography' => array(
					'fluid' => true,
				),
				'layout'     => array(
					'wideSize' => '1200px',
				),
			),
			$properties
		);

		$this->assertCount( 1, $result );
		$this->assertSame( 'font-size', $result[0]['name'] );
		// Fluid path returns clamp(...) or original size depending on validity; either is a non-empty string.
		$this->assertIsString( $result[0]['value'] );
		$this->assertNotSame( '', $result[0]['value'] );
	}

	public function testNullPropertiesUsesPropertiesMetadata(): void {
		$result = $this->compute(
			array(
				'color' => array(
					'text' => '#abcdef',
				),
			)
		);

		$this->assertContains(
			array(
				'name'  => 'color',
				'value' => '#abcdef',
			),
			$result
		);
	}

	public function testThemeJsonRefResolutionForColor(): void {
		$properties = array(
			'color' => array( 'color', 'text' ),
		);

		$theme_json = array(
			'styles' => array(
				'color' => array(
					'background' => '#ff00ff',
				),
			),
		);

		$this->assertSame(
			array(
				array(
					'name'  => 'color',
					'value' => '#ff00ff',
				),
			),
			$this->compute(
				array(
					'color' => array(
						'text' => array(
							'ref' => 'styles.color.background',
						),
					),
				),
				array(),
				$properties,
				$theme_json
			)
		);
	}

	/**
	 * Full realistic stylesheet-style input (multiple branches in one call).
	 */
	public function testRealisticMixedStylesFixture(): void {
		$styles = array(
			'color'      => array(
				'text'       => '#1a1a1a',
				'background' => '#fafafa',
				'gradient'   => 'linear-gradient(red, blue)',
			),
			'typography' => array(
				'fontSize'      => '18px',
				'fontFamily'    => 'Georgia, serif',
				'fontStyle'     => 'italic',
				'fontWeight'    => '500',
				'lineHeight'    => '1.6',
				'letterSpacing' => '0.02em',
				'textTransform' => 'uppercase',
				'textDecoration'=> 'underline',
			),
			'spacing'    => array(
				'padding' => array(
					'top'    => '12px',
					'right'  => '16px',
					'bottom' => '12px',
					'left'   => '16px',
				),
				'margin'  => array(
					'top' => '0',
				),
			),
			'border'     => array(
				'radius' => '8px',
				'width'  => '1px',
				'style'  => 'solid',
				'color'  => '#cccccc',
			),
			'dimensions' => array(
				'aspectRatio' => '4/3',
				'minHeight'   => '200px',
			),
			'background' => array(
				'backgroundImage' => array(
					'url' => 'https://example.com/hero.webp',
				),
				'backgroundSize'     => 'cover',
				'backgroundPosition' => 'center center',
			),
		);

		$properties = array(
			'color'               => array( 'color', 'text' ),
			'background-color'    => array( 'color', 'background' ),
			'background'          => array( 'color', 'gradient' ),
			'font-size'           => array( 'typography', 'fontSize' ),
			'font-family'         => array( 'typography', 'fontFamily' ),
			'font-style'          => array( 'typography', 'fontStyle' ),
			'font-weight'         => array( 'typography', 'fontWeight' ),
			'line-height'         => array( 'typography', 'lineHeight' ),
			'letter-spacing'      => array( 'typography', 'letterSpacing' ),
			'text-transform'      => array( 'typography', 'textTransform' ),
			'text-decoration'     => array( 'typography', 'textDecoration' ),
			'padding-top'         => array( 'spacing', 'padding', 'top' ),
			'padding-right'       => array( 'spacing', 'padding', 'right' ),
			'padding-bottom'      => array( 'spacing', 'padding', 'bottom' ),
			'padding-left'        => array( 'spacing', 'padding', 'left' ),
			'margin-top'          => array( 'spacing', 'margin', 'top' ),
			'border-radius'       => array( 'border', 'radius' ),
			'border-width'        => array( 'border', 'width' ),
			'border-style'        => array( 'border', 'style' ),
			'border-color'        => array( 'border', 'color' ),
			'aspect-ratio'        => array( 'dimensions', 'aspectRatio' ),
			'min-height'          => array( 'dimensions', 'minHeight' ),
			'background-image'    => array( 'background', 'backgroundImage' ),
			'background-size'     => array( 'background', 'backgroundSize' ),
			'background-position' => array( 'background', 'backgroundPosition' ),
		);

		$result = $this->compute( $styles, array( 'typography' => array( 'fluid' => false ) ), $properties, null, '.wp-block-group' );

		$by_name = array();
		foreach ( $result as $declaration ) {
			$by_name[ $declaration['name'] ] = $declaration['value'];
		}

		$this->assertSame( '#1a1a1a', $by_name['color'] );
		$this->assertSame( '#fafafa', $by_name['background-color'] );
		$this->assertSame( 'linear-gradient(red, blue)', $by_name['background'] );
		$this->assertSame( '18px', $by_name['font-size'] );
		$this->assertSame( 'Georgia, serif', $by_name['font-family'] );
		$this->assertSame( '12px', $by_name['padding-top'] );
		$this->assertSame( '0', $by_name['margin-top'] );
		$this->assertSame( '8px', $by_name['border-radius'] );
		$this->assertSame( '4/3', $by_name['aspect-ratio'] );
		$this->assertStringContainsString( 'url(', $by_name['background-image'] );
		$this->assertSame( 'cover', $by_name['background-size'] );
		$this->assertSame( 'center center', $by_name['background-position'] );

		// aspect-ratio injects min-height:unset before aspect-ratio; dimensions.minHeight also emits min-height.
		$min_height_values = array();
		foreach ( $result as $declaration ) {
			if ( 'min-height' === $declaration['name'] ) {
				$min_height_values[] = $declaration['value'];
			}
		}
		$this->assertSame( array( 'unset', '200px' ), $min_height_values );
	}

	/**
	 * Data provider: compact branch matrix for strict I/O equality.
	 *
	 * @return array<string, array{0:array,1:array,2:array|null,3:array|null,4:string|null,5:bool|null,6:array}>
	 */
	public function branchMatrixProvider(): array {
		$color_props = array(
			'color' => array( 'color', 'text' ),
		);

		return array(
			'missing_style_key'         => array(
				array( 'typography' => array( 'fontWeight' => '700' ) ),
				array(),
				$color_props,
				null,
				null,
				null,
				array(),
			),
			'single_declaration'        => array(
				array( 'color' => array( 'text' => 'navy' ) ),
				array(),
				$color_props,
				null,
				null,
				null,
				array(
					array(
						'name'  => 'color',
						'value' => 'navy',
					),
				),
			),
			'root_padding_longhands'    => array(
				array(
					'spacing' => array(
						'padding' => array(
							'top' => '5px',
						),
					),
				),
				array(),
				array(
					'padding-top'                    => array( 'spacing', 'padding', 'top' ),
					'--wp--style--root--padding-top' => array( 'spacing', 'padding', 'top' ),
				),
				null,
				'body',
				true,
				array(
					array(
						'name'  => '--wp--style--root--padding-top',
						'value' => '5px',
					),
				),
			),
			'protected_gap_missing_setting_key' => array(
				array(
					'spacing' => array( 'blockGap' => '2rem' ),
				),
				array(), // settings.spacing.blockGap defaults to null via _wp_array_get → skipped.
				array(
					'gap' => array( 'spacing', 'blockGap' ),
				),
				null,
				null,
				null,
				array(),
			),
		);
	}

	/**
	 * @dataProvider branchMatrixProvider
	 *
	 * @param array       $styles Styles.
	 * @param array       $settings Settings.
	 * @param array|null  $properties Properties.
	 * @param array|null  $theme_json Theme JSON.
	 * @param string|null $selector Selector.
	 * @param bool|null   $use_root_padding Root padding flag.
	 * @param array       $expected Expected declarations.
	 */
	public function testBranchMatrix(
		$styles,
		$settings,
		$properties,
		$theme_json,
		$selector,
		$use_root_padding,
		$expected
	): void {
		$this->assertSame(
			$expected,
			$this->compute( $styles, $settings, $properties, $theme_json, $selector, $use_root_padding )
		);
	}
}
