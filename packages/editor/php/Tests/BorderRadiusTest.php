<?php

namespace Blockera\Editor\Tests;

use Blockera\Editor\StyleDefinitions\BorderRadius;

/**
 * @covers \Blockera\Editor\StyleDefinitions\BorderRadius
 * @covers \Blockera\Editor\StyleDefinitions\BorderRadius::css
 */
class BorderRadiusTest extends StyleDefinitionTestCase {

	protected string $definition_class = BorderRadius::class;

	/**
	 * @return array<string, mixed>
	 */
	private function radiusSupports(): array {
		return [
			'blockeraBorderRadius' => [
				'style-engine-config' => [
					'all'         => 'border-radius',
					'topLeft'     => 'border-top-left-radius',
					'topRight'    => 'border-top-right-radius',
					'bottomLeft'  => 'border-bottom-left-radius',
					'bottomRight' => 'border-bottom-right-radius',
				],
			],
		];
	}

	private function radiusDefinition(): BorderRadius {
		$definition = new BorderRadius( $this->radiusSupports() );
		$definition->setBreakpoint( 'desktop' );
		$definition->setBlock(
			[
				'blockName' => 'core/group',
				'attrs'     => [],
			]
		);

		return $definition;
	}

	public function testReturnsEmptyOnGuards(): void {
		$definition = $this->radiusDefinition();

		$this->assertSame( [], $this->invokeCss( $definition, [] ) );
		$this->assertSame( [], $this->invokeCss( $definition, [ 'type' => 'border' ] ) );
		$this->assertSame( [], $this->invokeCss( $definition, [ 'type' => 'border-radius' ] ) );
	}

	public function testValueAddonEmitsAllRadius(): void {
		$definition = $this->radiusDefinition();

		$result = $this->invokeCss(
			$definition,
			[
				'type'          => 'border-radius',
				'border-radius' => [
					'isValueAddon' => true,
					'valueType'    => 'variable',
					'settings'     => [
						'var'   => '--radius',
						'value' => '8px',
					],
				],
			]
		);

		$this->assertSame( $this->cssMap( [ 'border-radius' => 'var(--radius, 8px)' ] ), $result );
	}

	public function testAllTypeRadius(): void {
		$definition = $this->radiusDefinition();

		$result = $this->invokeCss(
			$definition,
			[
				'type'          => 'border-radius',
				'border-radius' => [
					'type' => 'all',
					'all'  => '12px',
				],
			]
		);

		$this->assertSame( $this->cssMap( [ 'border-radius' => '12px' ] ), $result );
	}

	public function testCornerTypeRadius(): void {
		$definition = $this->radiusDefinition();

		$result = $this->invokeCss(
			$definition,
			[
				'type'          => 'border-radius',
				'border-radius' => [
					'type'        => 'custom',
					'topLeft'     => '1px',
					'topRight'    => '2px',
					'bottomRight' => '3px',
					'bottomLeft'  => '4px',
				],
			]
		);

		$this->assertSame(
			$this->cssMap(
				[
					'border-top-left-radius'     => '1px',
					'border-top-right-radius'    => '2px',
					'border-bottom-right-radius' => '3px',
					'border-bottom-left-radius'  => '4px',
				]
			),
			$result
		);
	}

	public function testUnwrapsVariableFieldWithArraySettings(): void {
		$definition = $this->radiusDefinition();

		$result = $this->invokeCss(
			$definition,
			[
				'type'          => 'border-radius',
				'border-radius' => [
					'type' => 'all',
					'all'  => [
						'valueType' => 'variable',
						'settings'  => [
							'value' => [
								'type' => 'all',
								'all'  => '6px',
							],
						],
					],
				],
			]
		);

		$this->assertSame( $this->cssMap( [ 'border-radius' => '6px' ] ), $result );
	}

