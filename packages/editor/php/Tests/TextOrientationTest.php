<?php

namespace Blockera\Editor\Tests;

use Blockera\Editor\StyleDefinitions\TextOrientation;

/**
 * @covers \Blockera\Editor\StyleDefinitions\TextOrientation
 * @covers \Blockera\Editor\StyleDefinitions\TextOrientation::css
 */
class TextOrientationTest extends StyleDefinitionTestCase {

	protected string $definition_class = TextOrientation::class;

	public function testReturnsEmptyOnGuards(): void {
		$definition = $this->definition();

		$this->assertSame( [], $this->invokeCss( $definition, [] ) );
		$this->assertSame( [], $this->invokeCss( $definition, [ 'type' => 'writing-mode' ] ) );
		$this->assertSame( [], $this->invokeCss( $definition, [ 'type' => 'text-orientation' ] ) );
	}

	public function testReturnsEmptyForUnknownStyle(): void {
		$this->assertSame(
			[],
			$this->invokeCss(
				$this->definition(),
				$this->typedSetting( 'text-orientation', 'unknown-style' )
			)
		);
	}

	/**
	 * @return array<string, array{0: string, 1: array<string, string>}>
	 */
	public function styleProvider(): array {
		return [
			'style-1' => [
				'style-1',
				[
					'writing-mode'     => 'vertical-lr',
					'text-orientation' => 'mixed',
				],
			],
			'style-2' => [
				'style-2',
				[
					'writing-mode'     => 'vertical-rl',
					'text-orientation' => 'mixed',
				],
			],
			'style-3' => [
				'style-3',
				[
					'writing-mode'     => 'vertical-lr',
					'text-orientation' => 'upright',
				],
			],
			'style-4' => [
				'style-4',
				[
					'writing-mode'     => 'vertical-rl',
					'text-orientation' => 'upright',
				],
			],
			'initial' => [
				'initial',
				[
					'writing-mode'     => 'horizontal-tb',
					'text-orientation' => 'mixed',
				],
			],
		];
	}

	/**
	 * @dataProvider styleProvider
	 * @param array<string, string> $expected
	 */
	public function testEmitsLookupDeclarations( string $style, array $expected ): void {
		$result = $this->invokeCss(
			$this->definition(),
			$this->typedSetting( 'text-orientation', $style )
		);

		$this->assertSame( $this->cssMap( $expected ), $result );
	}
}
