<?php

namespace Blockera\Editor\Tests;

use Blockera\Editor\StyleDefinitions\BackgroundColor;

/**
 * @covers \Blockera\Editor\StyleDefinitions\BackgroundColor
 * @covers \Blockera\Editor\StyleDefinitions\BackgroundColor::css
 */
class BackgroundColorTest extends StyleDefinitionTestCase {

	protected string $definition_class = BackgroundColor::class;

	public function testReturnsEmptyOnGuards(): void {
		$definition = $this->definition();

		$this->assertSame( [], $this->invokeCss( $definition, [] ) );
		$this->assertSame( [], $this->invokeCss( $definition, [ 'type' => 'color', 'background-color' => '#fff' ] ) );
		$this->assertSame( [], $this->invokeCss( $definition, [ 'type' => 'background-color' ] ) );
		$this->assertSame( [], $this->invokeCss( $definition, $this->typedSetting( 'background-color', '' ) ) );
	}

	public function testEmitsPlainBackgroundColor(): void {
		$result = $this->invokeCss(
			$this->definition(),
			$this->typedSetting( 'background-color', '#00ff00' )
		);

		$this->assertSame( $this->cssMap( [ 'background-color' => '#00ff00' ] ), $result );
	}

	public function testResolvesValueAddon(): void {
		$result = $this->invokeCss(
			$this->definition(),
			$this->typedSetting( 'background-color', '0px' )
		);

		$this->assertSame( $this->cssMap( [ 'background-color' => '0' ] ), $result );
	}
}
