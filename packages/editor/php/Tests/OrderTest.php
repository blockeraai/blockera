<?php

namespace Blockera\Editor\Tests;

use Blockera\Editor\StyleDefinitions\Order;

/**
 * @covers \Blockera\Editor\StyleDefinitions\Order
 * @covers \Blockera\Editor\StyleDefinitions\Order::css
 * @covers \Blockera\Editor\StyleDefinitions\Order::getCustomSettings
 */
class OrderTest extends StyleDefinitionTestCase {

	protected string $definition_class = Order::class;

	public function testReturnsEmptyOnGuards(): void {
		$definition = $this->definition();

		$this->assertSame( [], $this->invokeCss( $definition, [] ) );
		$this->assertSame( [], $this->invokeCss( $definition, [ 'type' => 'flex' ] ) );
		$this->assertSame( [], $this->invokeCss( $definition, [ 'type' => 'order', 'order' => '' ] ) );
	}

	public function testFirstOrder(): void {
		$definition = $this->definition();

		$this->assertSame(
			$this->cssMap( [ 'order' => '-1' ] ),
			$this->invokeCss(
				$definition,
				[
					'type'  => 'order',
					'order' => 'first',
				]
			)
		);
	}

	public function testLastOrder(): void {
		$definition = $this->definition();

		$this->assertSame(
			$this->cssMap( [ 'order' => '100' ] ),
			$this->invokeCss(
				$definition,
				[
					'type'  => 'order',
					'order' => 'last',
				]
			)
		);
	}

	public function testCustomOrderWithValue(): void {
		$definition = $this->definition();

		$this->assertSame(
			$this->cssMap( [ 'order' => '5' ] ),
			$this->invokeCss(
				$definition,
				[
					'type'   => 'order',
					'order'  => 'custom',
					'custom' => '5',
				]
			)
		);
	}

	public function testCustomOrderWithoutValueDefaultsTo100(): void {
		$definition = $this->definition();

		$this->assertSame(
			$this->cssMap( [ 'order' => '100' ] ),
			$this->invokeCss(
				$definition,
				[
					'type'  => 'order',
					'order' => 'custom',
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
					'type'      => 'order',
					'order'     => 'last',
				],
			],
			$definition->getCustomSettings( [ 'value' => 'last' ], 'blockeraFlexChildOrder', 'order' )
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
											'blockeraFlexChildOrder'       => 'first',
											'blockeraFlexChildOrderCustom' => '3',
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
					'type'      => 'order',
					'order'     => 'first',
					'custom'    => '3',
				],
			],
			$definition->getCustomSettings( [ 'value' => 'custom' ], 'blockeraFlexChildOrder', 'order' )
		);
	}

	public function testGetCustomSettingsCustomUsesNestedValueKeys(): void {
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
											'blockeraFlexChildOrder'       => [ 'value' => 'custom' ],
											'blockeraFlexChildOrderCustom' => [ 'value' => '7' ],
										],
									],
								],
							],
						],
					],
				],
			]
		);

		$result = $definition->getCustomSettings( [ 'value' => 'custom' ], 'blockeraFlexChildOrder', 'order' );

		$this->assertSame( 'custom', $result[0]['order'] );
		$this->assertSame( '7', $result[0]['custom'] );
	}
}
