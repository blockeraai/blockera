<?php

namespace Blockera\Editor\Tests;

use Blockera\Editor\StyleDefinitions\SelfOrigin;

/**
 * @covers \Blockera\Editor\StyleDefinitions\SelfOrigin
 * @covers \Blockera\Editor\StyleDefinitions\SelfOrigin::css
 */
class SelfOriginTest extends StyleDefinitionTestCase {

	protected string $definition_class = SelfOrigin::class;

	public function testReturnsEmptyOnGuards(): void {
		$definition = $this->definition();

		$this->assertSame( [], $this->invokeCss( $definition, [] ) );
		$this->assertSame( [], $this->invokeCss( $definition, [ 'type' => 'child-origin' ] ) );
		$this->assertSame( [], $this->invokeCss( $definition, [ 'type' => 'self-origin' ] ) );
		$this->assertSame(
			[],
			$this->invokeCss(
				$definition,
				[
					'type'        => 'self-origin',
					'self-origin' => [ 'top' => '50%' ],
				]
			)
		);
	}

	public function testSkipsDeclarationWhenTopOrLeftEmptyAfterResolution(): void {
		$this->assertSame(
			[],
			$this->invokeCss(
				$this->definition(),
				[
					'type'        => 'self-origin',
					'self-origin' => [
						'top'  => '',
						'left' => '50%',
					],
				]
			)
		);
	}

	public function testEmitsTransformOrigin(): void {
		$result = $this->invokeCss(
			$this->definition(),
			[
				'type'        => 'self-origin',
				'self-origin' => [
					'top'  => '0px',
					'left' => '100%',
				],
			]
		);

		$this->assertSame( $this->cssMap( [ 'transform-origin' => '0 100%' ] ), $result );
	}
}
