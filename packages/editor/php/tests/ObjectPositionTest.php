<?php

namespace Blockera\Editor\Tests;

use Blockera\Editor\StyleDefinitions\ObjectPosition;

/**
 * @covers \Blockera\Editor\StyleDefinitions\ObjectPosition
 * @covers \Blockera\Editor\StyleDefinitions\ObjectPosition::css
 */
class ObjectPositionTest extends StyleDefinitionTestCase {

	protected string $definition_class = ObjectPosition::class;

	public function testReturnsEmptyOnGuards(): void {
		$definition = $this->definition();

		$this->assertSame( [], $this->invokeCss( $definition, [] ) );
		$this->assertSame( [], $this->invokeCss( $definition, [ 'type' => 'object-fit' ] ) );
		$this->assertSame( [], $this->invokeCss( $definition, [ 'type' => 'object-position' ] ) );
		$this->assertSame(
			[],
			$this->invokeCss(
				$definition,
				[
					'type'             => 'object-position',
					'object-position'  => [ 'top' => '50%' ],
				]
			)
		);
		$this->assertSame(
			[],
			$this->invokeCss(
				$definition,
				[
					'type'            => 'object-position',
					'object-position' => null,
				]
			)
		);
	}

	public function testEmitsTopAndLeftCombined(): void {
		$result = $this->invokeCss(
			$this->definition(),
			[
				'type'            => 'object-position',
				'object-position' => [
					'top'  => '50%',
					'left' => '25%',
				],
			]
		);

		$this->assertSame( $this->cssMap( [ 'object-position' => '50% 25%' ] ), $result );
	}
}
