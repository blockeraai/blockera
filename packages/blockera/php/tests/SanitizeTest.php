<?php

namespace Blockera\Setup\Tests;

use Blockera\Setup\Compatibility\JSON;
use ReflectionMethod;

/**
 * Input/output contract tests for JSON::sanitize().
 *
 * Locks every branch so a performance refactor can prove identical results.
 *
 * @covers \Blockera\Setup\Compatibility\JSON::sanitize
 */
class SanitizeTest extends \Blockera\Dev\PHPUnit\AppTestCase {

	/**
	 * @var ReflectionMethod
	 */
	private ReflectionMethod $method;

	/**
	 * @var string[]
	 */
	private array $blocks = array( 'core/paragraph', 'core/group' );

	/**
	 * @var string[]
	 */
	private array $elements = array( 'link', 'heading', 'button', 'caption' );

	/**
	 * @var array<string, string[]>
	 */
	private array $variations = array(
		'core/group' => array( 'outline', 'default' ),
	);

	public function set_up(): void {
		parent::set_up();

		$this->method = new ReflectionMethod( JSON::class, 'sanitize' );
		$this->method->setAccessible( true );
	}

	/**
	 * @param mixed $input Input theme.json-like structure.
	 * @param array $valid_block_names Valid block names.
	 * @param array $valid_element_names Valid element names.
	 * @param array $valid_variations Valid variations per block.
	 * @return array
	 */
	private function sanitize(
		$input,
		$valid_block_names = null,
		$valid_element_names = null,
		$valid_variations = null
	): array {
		return $this->method->invoke(
			null,
			$input,
			null === $valid_block_names ? $this->blocks : $valid_block_names,
			null === $valid_element_names ? $this->elements : $valid_element_names,
			null === $valid_variations ? $this->variations : $valid_variations
		);
	}

	public function testNonArrayInputReturnsEmptyArray(): void {
		$this->assertSame( array(), $this->sanitize( null ) );
		$this->assertSame( array(), $this->sanitize( 'x' ) );
		$this->assertSame( array(), $this->sanitize( 0 ) );
		$this->assertSame( array(), $this->sanitize( false ) );
	}

	public function testEmptyArrayReturnsEmptyArray(): void {
		$this->assertSame( array(), $this->sanitize( array() ) );
	}

	public function testStripsInvalidTopLevelKeys(): void {
		$this->assertSame(
			array(
				'version' => 2,
				'title'   => 'T',
				'slug'    => 's',
			),
			$this->sanitize(
				array(
					'version' => 2,
					'title'   => 'T',
					'bogus'   => 1,
					'slug'    => 's',
				)
			)
		);
	}

	public function testStylesNotArrayIsUnsetFromOutput(): void {
		$this->assertSame(
			array(
				'version'  => 2,
				'settings' => array(
					'color' => array(
						'text' => true,
					),
				),
			),
			$this->sanitize(
				array(
					'version'  => 2,
					'styles'   => 'nope',
					'settings' => array(
						'color' => array(
							'text' => true,
						),
					),
				)
			)
		);
	}

	public function testSettingsNotArrayIsUnsetFromOutput(): void {
		$this->assertSame(
			array(
				'version' => 2,
				'styles'  => array(
					'color' => array(
						'text' => '#111',
					),
				),
			),
			$this->sanitize(
				array(
					'version'  => 2,
					'styles'   => array(
						'color' => array(
							'text' => '#111',
						),
					),
					'settings' => 'nope',
				)
			)
		);
	}

	public function testStylesEmptyAfterSchemaStripRemovesStylesKey(): void {
		$this->assertSame(
			array(
				'version' => 2,
			),
			$this->sanitize(
				array(
					'version' => 2,
					'styles'  => array(
						'notARealSection' => array(
							'x' => 1,
						),
					),
				)
			)
		);
	}

