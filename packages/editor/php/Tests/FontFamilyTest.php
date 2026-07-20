<?php

namespace Blockera\Editor\Tests;

use Blockera\Editor\StyleDefinitions\FontFamily;

/**
 * @covers \Blockera\Editor\StyleDefinitions\FontFamily
 * @covers \Blockera\Editor\StyleDefinitions\FontFamily::css
 */
class FontFamilyTest extends StyleDefinitionTestCase {

	protected string $definition_class = FontFamily::class;

	public function testReturnsEmptyOnGuards(): void {
		$definition = $this->definition();

		$this->assertSame( [], $this->invokeCss( $definition, [] ) );
		$this->assertSame( [], $this->invokeCss( $definition, [ 'type' => 'font-size', 'font-family' => 'serif' ] ) );
		$this->assertSame( [], $this->invokeCss( $definition, [ 'type' => 'font-family' ] ) );
	}

	public function testWrapsPresetSlugInCssVariable(): void {
		$result = $this->invokeCss(
			$this->definition(),
			$this->typedSetting( 'font-family', 'inter' )
		);

		$this->assertSame(
			$this->cssMap( [ 'font-family' => 'var(--wp--preset--font-family--inter)' ] ),
			$result
		);
	}
}
