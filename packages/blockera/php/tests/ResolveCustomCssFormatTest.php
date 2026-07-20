<?php

namespace Blockera\Setup\Tests;

use Blockera\Setup\Compatibility\JSON;
use ReflectionMethod;

/**
 * Input/output contract tests for JSON::resolve_custom_css_format().
 *
 * Locks every branch so a performance refactor can prove identical results.
 *
 * @covers \Blockera\Setup\Compatibility\JSON::resolve_custom_css_format
 */
class ResolveCustomCssFormatTest extends \Blockera\Dev\PHPUnit\AppTestCase {

	/**
	 * @var ReflectionMethod
	 */
	private ReflectionMethod $method;

	public function set_up(): void {
		parent::set_up();

		$this->method = new ReflectionMethod( JSON::class, 'resolve_custom_css_format' );
		$this->method->setAccessible( true );
	}

	/**
	 * @param array $tree Input tree (copied before invoke when needed).
	 * @return array
	 */
	private function resolve( array $tree ): array {
		return $this->method->invoke( null, $tree );
	}

	public function testEmptyArrayReturnsEmptyArray(): void {
		$this->assertSame( array(), $this->resolve( array() ) );
	}

	public function testPlainStringsUnchanged(): void {
		$input = array(
			'color' => array(
				'text'       => '#111',
				'background' => 'red',
			),
		);

		$this->assertSame( $input, $this->resolve( $input ) );
	}

	public function testVarPresetConverted(): void {
		$this->assertSame(
			array(
				'color' => array(
					'background' => 'var(--wp--preset--color--base)',
				),
			),
			$this->resolve(
				array(
					'color' => array(
						'background' => 'var:preset|color|base',
					),
				)
			)
		);
	}

	public function testVarCustomPathConverted(): void {
		$this->assertSame(
			array(
				'spacing' => array(
					'padding' => array(
						'top' => 'var(--wp--custom--spacing--gap)',
					),
				),
			),
			$this->resolve(
				array(
					'spacing' => array(
						'padding' => array(
							'top' => 'var:custom|spacing|gap',
						),
					),
				)
			)
		);
	}

	public function testVarWithoutPipesConverted(): void {
		$this->assertSame(
			array(
				'x' => 'var(--wp--preset)',
			),
			$this->resolve(
				array(
					'x' => 'var:preset',
				)
			)
		);
	}

	public function testVarPrefixOnlyConverted(): void {
		$this->assertSame(
			array(
				'x' => 'var(--wp--)',
			),
			$this->resolve(
				array(
					'x' => 'var:',
				)
			)
		);
	}

	public function testAlreadyCssVarLeftUnchanged(): void {
		$input = array(
			'x' => 'var(--wp--preset--color--base)',
		);

		$this->assertSame( $input, $this->resolve( $input ) );
	}

	public function testShortStringsNotTreatedAsVarPrefix(): void {
		$input = array(
			'a' => 'var',
			'b' => 'va',
			'c' => 'v',
			'd' => '',
		);

		$this->assertSame( $input, $this->resolve( $input ) );
	}

	public function testNonStringScalarsLeftUnchanged(): void {
		$this->assertSame(
			array(
				'i' => 1,
				'f' => 1.5,
				'b' => true,
				'n' => null,
				's' => 'var(--wp--preset--color--contrast)',
			),
			$this->resolve(
				array(
					'i' => 1,
					'f' => 1.5,
					'b' => true,
					'n' => null,
					's' => 'var:preset|color|contrast',
				)
			)
		);
	}

	public function testDeepNestingConverted(): void {
		$this->assertSame(
			array(
				'a' => array(
					'b' => array(
						'c' => array(
							'd' => 'var(--wp--preset--font-size--medium)',
						),
					),
				),
			),
			$this->resolve(
				array(
					'a' => array(
						'b' => array(
							'c' => array(
								'd' => 'var:preset|font-size|medium',
							),
						),
					),
				)
			)
		);
	}

	public function testNumericListArraysConverted(): void {
		$this->assertSame(
			array(
				'palette' => array(
					array(
						'color' => 'var(--wp--preset--color--base)',
					),
					array(
						'color' => '#fff',
					),
				),
			),
			$this->resolve(
				array(
					'palette' => array(
						array(
							'color' => 'var:preset|color|base',
						),
						array(
							'color' => '#fff',
						),
					),
				)
			)
		);
	}