	public function testLinkPseudoSelectorsAndHeadingElement(): void {
		$this->assertSame(
			array(
				'styles' => array(
					'elements' => array(
						'link'    => array(
							'color'  => array(
								'text' => 'blue',
							),
							':hover' => array(
								'color' => array(
									'text' => 'red',
								),
							),
							':focus' => array(
								'color' => array(
									'text' => 'green',
								),
							),
						),
						'heading' => array(
							'color' => array(
								'text' => '#000',
							),
						),
					),
				),
			),
			$this->sanitize(
				array(
					'styles' => array(
						'elements' => array(
							'link'    => array(
								'color'  => array(
									'text' => 'blue',
								),
								':hover' => array(
									'color' => array(
										'text' => 'red',
									),
								),
								':focus' => array(
									'color' => array(
										'text' => 'green',
									),
								),
							),
							'heading' => array(
								'color' => array(
									'text' => '#000',
								),
							),
						),
					),
				)
			)
		);
	}

	public function testUnknownBlocksAreStripped(): void {
		$this->assertSame(
			array(
				'styles' => array(
					'blocks' => array(
						'core/paragraph' => array(
							'color'      => array(
								'text' => '#222',
							),
							'typography' => array(
								'fontSize' => '16px',
							),
						),
					),
				),
			),
			$this->sanitize(
				array(
					'styles' => array(
						'blocks' => array(
							'core/paragraph' => array(
								'color'      => array(
									'text' => '#222',
								),
								'typography' => array(
									'fontSize' => '16px',
								),
							),
							'core/unknown'   => array(
								'color' => array(
									'text' => 'nope',
								),
							),
						),
					),
				)
			)
		);
	}

	public function testVariationsMergeKeepsUserDefinedNames(): void {
		// Blockera uses array_merge (not intersect) so editor/user variation names are kept.
		$this->assertSame(
			array(
				'styles' => array(
					'blocks' => array(
						'core/group' => array(
							'variations' => array(
								'outline'     => array(
									'border' => array(
										'width' => '1px',
									),
								),
								'custom-user' => array(
									'color' => array(
										'text' => 'green',
									),
								),
							),
						),
					),
				),
			),
			$this->sanitize(
				array(
					'styles' => array(
						'blocks' => array(
							'core/group' => array(
								'variations' => array(
									'outline'     => array(
										'border' => array(
											'width' => '1px',
										),
									),
									'custom-user' => array(
										'color' => array(
											'text' => 'green',
										),
									),
								),
							),
						),
					),
				)
			)
		);
	}

	public function testVariationsSkippedWhenBlockHasNoValidVariationsMap(): void {
		$this->assertSame(
			array(),
			$this->sanitize(
				array(
					'styles' => array(
						'blocks' => array(
							'core/paragraph' => array(
								'variations' => array(
									'x' => array(
										'color' => array(
											'text' => 'a',
										),
									),
								),
							),
						),
					),
				),
				$this->blocks,
				$this->elements,
				array()
			)
		);
	}

	public function testEmptyVariationsArrayIsPreservedOnBlock(): void {
		$this->assertSame(
			array(
				'styles' => array(
					'blocks' => array(
						'core/group' => array(
							'variations' => array(),
						),
					),
				),
			),
			$this->sanitize(
				array(
					'styles' => array(
						'blocks' => array(
							'core/group' => array(
								'variations' => array(),
							),
						),
					),
				)
			)
		);
	}

	public function testResolveCustomCssFormatConvertsVarPreset(): void {
		$this->assertSame(
			array(
				'styles' => array(
					'color' => array(
						'background' => 'var(--wp--preset--color--base)',
						'text'       => '#111',
					),
				),
			),
			$this->sanitize(
				array(
					'styles' => array(
						'color' => array(
							'background' => 'var:preset|color|base',
							'text'       => '#111',
						),
					),
				)
			)
		);
	}

	public function testSettingsBlocksSchemaAllowsKnownBlocksOnly(): void {
		$this->assertSame(
			array(
				'settings' => array(
					'color'  => array(
						'palette' => array(
							array(
								'slug'  => 'base',
								'color' => '#fff',
								'name'  => 'Base',
							),
						),
					),
					'blocks' => array(
						'core/paragraph' => array(
							'color' => array(
								'text' => true,
							),
						),
					),
				),
			),
			$this->sanitize(
				array(
					'settings' => array(
						'color'  => array(
							'palette' => array(
								array(
									'slug'  => 'base',
									'color' => '#fff',
									'name'  => 'Base',
								),
							),
						),
						'blocks' => array(
							'core/paragraph' => array(
								'color' => array(
									'text' => true,
								),
							),
							'core/unknown'   => array(
								'color' => array(
									'text' => true,
								),
							),
						),
					),
				)
			)
		);
	}

