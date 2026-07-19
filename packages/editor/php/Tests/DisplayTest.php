<?php

namespace Blockera\Editor\Tests;

use Blockera\Editor\StyleDefinitions\Display;

/**
 * @covers \Blockera\Editor\StyleDefinitions\Display
 * @covers \Blockera\Editor\StyleDefinitions\Display::css
 * @covers \Blockera\Editor\StyleDefinitions\Display::isImportant
 */
class DisplayTest extends StyleDefinitionTestCase {

	protected string $definition_class = Display::class;

	public function testReturnsEmptyOnGuards(): void {
		$definition = $this->definition();

		$this->assertSame( [], $this->invokeCss( $definition, [] ) );
		$this->assertSame( [], $this->invokeCss( $definition, [ 'type' => '' ] ) );
		$this->assertSame( [], $this->invokeCss( $definition, [ 'type' => 'display' ] ) );
		$this->assertSame( [], $this->invokeCss( $definition, $this->typedSetting( 'display', '' ) ) );
	}

	public function testEmitsDisplayWithImportant(): void {
		$result = $this->invokeCss(
			$this->definition(),
			$this->typedSetting( 'display', 'flex' )
		);

		$this->assertSame( $this->cssMap( [ 'display' => 'flex !important' ] ), $result );
	}

	public function testCoreColumnsAddsMarginBlockStartRule(): void {
		$definition = $this->definitionWithBlock(
			[
				'blockName' => 'core/columns',
				'attrs'     => [],
			]
		);
		$definition->setBreakpoint( 'desktop' );

		$result = $this->invokeCss(
			$definition,
			$this->typedSetting( 'display', 'flex' )
		);

		$this->assertSame( 'flex !important', $result['']['display'] );

		$margin_rule = null;
		foreach ( $result as $declarations ) {
			if ( isset( $declarations['margin-block-start'] ) ) {
				$margin_rule = $declarations['margin-block-start'];
				break;
			}
		}

		$this->assertSame( '0 !important', $margin_rule );
	}
}
