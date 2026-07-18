<?php

namespace Blockera\Editor\Tests;

use Blockera\Editor\StyleDefinitions\GridChildColumnSpan;

/**
 * @covers \Blockera\Editor\StyleDefinitions\GridChildColumnSpan
 * @covers \Blockera\Editor\StyleDefinitions\GridChildColumnSpan::css
 * @covers \Blockera\Editor\StyleDefinitions\GridChildColumnSpan::isImportant
 */
class GridChildColumnSpanTest extends StyleDefinitionTestCase {

	protected string $definition_class = GridChildColumnSpan::class;

	public function testReturnsEmptyOnGuards(): void {
		$definition = $this->definition();

		$this->assertSame( [], $this->invokeCss( $definition, [] ) );
		$this->assertSame( [], $this->invokeCss( $definition, [ 'type' => 'grid-row', 'grid-column' => 2 ] ) );
		$this->assertSame( [], $this->invokeCss( $definition, [ 'type' => 'grid-column' ] ) );
		$this->assertSame( [], $this->invokeCss( $definition, $this->typedSetting( 'grid-column', '' ) ) );
		$this->assertSame( [], $this->invokeCss( $definition, $this->typedSetting( 'grid-column', [] ) ) );
		$this->assertSame( [], $this->invokeCss( $definition, $this->typedSetting( 'grid-column', 0 ) ) );
		$this->assertSame( [], $this->invokeCss( $definition, $this->typedSetting( 'grid-column', -1 ) ) );
	}

	public function testEmitsSpanWithImportant(): void {
		$result = $this->invokeCss(
			$this->definition(),
			$this->typedSetting( 'grid-column', 3 )
		);

		$this->assertSame( $this->cssMap( [ 'grid-column' => 'span 3 !important' ] ), $result );
	}

	public function testCastsStringScalarToInteger(): void {
		$result = $this->invokeCss(
			$this->definition(),
			$this->typedSetting( 'grid-column', '2' )
		);

		$this->assertSame( $this->cssMap( [ 'grid-column' => 'span 2 !important' ] ), $result );
	}
}