	public function testTopLevelBlockGapAndPaddingPreserved(): void {
		$this->assertSame(
			array(
				'styles' => array(
					'spacing' => array(
						'blockGap' => '2rem',
						'padding'  => array(
							'top' => '8px',
						),
					),
				),
			),
			$this->sanitize(
				array(
					'styles' => array(
						'spacing' => array(
							'blockGap' => '2rem',
							'padding'  => array(
								'top' => '8px',
							),
						),
					),
				)
			)
		);
	}

	public function testEmptyValidBlockAndElementNamesStillSanitizesTopStyles(): void {
		$this->assertSame(
			array(
				'version' => 3,
				'styles'  => array(
					'color' => array(
						'text' => '#abc',
					),
				),
			),
			$this->sanitize(
				array(
					'version' => 3,
					'styles'  => array(
						'color' => array(
							'text' => '#abc',
						),
					),
				),
				array(),
				array(),
				array()
			)
		);
	}

	public function testMissingStylesAndSettingsLeavesOtherTopKeys(): void {
		$this->assertSame(
			array(
				'version' => 3,
				'title'   => 'Only meta',
			),
			$this->sanitize(
				array(
					'version' => 3,
					'title'   => 'Only meta',
				)
			)
		);
	}

	public function testVariationsNotArrayIsIgnoredForSchema(): void {
		$this->assertSame(
			array(
				'styles' => array(
					'blocks' => array(
						'core/group' => array(
							'color' => array(
								'text' => '#111',
							),
						),
					),
				),
			),
			$this->sanitize(
				array(
					'styles' => array(
						'blocks' => array(
							'core/group' => array(
								'color'      => array(
									'text' => '#111',
								),
								'variations' => 'not-an-array',
							),
						),
					),
				)
			)
		);
	}

	public function testFullMixedFixture(): void {
		$this->assertSame(
			array(
				'version'  => 3,
				'title'    => 'Test',
				'styles'   => array(
					'color'    => array(
						'text'       => '#111',
						'background' => 'var(--wp--preset--color--base)',
					),
					'spacing'  => array(
						'blockGap' => '1.5rem',
					),
					'elements' => array(
						'link' => array(
							'color'  => array(
								'text' => 'blue',
							),
							':hover' => array(
								'color' => array(
									'text' => 'red',
								),
							),
						),
					),
					'blocks'   => array(
						'core/paragraph' => array(
							'color' => array(
								'text' => '#222',
							),
						),
						'core/group'     => array(
							'variations' => array(
								'outline'     => array(
									'border' => array(
										'width' => '1px',
									),
								),
								'custom-user' => array(
									'color' => array(
										'text' => 'green',
									),
								),
							),
						),
					),
				),
				'settings' => array(
					'color'  => array(
						'palette' => array(
							array(
								'slug'  => 'base',
								'color' => '#fff',
								'name'  => 'Base',
							),
						),
					),
					'blocks' => array(
						'core/paragraph' => array(
							'color' => array(
								'text' => true,
							),
						),
					),
				),
			),
			$this->sanitize(
				array(
					'version'     => 3,
					'title'       => 'Test',
					'invalidTop'  => 1,
					'styles'      => array(
						'color'    => array(
							'text'       => '#111',
							'background' => 'var:preset|color|base',
						),
						'spacing'  => array(
							'blockGap' => '1.5rem',
						),
						'elements' => array(
							'link' => array(
								'color'  => array(
									'text' => 'blue',
								),
								':hover' => array(
									'color' => array(
										'text' => 'red',
									),
								),
							),
						),
						'blocks'   => array(
							'core/paragraph' => array(
								'color' => array(
									'text' => '#222',
								),
							),
							'core/group'     => array(
								'variations' => array(
									'outline'     => array(
										'border' => array(
											'width' => '1px',
										),
									),
									'custom-user' => array(
										'color' => array(
											'text' => 'green',
										),
									),
								),
							),
							'core/unknown'   => array(
								'color' => array(
									'text' => 'nope',
								),
							),
						),
					),
					'settings'    => array(
						'color'  => array(
							'palette' => array(
								array(
									'slug'  => 'base',
									'color' => '#fff',
									'name'  => 'Base',
								),
							),
						),
						'blocks' => array(
							'core/paragraph' => array(
								'color' => array(
									'text' => true,
								),
							),
						),
					),
				)
			)
		);
	}

