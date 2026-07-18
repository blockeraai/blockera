<?php

namespace Blockera\Editor\Tests;

use Blockera\Editor\StyleDefinitions\FlexDirection;

/**
 * @covers \Blockera\Editor\StyleDefinitions\FlexDirection
 * @covers \Blockera\Editor\StyleDefinitions\FlexDirection::css
 */
class FlexDirectionTest extends StyleDefinitionTestCase {

	protected string $definition_class = FlexDirection::class;

	public function testReturnsEmptyOnGuards(): void {
		$definition = $this->definition();

		$this->assertSame( [], $this->invokeCss( $definition, [] ) );
		$this->assertSame( [], $this->invokeCss( $definition, [ 'type' => '' ] ) );
		$this->assertSame( [], $this->invokeCss( $definition, [ 'type' => 'gap' ] ) );
		$this->assertSame( [], $this->invokeCss( $definition, [ 'type' => 'flex-direction' ] ) );
		$this->assertSame(
			[],
			$this->invokeCss(
				$definition,
				[
					'type'           => 'flex-direction',
					'flex-direction' => 'row',
				]
			)
		);
	}

	public function testReturnsEmptyWhenDisplayIsNotFlexOrGrid(): void {
		$definition = $this->definition();
		$definition->setSettings( [ 'blockeraDisplay' => 'block' ] );

		$result = $this->invokeCss(
			$definition,
			[
				'type'           => 'flex-direction',
				'flex-direction' => [
					'direction' => 'row',
				],
			]
		);

		$this->assertSame( [], $result );
	}

	public function testEmitsDirectionAlignAndJustifyForFlexDisplay(): void {
		$definition = $this->definition();
		$definition->setSettings( [ 'blockeraDisplay' => 'flex' ] );

		$result = $this->invokeCss(
			$definition,
			[
				'type'           => 'flex-direction',
				'flex-direction' => [
					'direction'      => 'column',
					'alignItems'     => 'center',
					'justifyContent' => 'space-between',
				],
			]
		);

		$this->assertSame(
			$this->cssMap(
				[
					'flex-direction'  => 'column',
					'align-items'     => 'center !important',
					'justify-content' => 'space-between !important',
				]
			),
			$result
		);
	}

	public function testGridDisplayGateAllowsOutput(): void {
		$definition = $this->definition();
		$definition->setBlock(
			[
				'attrs' => [
					'blockeraDisplay' => 'grid',
				],
			]
		);

		$result = $this->invokeCss(
			$definition,
			[
				'type'           => 'flex-direction',
				'flex-direction' => [
					'direction' => 'row-reverse',
				],
			]
		);

		$this->assertSame( $this->cssMap( [ 'flex-direction' => 'row-reverse' ] ), $result );
	}

	public function testSkipsEmptyDirectionValues(): void {
		$definition = $this->definition();
		$definition->setSettings( [ 'blockeraDisplay' => 'flex' ] );

		$result = $this->invokeCss(
			$definition,
			[
				'type'           => 'flex-direction',
				'flex-direction' => [
					'direction'      => '',
					'alignItems'     => null,
					'justifyContent' => '',
				],
			]
		);

		$this->assertSame( [], $result );
	}
}
