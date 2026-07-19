<?php

namespace Blockera\Editor\Tests;

use Blockera\Editor\StyleDefinitions\GridLayout;

/**
 * @covers \Blockera\Editor\StyleDefinitions\GridLayout
 */
class GridLayoutTest extends StyleDefinitionTestCase {

	protected string $definition_class = GridLayout::class;

	private function gridDefinition( array $attrs = [], string $display = 'grid' ): GridLayout {
		$definition = $this->definition();
		$definition->setBreakpoint( 'desktop' );
		$definition->setSettings( [ 'blockeraDisplay' => $display ] );
		$definition->setBlock(
			[
				'blockName' => 'core/group',
				'attrs'     => $attrs,
			]
		);

		return $definition;
	}

	public function testReturnsEmptyWhenDisplayNotGrid(): void {
		$definition = $this->gridDefinition( [], 'flex' );

		$this->assertSame( [], $this->invokeCss( $definition, [ 'type' => 'grid-template-columns' ] ) );
	}

	public function testAutoFillWithMinWidthAndColumnCount(): void {
		$definition = $this->gridDefinition(
			[
				'blockeraGridMinimumColumnWidth' => [ 'value' => '12rem' ],
				'blockeraGridColumnCount'        => [ 'value' => 3 ],
				'blockeraGap'                    => [
					'value' => [
						'lock' => true,
						'gap'  => '1.2rem',
					],
				],
			]
		);

		$result = $this->invokeCss( $definition, [ 'type' => 'grid' ] );

		$this->assertArrayHasKey( '', $result );
		$this->assertStringContainsString( 'repeat(auto-fill, minmax(', $result['']['grid-template-columns'] );
		$this->assertSame( 'inline-size !important', $result['']['container-type'] );
	}

	public function testFixedRepeatWhenOnlyColumnCount(): void {
		$definition = $this->gridDefinition(
			[
				'blockeraGridColumnCount' => [ 'value' => 4 ],
			]
		);

		$result = $this->invokeCss( $definition, [ 'type' => 'grid' ] );

		$this->assertSame(
			$this->cssMap(
				[
					'grid-template-columns' => 'repeat(4, minmax(0, 1fr)) !important',
				]
			),
			$result
		);
	}

	public function testDefaultAutoFillWhenNoCount(): void {
		$definition = $this->gridDefinition(
			[
				'blockeraGridMinimumColumnWidth' => '10rem',
			]
		);

		$result = $this->invokeCss( $definition, [ 'type' => 'grid' ] );

		$this->assertStringContainsString( 'minmax(min(10rem, 100%), 1fr)', $result['']['grid-template-columns'] );
		$this->assertSame( 'inline-size !important', $result['']['container-type'] );
	}
}
