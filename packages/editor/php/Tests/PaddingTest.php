<?php

namespace Blockera\Editor\Tests;

use Blockera\Editor\StyleDefinitions\Padding;
use ReflectionMethod;

/**
 * @covers \Blockera\Editor\StyleDefinitions\Padding
 * @covers \Blockera\Editor\StyleDefinitions\Padding::css
 */
class PaddingTest extends \Blockera\Dev\PHPUnit\AppTestCase {

	private ReflectionMethod $method;

	public function set_up(): void {
		parent::set_up();
		$this->method = new ReflectionMethod( Padding::class, 'css' );
		$this->method->setAccessible( true );
	}

	/**
	 * Fresh Padding instance. Empty id keeps setCss() from resolving block selectors.
	 */
	private function definition(): Padding {
		return new Padding( [] );
	}

	/**
	 * @param array<string, mixed> $setting
	 * @return array<string, mixed>
	 */
	private function css( Padding $definition, array $setting ): array {
		return $this->method->invoke( $definition, $setting );
	}

	/**
	 * @param array<string, string> $sides
	 * @return array<string, mixed>
	 */
	private function setting( array $sides, string $type = 'padding' ): array {
		return [
			'type' => $type,
			$type  => [
				'padding' => $sides,
			],
		];
	}

	public function testReturnsEmptyWhenTypeMissing(): void {
		$definition = $this->definition();

		$this->assertSame( [], $this->css( $definition, [] ) );
		$this->assertSame( [], $this->css( $definition, [ 'padding' => [ 'padding' => [ 'top' => '1px' ] ] ] ) );
	}

	public function testReturnsEmptyWhenTypeIsEmptyString(): void {
		$definition = $this->definition();

		$this->assertSame(
			[],
			$this->css(
				$definition,
				[
					'type'    => '',
					'padding' => [
						'padding' => [
							'top'    => '1px',
							'right'  => '2px',
							'bottom' => '3px',
							'left'   => '4px',
						],
					],
				]
			)
		);
	}

	public function testReturnsEmptyWhenPaddingKeyMissing(): void {
		$definition = $this->definition();

		$this->assertSame(
			[],
			$this->css(
				$definition,
				[
					'type'    => 'padding',
					'padding' => [
						'margin' => [
							'top' => '1px',
						],
					],
				]
			)
		);

		$this->assertSame(
			[],
			$this->css(
				$definition,
				[
					'type'    => 'padding',
					'padding' => [],
				]
			)
		);
	}

	public function testReturnsEmptyWhenPaddingIsNotArray(): void {
		$definition = $this->definition();

		$this->assertSame(
			[],
			$this->css(
				$definition,
				[
					'type'    => 'padding',
					'padding' => [
						'padding' => '10px',
					],
				]
			)
		);

		$this->assertSame(
			[],
			$this->css(
				$definition,
				[
					'type'    => 'padding',
					'padding' => [
						'padding' => null,
					],
				]
			)
		);
	}

	public function testShorthandWhenAllFourSidesPresent(): void {
		$definition = $this->definition();

		$result = $this->css(
			$definition,
			$this->setting(
				[
					'top'    => '10px',
					'right'  => '15px',
					'bottom' => '20px',
					'left'   => '25px',
				]
			)
		);

		$this->assertSame(
			[
				'' => [
					'padding' => '10px 15px 20px 25px',
				],
			],
			$result
		);
	}

	public function testShorthandResolvesValueAddons(): void {
		$definition = $this->definition();

		$result = $this->css(
			$definition,
			$this->setting(
				[
					'top'    => '0px',
					'right'  => '10pxfunc',
					'bottom' => '20px',
					'left'   => [
						'isValueAddon' => true,
						'valueType'    => 'variable',
						'settings'     => [
							'var'   => '--wp--preset--spacing--40',
							'value' => '1rem',
						],
					],
				]
			)
		);

		$this->assertSame(
			[
				'' => [
					'padding' => '0 10px 20px var(--wp--preset--spacing--40, 1rem)',
				],
			],
			$result
		);
	}

