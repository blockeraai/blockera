<?php

namespace Blockera\Editor\Tests;

use Blockera\Editor\StyleDefinitions\Position;

/**
 * @covers \Blockera\Editor\StyleDefinitions\Position
 * @covers \Blockera\Editor\StyleDefinitions\Position::css
 */
class PositionTest extends StyleDefinitionTestCase {

	protected string $definition_class = Position::class;

	public function testReturnsEmptyOnGuards(): void {
		$definition = $this->definition();

		$this->assertSame( [], $this->invokeCss( $definition, [] ) );
		$this->assertSame( [], $this->invokeCss( $definition, [ 'type' => 'margin' ] ) );
		$this->assertSame( [], $this->invokeCss( $definition, [ 'type' => 'position' ] ) );
		$this->assertSame(
			[],
			$this->invokeCss(
				$definition,
				[
					'type'     => 'position',
					'position' => [
						'type' => 'absolute',
					],
				]
			)
		);
		$this->assertSame(
			[],
			$this->invokeCss(
				$definition,
				[
					'type'     => 'position',
					'position' => [
						'position' => 'not-array',
					],
				]
			)
		);
	}

	public function testEmitsPositionAndTruthyOffsets(): void {
		$definition = $this->definition();

		$result = $this->invokeCss(
			$definition,
			[
				'type'     => 'position',
				'position' => [
					'type'     => 'absolute',
					'position' => [
						'top'    => '10px',
						'right'  => '',
						'bottom' => '0',
						'left'   => '5pxfunc',
					],
				],
			]
		);

		$this->assertSame(
			$this->cssMap(
				[
					'position' => 'absolute',
					'top'      => '10px',
					'left'     => '5px',
				]
			),
			$result
		);
	}
}
