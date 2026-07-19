<?php

namespace Blockera\Editor\Tests;

use Blockera\Editor\StyleDefinitions\Color;

/**
 * @covers \Blockera\Editor\StyleDefinitions\Color
 * @covers \Blockera\Editor\StyleDefinitions\Color::css
 */
class ColorTest extends StyleDefinitionTestCase {

	protected string $definition_class = Color::class;

	public function testReturnsEmptyOnGuards(): void {
		$definition = $this->definition();

		$this->assertSame( [], $this->invokeCss( $definition, [] ) );
		$this->assertSame( [], $this->invokeCss( $definition, [ 'type' => 'background-color', 'color' => '#fff' ] ) );
		$this->assertSame( [], $this->invokeCss( $definition, [ 'type' => 'color' ] ) );
		$this->assertSame( [], $this->invokeCss( $definition, $this->typedSetting( 'color', '' ) ) );
	}

	public function testEmitsPlainColor(): void {
		$result = $this->invokeCss(
			$this->definition(),
			$this->typedSetting( 'color', '#ff0000' )
		);

		$this->assertSame( $this->cssMap( [ 'color' => '#ff0000' ] ), $result );
	}

	public function testResolvesValueAddon(): void {
		$result = $this->invokeCss(
			$this->definition(),
			$this->typedSetting( 'color', '12pxfunc' )
		);

		$this->assertSame( $this->cssMap( [ 'color' => '12px' ] ), $result );
	}
}