	public function testShorthandWithNumericSides(): void {
		$definition = $this->definition();

		$result = $this->css(
			$definition,
			$this->setting(
				[
					'top'    => 0,
					'right'  => 1,
					'bottom' => 2,
					'left'   => 3,
				]
			)
		);

		$this->assertSame(
			[
				'' => [
					'padding' => '0 1 2 3',
				],
			],
			$result
		);
	}

	public function testPartialOnlyTop(): void {
		$definition = $this->definition();

		$result = $this->css(
			$definition,
			$this->setting(
				[
					'top' => '8px',
				]
			)
		);

		$this->assertSame(
			[
				'' => [
					'padding-top' => '8px',
				],
			],
			$result
		);
	}

	public function testPartialOnlyRight(): void {
		$definition = $this->definition();

		$result = $this->css(
			$definition,
			$this->setting(
				[
					'right' => '12px',
				]
			)
		);

		$this->assertSame(
			[
				'' => [
					'padding-right' => '12px',
				],
			],
			$result
		);
	}

	public function testPartialOnlyBottom(): void {
		$definition = $this->definition();

		$result = $this->css(
			$definition,
			$this->setting(
				[
					'bottom' => '16px',
				]
			)
		);

		$this->assertSame(
			[
				'' => [
					'padding-bottom' => '16px',
				],
			],
			$result
		);
	}

	public function testPartialOnlyLeft(): void {
		$definition = $this->definition();

		$result = $this->css(
			$definition,
			$this->setting(
				[
					'left' => '4px',
				]
			)
		);

		$this->assertSame(
			[
				'' => [
					'padding-left' => '4px',
				],
			],
			$result
		);
	}

	public function testPartialMultipleSidesSkipsEmptyStrings(): void {
		$definition = $this->definition();

		$result = $this->css(
			$definition,
			$this->setting(
				[
					'top'    => '1px',
					'right'  => '',
					'bottom' => '3px',
					'left'   => '',
				]
			)
		);

		$this->assertSame(
			[
				'' => [
					'padding-top'    => '1px',
					'padding-bottom' => '3px',
				],
			],
			$result
		);
	}

	public function testAllEmptySidesDoesNotSetCss(): void {
		$definition = $this->definition();

		$result = $this->css(
			$definition,
			$this->setting(
				[
					'top'    => '',
					'right'  => '',
					'bottom' => '',
					'left'   => '',
				]
			)
		);

		$this->assertSame( [], $result );
	}

	public function testEmptyPaddingArrayDoesNotSetCss(): void {
		$definition = $this->definition();

		$result = $this->css( $definition, $this->setting( [] ) );

		$this->assertSame( [], $result );
	}

	public function testCustomTypeKeyIsRespected(): void {
		$definition = $this->definition();

		$result = $this->css(
			$definition,
			[
				'type'           => 'spacing',
				'spacing'        => [
					'padding' => [
						'top'    => '2px',
						'right'  => '4px',
						'bottom' => '6px',
						'left'   => '8px',
					],
				],
			]
		);

		$this->assertSame(
			[
				'' => [
					'padding' => '2px 4px 6px 8px',
				],
			],
			$result
		);
	}

	public function testMissingSideKeysAreTreatedAsEmpty(): void {
		$definition = $this->definition();

		$result = $this->css(
			$definition,
			$this->setting(
				[
					'top'   => '5px',
					'left'  => '7px',
					// right/bottom intentionally omitted.
				]
			)
		);

		$this->assertSame(
			[
				'' => [
					'padding-top'  => '5px',
					'padding-left' => '7px',
				],
			],
			$result
		);
	}

	public function testThreeSidesUsesLonghandNotShorthand(): void {
		$definition = $this->definition();

		$result = $this->css(
			$definition,
			$this->setting(
				[
					'top'    => '1px',
					'right'  => '2px',
					'bottom' => '3px',
					// left missing → not shorthand.
				]
			)
		);

		$this->assertSame(
			[
				'' => [
					'padding-top'    => '1px',
					'padding-right'  => '2px',
					'padding-bottom' => '3px',
				],
			],
			$result
		);
	}
}
