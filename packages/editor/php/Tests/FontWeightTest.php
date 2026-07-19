<?php

namespace Blockera\Editor\Tests;

use Blockera\Editor\StyleDefinitions\FontWeight;

/**
 * @covers \Blockera\Editor\StyleDefinitions\FontWeight
 * @covers \Blockera\Editor\StyleDefinitions\FontWeight::css
 */
class FontWeightTest extends StyleDefinitionTestCase {

	protected string $definition_class = FontWeight::class;

	public function testReturnsEmptyOnGuards(): void {
		$definition = $this->definition();

		$this->assertSame( [], $this->invokeCss( $definition, [] ) );
		$this->assertSame( [], $this->invokeCss( $definition, [ 'type' => 'font-style' ] ) );
		$this->assertSame( [], $this->invokeCss( $definition, [ 'type' => 'font-weight' ] ) );
		$this->assertSame(
			[],
			$this->invokeCss(
				$definition,
				[
					'type'        => 'font-weight',
					'font-weight' => [],
				]
			)
		);
	}

	public function testEmitsWeightOnly(): void {
		$result = $this->invokeCss(
			$this->definition(),
			[
				'type'        => 'font-weight',
				'font-weight' => [ 'weight' => '700' ],
			]
		);

		$this->assertSame( $this->cssMap( [ 'font-weight' => '700' ] ), $result );
	}

	public function testEmitsStyleOnly(): void {
		$result = $this->invokeCss(
			$this->definition(),
			[
				'type'        => 'font-weight',
				'font-weight' => [ 'style' => 'italic' ],
			]
		);

		$this->assertSame( $this->cssMap( [ 'font-style' => 'italic' ] ), $result );
	}

	public function testEmitsWeightAndStyle(): void {
		$result = $this->invokeCss(
			$this->definition(),
			[
				'type'        => 'font-weight',
				'font-weight' => [
					'weight' => '600',
					'style'  => 'normal',
				],
			]
		);

		$this->assertSame(
			$this->cssMap(
				[
					'font-weight' => '600',
					'font-style'  => 'normal',
				]
			),
			$result
		);
	}
}