	public function testDuplicateTokensResolveIdentically(): void {
		$this->assertSame(
			array(
				'a' => 'var(--wp--preset--color--base)',
				'b' => array(
					'c' => 'var(--wp--preset--color--base)',
				),
			),
			$this->resolve(
				array(
					'a' => 'var:preset|color|base',
					'b' => array(
						'c' => 'var:preset|color|base',
					),
				)
			)
		);
	}

	public function testCaseSensitivePrefix(): void {
		$input = array(
			'x' => 'Var:preset|color|base',
		);

		$this->assertSame( $input, $this->resolve( $input ) );
	}

	public function testNestedEmptyArraysPreserved(): void {
		$input = array(
			'a' => array(),
			'b' => array(
				'c' => array(),
			),
		);

		$this->assertSame( $input, $this->resolve( $input ) );
	}

	public function testReturnsConvertedTree(): void {
		// Parameter is by-value (COW); callers must use the returned array (same as sanitize()).
		$tree = array(
			'color' => array(
				'text' => 'var:preset|color|base',
			),
		);

		$result = $this->resolve( $tree );

		$this->assertSame(
			array(
				'color' => array(
					'text' => 'var(--wp--preset--color--base)',
				),
			),
			$result
		);
	}

	public function testMultiplePipesBecomeDoubleDashes(): void {
		$this->assertSame(
			array(
				'x' => 'var(--wp--preset--color--vivid-green-cyan)',
			),
			$this->resolve(
				array(
					'x' => 'var:preset|color|vivid-green-cyan',
				)
			)
		);
	}

	public function testRealisticThemeJsonFragment(): void {
		$this->assertSame(
			array(
				'color'    => array(
					'text'       => '#111111',
					'background' => 'var(--wp--preset--color--base)',
					'gradient'   => 'var(--wp--preset--gradient--vivid-cyan-blue-to-vivid-purple)',
				),
				'typography' => array(
					'fontSize'   => 'var(--wp--preset--font-size--medium)',
					'fontFamily' => 'var(--wp--preset--font-family--system-sans)',
					'fontWeight' => '400',
				),
				'spacing'  => array(
					'padding'  => array(
						'top' => 'var(--wp--preset--spacing--40)',
					),
					'blockGap' => '1.5rem',
				),
				'elements' => array(
					'link' => array(
						'color'  => array(
							'text' => 'var(--wp--preset--color--secondary)',
						),
						':hover' => array(
							'color' => array(
								'text' => 'var(--wp--preset--color--primary)',
							),
						),
					),
				),
			),
			$this->resolve(
				array(
					'color'    => array(
						'text'       => '#111111',
						'background' => 'var:preset|color|base',
						'gradient'   => 'var:preset|gradient|vivid-cyan-blue-to-vivid-purple',
					),
					'typography' => array(
						'fontSize'   => 'var:preset|font-size|medium',
						'fontFamily' => 'var:preset|font-family|system-sans',
						'fontWeight' => '400',
					),
					'spacing'  => array(
						'padding'  => array(
							'top' => 'var:preset|spacing|40',
						),
						'blockGap' => '1.5rem',
					),
					'elements' => array(
						'link' => array(
							'color'  => array(
								'text' => 'var:preset|color|secondary',
							),
							':hover' => array(
								'color' => array(
									'text' => 'var:preset|color|primary',
								),
							),
						),
					),
				)
			)
		);
	}

	/**
	 * @dataProvider branchMatrixProvider
	 *
	 * @param array $input Input tree.
	 * @param array $expected Expected tree.
	 */
	public function testBranchMatrix( array $input, array $expected ): void {
		$this->assertSame( $expected, $this->resolve( $input ) );
	}

	/**
	 * @return array<string, array{0:array,1:array}>
	 */
	public function branchMatrixProvider(): array {
		return array(
			'leading_var_false_positive_guard' => array(
				array( 'x' => 'variable' ),
				array( 'x' => 'variable' ),
			),
			'var_with_trailing_pipe'           => array(
				array( 'x' => 'var:preset|color|' ),
				array( 'x' => 'var(--wp--preset--color--)' ),
			),
			'sibling_mixed'                   => array(
				array(
					'a' => 'nope',
					'b' => 'var:preset|color|base',
					'c' => array( 'd' => 0 ),
				),
				array(
					'a' => 'nope',
					'b' => 'var(--wp--preset--color--base)',
					'c' => array( 'd' => 0 ),
				),
			),
		);
	}
}
