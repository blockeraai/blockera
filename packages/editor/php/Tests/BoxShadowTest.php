<?php

namespace Blockera\Editor\Tests;

use Blockera\Editor\StyleDefinitions\BoxShadow;

/**
 * @covers \Blockera\Editor\StyleDefinitions\BoxShadow
 */
class BoxShadowTest extends StyleDefinitionTestCase {

	protected string $definition_class = BoxShadow::class;

	public function testReturnsEmptyOnGuards(): void {
		$definition = $this->definition();

		$this->assertSame( [], $this->invokeCss( $definition, [] ) );
		$this->assertSame( [], $this->invokeCss( $definition, [ 'type' => 'text-shadow' ] ) );
		$this->assertSame( [], $this->invokeCss( $definition, [ 'type' => 'box-shadow' ] ) );
		$this->assertSame( [], $this->invokeCss( $definition, [ 'type' => 'box-shadow', 'box-shadow' => '' ] ) );
	}

	public function testOuterAndInnerLayers(): void {
		$result = $this->invokeCss(
			$this->definition(),
			[
				'type'       => 'box-shadow',
				'box-shadow' => [
					[
						'type'      => 'outer',
						'x'         => '1px',
						'y'         => '2px',
						'blur'      => '3px',
						'spread'    => '0',
						'color'     => '#000',
						'isVisible' => true,
					],
					[
						'type'      => 'inner',
						'x'         => '0',
						'y'         => '0',
						'blur'      => '4px',
						'spread'    => '1px',
						'color'     => 'red',
						'isVisible' => true,
					],
				],
			]
		);

		$this->assertSame(
			$this->cssMap(
				[
					'box-shadow' => '1px 2px 3px 0 #000, inset 0 0 4px 1px red',
				]
			),
			$result
		);
	}

	public function testGetBoxShadowHelper(): void {
		$this->assertSame(
			'1px 2px 3px 4px #111',
			BoxShadow::getBoxShadow(
				[
					'type'   => 'outer',
					'x'      => '1px',
					'y'      => '2px',
					'blur'   => '3px',
					'spread' => '4px',
					'color'  => '#111',
				]
			)
		);
		$this->assertSame(
			'inset 0 0 1px 0 #000',
			BoxShadow::getBoxShadow(
				[
					'type'   => 'inner',
					'x'      => '0',
					'y'      => '0',
					'blur'   => '1px',
					'spread' => '0',
					'color'  => '#000',
				]
			)
		);
	}

	public function testPresetToCssValue(): void {
		$this->assertSame( '0 1px 2px #000', BoxShadow::presetToCssValue( [ 'shadow' => '0 1px 2px #000' ] ) );
		$this->assertSame( '', BoxShadow::presetToCssValue( [] ) );
	}

	public function testIsValidSetting(): void {
		$definition = $this->definition();

		$this->assertFalse( $definition->isValidSetting( [] ) );
		$this->assertFalse( $definition->isValidSetting( [ 'type' => 'outer' ] ) );
		$this->assertFalse(
			$definition->isValidSetting(
				[
					'type'      => 'glow',
					'isVisible' => true,
				]
			)
		);
		$this->assertTrue(
			$definition->isValidSetting(
				[
					'type'      => 'outer',
					'isVisible' => true,
				]
			)
		);
	}

	public function testDeclarationOnly(): void {
		$definition = $this->definition();

		$result = $this->invokeCss(
			$definition,
			[
				'type'                     => 'box-shadow',
				'box-shadow'               => [
					[
						'type'      => 'outer',
						'x'         => '1px',
						'y'         => '1px',
						'blur'      => '1px',
						'spread'    => '0',
						'color'     => '#000',
						'isVisible' => true,
					],
				],
				'_blockeraDeclarationOnly' => true,
			]
		);

		$this->assertSame( [], $result );
		$this->assertSame( '1px 1px 1px 0 #000', $definition->getDeclarations()['box-shadow'] ?? null );
	}
}
