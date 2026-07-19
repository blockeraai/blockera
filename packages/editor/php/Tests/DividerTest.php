<?php

namespace Blockera\Editor\Tests;

use Blockera\Editor\StyleDefinitions\Divider;

/**
 * @covers \Blockera\Editor\StyleDefinitions\Divider
 * @covers \Blockera\Editor\StyleDefinitions\Divider::css
 */
class DividerTest extends StyleDefinitionTestCase {

	protected string $definition_class = Divider::class;

	public function testReturnsEmptyArrayWhenTypeMissing(): void {
		$this->assertSame( [], $this->invokeCss( $this->definition(), [] ) );
	}

	public function testReturnsEmptyArrayWhenTypeIsEmptyString(): void {
		$this->assertSame( [], $this->invokeCss( $this->definition(), [ 'type' => '' ] ) );
	}

	public function testReturnsStoredCssWhenTypePresent(): void {
		$this->assertSame( [], $this->invokeCss( $this->definition(), [ 'type' => 'divider' ] ) );
	}
}
