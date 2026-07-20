<?php

namespace Blockera\Editor\Tests;

use Blockera\Editor\StyleDefinitions\ChildOrigin;

/**
 * @covers \Blockera\Editor\StyleDefinitions\ChildOrigin
 * @covers \Blockera\Editor\StyleDefinitions\ChildOrigin::css
 */
class ChildOriginTest extends StyleDefinitionTestCase {

	protected string $definition_class = ChildOrigin::class;

	public function testReturnsStoredCssWhenTypeWrong(): void {
		$this->assertSame( [], $this->invokeCss( $this->definition(), [] ) );
		$this->assertSame( [], $this->invokeCss( $this->definition(), [ 'type' => 'self-origin' ] ) );
	}

	public function testReturnsStoredCssWhenValueMissingOrInvalid(): void {
		$definition = $this->definition();

		$this->assertSame( [], $this->invokeCss( $definition, [ 'type' => 'child-origin' ] ) );
		$this->assertSame(
			[],
			$this->invokeCss(
				$definition,
				[
					'type'         => 'child-origin',
					'child-origin' => 'invalid',
				]
			)
		);
		$this->assertSame(
			[],
			$this->invokeCss(
				$definition,
				[
					'type'         => 'child-origin',
					'child-origin' => [ 'top' => '50%' ],
				]
			)
		);
	}

	public function testSkipsDeclarationWhenTopOrLeftEmpty(): void {
		$this->assertSame(
			[],
			$this->invokeCss(
				$this->definition(),
				[
					'type'         => 'child-origin',
					'child-origin' => [
						'top'  => '',
						'left' => '50%',
					],
				]
			)
		);
	}

	public function testEmitsPerspectiveOrigin(): void {
		$result = $this->invokeCss(
			$this->definition(),
			[
				'type'         => 'child-origin',
				'child-origin' => [
					'top'  => '50%',
					'left' => '25%',
				],
			]
		);

		$this->assertSame( $this->cssMap( [ 'perspective-origin' => '50% 25%' ] ), $result );
	}
}
