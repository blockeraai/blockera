<?php

namespace Blockera\Editor\Tests;

use Blockera\Editor\StyleDefinitions\TextShadow;

/**
 * @covers \Blockera\Editor\StyleDefinitions\TextShadow
 */
class TextShadowTest extends StyleDefinitionTestCase {

	protected string $definition_class = TextShadow::class;

	public function testReturnsEmptyOnGuards(): void {
		$definition = $this->definition();

		$this->assertSame( [], $this->invokeCss( $definition, [] ) );
		$this->assertSame( [], $this->invokeCss( $definition, [ 'type' => 'box-shadow' ] ) );
		$this->assertSame( [], $this->invokeCss( $definition, [ 'type' => 'text-shadow' ] ) );
		$this->assertSame( [], $this->invokeCss( $definition, [ 'type' => 'text-shadow', 'text-shadow' => '' ] ) );
	}

	public function testEmitsLayer(): void {
		$result = $this->invokeCss(
			$this->definition(),
			[
				'type'        => 'text-shadow',
				'text-shadow' => [
					[
						'x'         => '1px',
						'y'         => '2px',
						'blur'      => '3px',
						'color'     => '#000',
						'isVisible' => true,
					],
				],
			]
		);

		$this->assertSame( $this->cssMap( [ 'text-shadow' => '1px 2px 3px #000' ] ), $result );
	}

	public function testJoinsLayers(): void {
		$result = $this->invokeCss(
			$this->definition(),
			[
				'type'        => 'text-shadow',
				'text-shadow' => [
					[
						'x'         => '1px',
						'y'         => '1px',
						'blur'      => '0',
						'color'     => 'red',
						'isVisible' => true,
					],
					[
						'x'         => '2px',
						'y'         => '2px',
						'blur'      => '0',
						'color'     => 'blue',
						'isVisible' => true,
					],
				],
			]
		);

		$this->assertSame( $this->cssMap( [ 'text-shadow' => '1px 1px 0 red, 2px 2px 0 blue' ] ), $result );
	}

	public function testDeclarationOnly(): void {
		$definition = $this->definition();

		$result = $this->invokeCss(
			$definition,
			[
				'type'                     => 'text-shadow',
				'text-shadow'              => [
					[
						'x'         => '1px',
						'y'         => '1px',
						'blur'      => '1px',
						'color'     => '#111',
						'isVisible' => true,
					],
				],
				'_blockeraDeclarationOnly' => true,
			]
		);

		$this->assertSame( [], $result );
		$this->assertSame( '1px 1px 1px #111', $definition->getDeclarations()['text-shadow'] ?? null );
	}

	public function testHelpers(): void {
		$this->assertSame(
			'1px 2px 3px #fff',
			TextShadow::textShadowRowToCssValue(
				[
					'x'     => '1px',
					'y'     => '2px',
					'blur'  => '3px',
					'color' => '#fff',
				]
			)
		);
		$this->assertSame( [ '1px 1px #000', '2px 2px #fff' ], TextShadow::splitTextShadowList( '1px 1px #000, 2px 2px #fff' ) );
		$this->assertSame( [], TextShadow::splitTextShadowList( '' ) );
	}

	public function testIsValidSetting(): void {
		$definition = $this->definition();

		$this->assertFalse( $definition->isValidSetting( [] ) );
		$this->assertTrue( $definition->isValidSetting( [ 'isVisible' => true ] ) );
	}
}
