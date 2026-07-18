<?php

namespace Blockera\Editor\Tests;

use Blockera\Editor\StyleDefinitions\Border;

/**
 * @covers \Blockera\Editor\StyleDefinitions\Border
 */
class BorderTest extends StyleDefinitionTestCase {

	protected string $definition_class = Border::class;

	public function testReturnsEmptyOnGuards(): void {
		$definition = $this->definition();

		$this->assertSame( [], $this->invokeCss( $definition, [] ) );
		$this->assertSame( [], $this->invokeCss( $definition, [ 'type' => 'outline' ] ) );
		$this->assertSame( [], $this->invokeCss( $definition, [ 'type' => 'border' ] ) );
		$this->assertSame(
			[],
			$this->invokeCss(
				$definition,
				[
					'type'   => 'border',
					'border' => [ 'width' => '1px' ],
				]
			)
		);
	}

	public function testAllSideShorthand(): void {
		$result = $this->invokeCss(
			$this->definition(),
			[
				'type'   => 'border',
				'border' => [
					'type' => 'all',
					'all'  => [
						'width' => '2px',
						'style' => 'dashed',
						'color' => '#111',
					],
				],
			]
		);

		$this->assertSame( $this->cssMap( [ 'border' => '2px dashed #111' ] ), $result );
	}

	public function testCustomSides(): void {
		$result = $this->invokeCss(
			$this->definition(),
			[
				'type'   => 'border',
				'border' => [
					'type'   => 'custom',
					'top'    => [
						'width' => '1px',
						'style' => 'solid',
						'color' => 'red',
					],
					'right'  => [
						'width' => '2px',
						'style' => '',
						'color' => 'blue',
					],
					'bottom' => [
						'width' => '',
						'style' => 'solid',
						'color' => 'green',
					],
					'left'   => [
						'width' => '3px',
						'style' => 'dotted',
						'color' => '',
					],
				],
			]
		);

		$this->assertSame(
			$this->cssMap(
				[
					'border-top'    => '1px solid red',
					'border-right'  => '2px solid blue',
					'border-bottom' => '',
					'border-left'   => '3px dotted',
				]
			),
			$result
		);
	}

	public function testDefaultStyleWhenMissing(): void {
		$this->assertSame( '1px solid', Border::sideToCssShorthand( [ 'width' => '1px' ] ) );
		$this->assertSame( '', Border::sideToCssShorthand( [ 'width' => '' ] ) );
	}

	public function testIsFlatPresetBorderSide(): void {
		$this->assertTrue(
			Border::isFlatPresetBorderSide(
				[
					'width' => '1px',
					'style' => 'solid',
					'color' => '#000',
				]
			)
		);
		$this->assertFalse(
			Border::isFlatPresetBorderSide(
				[
					'type'  => 'all',
					'width' => '1px',
					'style' => 'solid',
				]
			)
		);
	}

	public function testPresetBoxToShorthand(): void {
		$this->assertSame(
			'2px solid #000',
			Border::presetBoxToShorthand(
				[
					'type' => 'all',
					'all'  => [
						'width' => '2px',
						'style' => 'solid',
						'color' => '#000',
					],
				]
			)
		);

		$this->assertSame(
			'1px solid red 2px solid blue  ',
			Border::presetBoxToShorthand(
				[
					'type'  => 'custom',
					'top'   => [
						'width' => '1px',
						'style' => 'solid',
						'color' => 'red',
					],
					'right' => [
						'width' => '2px',
						'style' => 'solid',
						'color' => 'blue',
					],
				]
			)
		);

		$this->assertSame( '', Border::presetBoxToShorthand( [ 'type' => 'other' ] ) );
	}

	public function testPresetToCssValue(): void {
		$this->assertSame( '1px solid', Border::presetToCssValue( [ 'border' => '1px solid' ] ) );
		$this->assertSame( '', Border::presetToCssValue( [] ) );
		$this->assertSame(
			'1px solid #111',
			Border::presetToCssValue(
				[
					'border' => [
						'width' => '1px',
						'style' => 'solid',
						'color' => '#111',
					],
				]
			)
		);
		$this->assertSame(
			'3px solid',
			Border::presetToCssValue(
				[
					'border' => [
						'type' => 'all',
						'all'  => [
							'width' => '3px',
							'style' => 'solid',
						],
					],
				]
			)
		);
	}

	public function testDeclarationOnlyPresetFlat(): void {
		$definition = $this->definition();

		$result = $this->invokeCss(
			$definition,
			[
				'type'                     => 'border',
				'border'                   => [
					'width' => '1px',
					'style' => 'solid',
					'color' => '#abc',
				],
				'_blockeraDeclarationOnly' => true,
				'_blockeraGlobalPreset'    => true,
			]
		);

		$this->assertSame( [], $result );
		$this->assertSame( '1px solid #abc', $definition->getDeclarations()['border'] ?? null );
	}

	public function testDeclarationOnlyPresetBox(): void {
		$definition = $this->definition();

		$result = $this->invokeCss(
			$definition,
			[
				'type'                     => 'border',
				'border'                   => [
					'type' => 'all',
					'all'  => [
						'width' => '4px',
						'style' => 'solid',
						'color' => 'navy',
					],
				],
				'_blockeraDeclarationOnly' => true,
				'_blockeraGlobalPreset'    => true,
			]
		);

		$this->assertSame( [], $result );
		$this->assertSame( '4px solid navy', $definition->getDeclarations()['border'] ?? null );
	}
}