	public function testNestedVariationInnerBlocksAndElements(): void {
		$this->assertSame(
			array(
				'styles' => array(
					'blocks' => array(
						'core/group'   => array(
							'variations' => array(
								'outline' => array(
									'color'    => array(
										'text' => 'red',
									),
									'blocks'   => array(
										'core/paragraph' => array(
											'color' => array(
												'text' => 'blue',
											),
										),
									),
									'elements' => array(
										'link' => array(
											'color' => array(
												'text' => 'green',
											),
										),
									),
								),
							),
						),
						'core/columns' => array(
							'variations' => array(
								'default' => array(
									'color' => array(
										'background' => '#eee',
									),
								),
							),
						),
					),
				),
			),
			$this->sanitize(
				array(
					'styles' => array(
						'blocks' => array(
							'core/group'   => array(
								'variations' => array(
									'outline' => array(
										'color'    => array(
											'text' => 'red',
										),
										'blocks'   => array(
											'core/paragraph' => array(
												'color' => array(
													'text' => 'blue',
												),
											),
											'core/columns'   => array(
												'variations' => array(
													'default' => array(
														'spacing' => array(
															'padding' => array(
																'top' => '1px',
															),
														),
													),
												),
											),
										),
										'elements' => array(
											'link' => array(
												'color' => array(
													'text' => 'green',
												),
											),
										),
									),
								),
							),
							'core/columns' => array(
								'variations' => array(
									'default' => array(
										'color' => array(
											'background' => '#eee',
										),
									),
								),
							),
						),
					),
				),
				array( 'core/paragraph', 'core/group', 'core/columns' ),
				array( 'link' ),
				array(
					'core/group'   => array( 'outline' ),
					'core/columns' => array( 'default' ),
				)
			)
		);
	}

	/**
	 * @dataProvider branchMatrixProvider
	 *
	 * @param mixed $input Input.
	 * @param array $blocks Blocks.
	 * @param array $elements Elements.
	 * @param array $variations Variations.
	 * @param array $expected Expected output.
	 */
	public function testBranchMatrix( $input, $blocks, $elements, $variations, $expected ): void {
		$this->assertSame(
			$expected,
			$this->sanitize( $input, $blocks, $elements, $variations )
		);
	}

	/**
	 * @return array<string, array{0:mixed,1:array,2:array,3:array,4:array}>
	 */
	public function branchMatrixProvider(): array {
		$blocks     = array( 'core/paragraph', 'core/group' );
		$elements   = array( 'link', 'heading' );
		$variations = array( 'core/group' => array( 'outline' ) );

		return array(
			'only_settings'           => array(
				array(
					'settings' => array(
						'color' => array(
							'text' => true,
						),
					),
				),
				$blocks,
				$elements,
				$variations,
				array(
					'settings' => array(
						'color' => array(
							'text' => true,
						),
					),
				),
			),
			'settings_empty_stripped' => array(
				array(
					'version'  => 2,
					'settings' => array(
						'notValid' => array(
							'x' => 1,
						),
					),
				),
				$blocks,
				$elements,
				$variations,
				array(
					'version' => 2,
				),
			),
			'button_element_pseudos'  => array(
				array(
					'styles' => array(
						'elements' => array(
							'button' => array(
								'color'  => array(
									'text' => '#fff',
								),
								':hover' => array(
									'color' => array(
										'background' => '#000',
									),
								),
							),
						),
					),
				),
				$blocks,
				array( 'button' ),
				$variations,
				array(
					'styles' => array(
						'elements' => array(
							'button' => array(
								'color'  => array(
									'text' => '#fff',
								),
								':hover' => array(
									'color' => array(
										'background' => '#000',
									),
								),
							),
						),
					),
				),
			),
		);
	}
}
