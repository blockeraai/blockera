<?php

namespace Blockera\Editor\Tests;

use Blockera\Editor\StyleDefinitions\Mouse;

/**
 * @covers \Blockera\Editor\StyleDefinitions\Mouse
 * @covers \Blockera\Editor\StyleDefinitions\Mouse::css
 */
class MouseTest extends StyleDefinitionTestCase {

	protected string $definition_class = Mouse::class;

	public function testReturnsEmptyOnGuards(): void {
		$definition = $this->definition();

		$this->assertSame( [], $this->invokeCss( $definition, [] ) );
		$this->assertSame( [], $this->invokeCss( $definition, [ 'type' => '' ] ) );
		$this->assertSame( [], $this->invokeCss( $definition, [ 'type' => 'cursor' ] ) );
	}

	public function testEmitsPropertyFromTypeKey(): void {
		$result = $this->invokeCss(
			$this->definition(),
			$this->typedSetting( 'cursor', 'pointer' )
		);

		$this->assertSame( $this->cssMap( [ 'cursor' => 'pointer' ] ), $result );
	}
}
