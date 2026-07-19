<?php

namespace Blockera\Editor\Tests;

use Blockera\Editor\StyleDefinitions\Flex;

/**
 * @covers \Blockera\Editor\StyleDefinitions\Flex
 * @covers \Blockera\Editor\StyleDefinitions\Flex::css
 * @covers \Blockera\Editor\StyleDefinitions\Flex::getCustomSettings
 */
class FlexTest extends StyleDefinitionTestCase {

	protected string $definition_class = Flex::class;

	public function testReturnsEmptyOnGuards(): void {
		$definition = $this->definition();

		$this->assertSame( [], $this->invokeCss( $definition, [] ) );
		$this->assertSame( [], $this->invokeCss( $definition, [ 'type' => 'order' ] ) );
		$this->assertSame( [], $this->invokeCss( $definition, [ 'type' => 'flex' ] ) );
	}

	public function testShrinkGrowAndNoPresets(): void {
		$definition = $this->definition();

		$this->assertSame(
			$this->cssMap( [ 'flex' => '0 1 auto' ] ),
			$this->invokeCss( $definition, [ 'type' => 'flex', 'flex' => 'shrink' ] )
		);
		$this->assertSame(
			$this->cssMap( [ 'flex' => '1 1 0%' ] ),
			$this->invokeCss( $definition, [ 'type' => 'flex', 'flex' => 'grow' ] )
		);
		$this->assertSame(
			$this->cssMap( [ 'flex' => '0 0 auto' ] ),
			$this->invokeCss( $definition, [ 'type' => 'flex', 'flex' => 'no' ] )
		);
	}

	public function testCustomFlexChildProperties(): void {
		$definition = $this->definition();

		$result = $this->invokeCss(
			$definition,
			[
				'type'   => 'flex',
				'flex'   => 'custom',
				'custom' => [
					'blockeraFlexChildGrow'   => '2',
					'blockeraFlexChildShrink' => '0',
					'blockeraFlexChildBasis'  => '100px',
				],
			]
		);

		$this->assertSame(
			$this->cssMap(
				[
					'flex-grow'   => '2',
					'flex-shrink' => '0',
					'flex-basis'  => '100px !important',
				]
			),
			$result
		);
	}

	public function testCustomFlexSkipsEmptyGrowShrinkAndBasis(): void {
		$definition = $this->definition();

		$this->assertSame(
			[],
			$this->invokeCss(
				$definition,
				[
					'type'   => 'flex',
					'flex'   => 'custom',
					'custom' => [
						'blockeraFlexChildGrow'   => '',
						'blockeraFlexChildShrink' => '',
						'blockeraFlexChildBasis'  => '',
					],
				]
			)
		);
	}

	public function testGetCustomSettingsDefaultEnvelope(): void {
		$definition = $this->definition();

		$this->assertSame(
			[
				[
					'isVisible' => true,
					'type'      => 'flex',
					'flex'      => 'grow',
				],
			],
			$definition->getCustomSettings( [ 'value' => 'grow' ], 'blockeraFlexChildSizing', 'flex' )
		);
	}

	public function testGetCustomSettingsCustomEnvelope(): void {
		$definition = $this->definition();
		$definition->setPseudoState( 'normal' );
		$definition->setBreakpoint( 'desktop' );
		$definition->setBlock(
			[
				'attrs' => [
					'blockeraBlockStates' => [
						'value' => [
							'normal' => [
								'breakpoints' => [
									'desktop' => [
										'attributes' => [
											'blockeraFlexChildGrow'   => '1',
											'blockeraFlexChildShrink' => '2',
											'blockeraFlexChildBasis'  => '50%',
										],
									],
								],
							],
						],
					],
				],
			]
		);

		$this->assertSame(
			[
				[
					'isVisible' => true,
					'type'      => 'flex',
					'flex'      => 'custom',
					'custom'    => [
						'blockeraFlexChildGrow'   => '1',
						'blockeraFlexChildShrink' => '2',
						'blockeraFlexChildBasis'  => '50%',
					],
				],
			],
			$definition->getCustomSettings( [ 'value' => 'custom' ], 'blockeraFlexChildSizing', 'flex' )
		);
	}
}