	public function testUnwrapsLegacyJsonVariableField(): void {
		$definition = $this->radiusDefinition();

		$result = $this->invokeCss(
			$definition,
			[
				'type'          => 'border-radius',
				'border-radius' => [
					'type' => 'all',
					'all'  => [
						'valueType' => 'variable',
						'settings'  => [
							'value' => '{"type":"all","all":"9px"}',
						],
					],
				],
			]
		);

		$this->assertSame( $this->cssMap( [ 'border-radius' => '9px' ] ), $result );
	}

	public function testKeepsVariableFieldWhenLegacyJsonInvalid(): void {
		$definition = $this->radiusDefinition();

		$field = [
			'valueType' => 'variable',
			'settings'  => [
				'var'   => '--token',
				'value' => 'not-json',
			],
			'isValueAddon' => true,
		];

		$result = $this->invokeCss(
			$definition,
			[
				'type'          => 'border-radius',
				'border-radius' => [
					'type' => 'all',
					'all'  => $field,
				],
			]
		);

		$this->assertSame( $this->cssMap( [ 'border-radius' => 'var(--token, not-json)' ] ), $result );
	}

	public function testNonAllVariableShapePassesThroughAddonResolver(): void {
		$definition = $this->radiusDefinition();

		$field = [
			'valueType' => 'variable',
			'settings'  => [
				'value' => [
					'type' => 'custom',
					'all'  => '6px',
				],
			],
		];

		$result = $this->invokeCss(
			$definition,
			[
				'type'          => 'border-radius',
				'border-radius' => [
					'type' => 'all',
					'all'  => $field,
				],
			]
		);

		// Unwrap keeps the field when type !== all; addon helper then returns the array as-is.
		$this->assertSame( $this->cssMap( [ 'border-radius' => $field ] ), $result );
	}

	public function testEmptyCornerValuesEmitEmptyStrings(): void {
		$definition = $this->radiusDefinition();

		$result = $this->invokeCss(
			$definition,
			[
				'type'          => 'border-radius',
				'border-radius' => [
					'type' => 'custom',
				],
			]
		);

		$this->assertSame(
			$this->cssMap(
				[
					'border-top-left-radius'     => '',
					'border-top-right-radius'    => '',
					'border-bottom-right-radius' => '',
					'border-bottom-left-radius'  => '',
				]
			),
			$result
		);
	}

	public function testVariableFieldWithEmptySettingsValue(): void {
		$definition = $this->radiusDefinition();

		$field = [
			'valueType' => 'variable',
			'settings'  => [
				'var'   => '--radius',
				'value' => '',
			],
		];

		$result = $this->invokeCss(
			$definition,
			[
				'type'          => 'border-radius',
				'border-radius' => [
					'type' => 'all',
					'all'  => $field,
				],
			]
		);

		$this->assertSame( $this->cssMap( [ 'border-radius' => $field ] ), $result );
	}

	public function testLegacyJsonDecodeFailureKeepsVariableField(): void {
		$definition = $this->radiusDefinition();

		$field = [
			'valueType' => 'variable',
			'settings'  => [
				'var'   => '--radius',
				'value' => 'plain-scalar',
			],
		];

		$result = $this->invokeCss(
			$definition,
			[
				'type'          => 'border-radius',
				'border-radius' => [
					'type' => 'all',
					'all'  => $field,
				],
			]
		);

		$this->assertSame( $this->cssMap( [ 'border-radius' => $field ] ), $result );
	}

	public function testVariableFieldWithoutSettingsValue(): void {
		$definition = $this->radiusDefinition();

		$field = [
			'valueType' => 'variable',
			'settings'  => [
				'var' => '--radius',
			],
		];

		$result = $this->invokeCss(
			$definition,
			[
				'type'          => 'border-radius',
				'border-radius' => [
					'type' => 'all',
					'all'  => $field,
				],
			]
		);

		$this->assertSame( $this->cssMap( [ 'border-radius' => $field ] ), $result );
	}
}
