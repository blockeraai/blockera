<?php

namespace Blockera\Editor\Tests;

use Blockera\Editor\StyleDefinitions\BaseStyleDefinition;
use Blockera\Editor\StyleDefinitions\Height;
use Blockera\Editor\StyleDefinitions\MaxHeight;
use Blockera\Editor\StyleDefinitions\MaxWidth;
use Blockera\Editor\StyleDefinitions\MinHeight;
use Blockera\Editor\StyleDefinitions\MinWidth;
use ReflectionMethod;

/**
 * @covers \Blockera\Editor\StyleDefinitions\Traits\WidthDefinitionTrait
 * @covers \Blockera\Editor\StyleDefinitions\Height
 * @covers \Blockera\Editor\StyleDefinitions\MinWidth
 * @covers \Blockera\Editor\StyleDefinitions\MinHeight
 * @covers \Blockera\Editor\StyleDefinitions\MaxHeight
 * @covers \Blockera\Editor\StyleDefinitions\MaxWidth
 */
class WidthDefinitionTraitTest extends \Blockera\Dev\PHPUnit\AppTestCase {

	/**
	 * @return array<string, array{0: class-string<BaseStyleDefinition>, 1: string, 2: bool}>
	 */
	public function consumerProvider(): array {
		return [
			'Height'    => [ Height::class, 'height', false ],
			'MinWidth'  => [ MinWidth::class, 'min-width', false ],
			'MinHeight' => [ MinHeight::class, 'min-height', false ],
			'MaxHeight' => [ MaxHeight::class, 'max-height', false ],
			'MaxWidth'  => [ MaxWidth::class, 'max-width', true ],
		];
	}

	/**
	 * @param class-string<BaseStyleDefinition> $class
	 * @return array<string, mixed>
	 */
	private function css( string $class, array $setting ): array {
		$m = new ReflectionMethod( $class, 'css' );
		$m->setAccessible( true );

		return $m->invoke( new $class( [] ), $setting );
	}

	/**
	 * @dataProvider consumerProvider
	 * @param class-string<BaseStyleDefinition> $class
	 */
	public function testEmitsPlainValue( string $class, string $property, bool $always_important ): void {
		$result = $this->css(
			$class,
			[
				'type'    => $property,
				$property => '100px',
			]
		);

		// MaxWidth forces isImportant(); setCss appends the suffix to values.
		$expected_value = $always_important ? '100px !important' : '100px';

		$this->assertSame( [ '' => [ $property => $expected_value ] ], $result );
	}

	/**
	 * @dataProvider consumerProvider
	 * @param class-string<BaseStyleDefinition> $class
	 */
	public function testStretchRewritesKey( string $class, string $property, bool $always_important ): void {
		$result = $this->css(
			$class,
			[
				'type'    => $property,
				$property => 'stretch',
			]
		);

		if ( $always_important ) {
			$expected_key   = $property . ': 100%; ' . $property . ': -moz-available !important;' . $property . ': -webkit-fill-available !important;' . $property;
			$expected_value = 'stretch !important';
		} else {
			$expected_key   = $property . ': 100%; ' . $property . ': -moz-available;' . $property . ': -webkit-fill-available;' . $property;
			$expected_value = 'stretch';
		}

		$this->assertSame( [ '' => [ $expected_key => $expected_value ] ], $result );
	}

	/**
	 * @dataProvider consumerProvider
	 * @param class-string<BaseStyleDefinition> $class
	 */
	public function testReturnsEmptyOnGuards( string $class, string $property, bool $always_important ): void {
		unset( $always_important );

		$this->assertSame( [], $this->css( $class, [] ) );
		$this->assertSame( [], $this->css( $class, [ 'type' => '' ] ) );
		$this->assertSame( [], $this->css( $class, [ 'type' => 'width', $property => '1px' ] ) );
		$this->assertSame( [], $this->css( $class, [ 'type' => $property ] ) );
		$this->assertSame( [], $this->css( $class, [ 'type' => $property, $property => '' ] ) );
	}

	/**
	 * @dataProvider consumerProvider
	 * @param class-string<BaseStyleDefinition> $class
	 */
	public function testResolvesValueAddon( string $class, string $property, bool $always_important ): void {
		$result = $this->css(
			$class,
			[
				'type'    => $property,
				$property => '0px',
			]
		);

		$expected_value = $always_important ? '0 !important' : '0';

		$this->assertSame( [ '' => [ $property => $expected_value ] ], $result );
	}
}
