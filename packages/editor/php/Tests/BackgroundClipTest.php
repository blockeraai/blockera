<?php

namespace Blockera\Editor\Tests;

use Blockera\Editor\StyleDefinitions\BackgroundClip;

/**
 * @covers \Blockera\Editor\StyleDefinitions\BackgroundClip
 * @covers \Blockera\Editor\StyleDefinitions\BackgroundClip::css
 */
class BackgroundClipTest extends StyleDefinitionTestCase {

	protected string $definition_class = BackgroundClip::class;

	public function testReturnsEmptyOnGuards(): void {
		$definition = $this->definition();

		$this->assertSame( [], $this->invokeCss( $definition, [] ) );
		$this->assertSame( [], $this->invokeCss( $definition, [ 'type' => 'background-clip' ] ) );
		$this->assertSame( [], $this->invokeCss( $definition, [ 'type' => 'border-box' ] ) );
	}

	public function testEmitsWebkitPrefixedProperty(): void {
		$result = $this->invokeCss(
			$this->definition(),
			$this->typedSetting( 'background-clip', 'border-box' )
		);

		$this->assertSame(
			$this->cssMap(
				[
					'background-clip'         => 'border-box',
					'-webkit-background-clip' => 'border-box',
				]
			),
			$result
		);
	}

	public function testTextValueAddsWebkitTextFillColor(): void {
		$result = $this->invokeCss(
			$this->definition(),
			$this->typedSetting( 'background-clip', 'text' )
		);

		$this->assertSame(
			$this->cssMap(
				[
					'background-clip'           => 'text',
					'-webkit-background-clip'   => 'text',
					'-webkit-text-fill-color'   => 'transparent',
				]
			),
			$result
		);
	}
}
