<?php

namespace Blockera\Editor\Tests;

use Blockera\Editor\StyleDefinitions\GridChildRowSpan;

/**
 * @covers \Blockera\Editor\StyleDefinitions\GridChildRowSpan
 * @covers \Blockera\Editor\StyleDefinitions\GridChildRowSpan::css
 * @covers \Blockera\Editor\StyleDefinitions\GridChildRowSpan::isImportant
 */
class GridChildRowSpanTest extends StyleDefinitionTestCase {

	protected string $definition_class = GridChildRowSpan::class;

	public function testReturnsEmptyOnGuards(): void {
		$definition = $this->definition();

		$this->assertSame( [], $this->invokeCss( $definition, [] ) );
		$this->assertSame( [], $this->invokeCss( $definition, [ 'type' => 'grid-column', 'grid-row' => 2 ] ) );
		$this->assertSame( [], $this->invokeCss( $definition, [ 'type' => 'grid-row' ] ) );
		$this->assertSame( [], $this->invokeCss( $definition, $this->typedSetting( 'grid-row', '' ) ) );
		$this->assertSame( [], $this->invokeCss( $definition, $this->typedSetting( 'grid-row', [] ) ) );
		$this->assertSame( [], $this->invokeCss( $definition, $this->typedSetting( 'grid-row', 0 ) ) );
	}

	public function testEmitsSpanWithImportant(): void {
		$result = $this->invokeCss(
			$this->definition(),
			$this->typedSetting( 'grid-row', 4 )
		);

		$this->assertSame( $this->cssMap( [ 'grid-row' => 'span 4 !important' ] ), $result );
	}
}
