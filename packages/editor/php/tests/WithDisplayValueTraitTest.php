<?php

namespace Blockera\Editor\Tests;

use Blockera\Editor\StyleDefinitions\BaseStyleDefinition;
use Blockera\Editor\StyleDefinitions\Traits\WithDisplayValueTrait;
use ReflectionMethod;

/**
 * @covers \Blockera\Editor\StyleDefinitions\Traits\WithDisplayValueTrait
 */
class WithDisplayValueTraitTest extends \Blockera\Dev\PHPUnit\AppTestCase {

	private function displayConsumer(): BaseStyleDefinition {
		$definition = new class([]) extends BaseStyleDefinition {
			use WithDisplayValueTrait;

			protected function css( array $setting ): array {
				return [];
			}

			public function exposeDisplay( string $property = 'blockeraDisplay' ): string {
				return $this->getDisplayValue( $property );
			}
		};
		$definition->setBreakpoint( 'desktop' );

		return $definition;
	}

	private function invokeDisplay( BaseStyleDefinition $definition, string $property = 'blockeraDisplay' ): string {
		$m = new ReflectionMethod( $definition, 'exposeDisplay' );
		$m->setAccessible( true );

		return $m->invoke( $definition, $property );
	}

	public function testResolvesFromSettingsString(): void {
		$definition = $this->displayConsumer();
		$definition->setSettings( [ 'blockeraDisplay' => 'flex' ] );

		$this->assertSame( 'flex', $this->invokeDisplay( $definition ) );
	}

	public function testResolvesFromSettingsArrayValue(): void {
		$definition = $this->displayConsumer();
		$definition->setSettings( [ 'blockeraDisplay' => [ 'value' => 'grid' ] ] );

		$this->assertSame( 'grid', $this->invokeDisplay( $definition ) );
	}

	public function testSettingsEmptyStringIsReturned(): void {
		$definition = $this->displayConsumer();
		$definition->setSettings( [ 'blockeraDisplay' => '' ] );

		$this->assertSame( '', $this->invokeDisplay( $definition ) );
	}

	public function testResolvesFromBlockAttrs(): void {
		$definition = $this->displayConsumer();
		$definition->setBlock(
			[
				'attrs' => [
					'blockeraDisplay' => 'inline-block',
				],
			]
		);

		$this->assertSame( 'inline-block', $this->invokeDisplay( $definition ) );
	}

	public function testResolvesFromBlockAttrsArrayValue(): void {
		$definition = $this->displayConsumer();
		$definition->setBlock(
			[
				'attrs' => [
					'blockeraDisplay' => [ 'value' => 'block' ],
				],
			]
		);

		$this->assertSame( 'block', $this->invokeDisplay( $definition ) );
	}

	public function testResolvesFromBreakpointSettings(): void {
		$definition = $this->displayConsumer();
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
											'blockeraDisplay' => 'flex',
										],
									],
								],
							],
						],
					],
				],
			]
		);

		$this->assertSame( 'flex', $this->invokeDisplay( $definition ) );
	}

	public function testResolvesFromInnerBlockSettings(): void {
		$definition = $this->displayConsumer();
		$definition->setBlockType( 'core/button' );
		$definition->setBlock(
			[
				'attrs' => [
					'blockeraInnerBlocks' => [
						'value' => [
							'core/button' => [
								'attributes' => [
									'blockeraDisplay' => 'inline-flex',
								],
							],
						],
					],
				],
			]
		);

		$this->assertSame( 'inline-flex', $this->invokeDisplay( $definition ) );
	}

	public function testResolvesFromInnerBreakpointFallback(): void {
		$definition = $this->displayConsumer();
		$definition->setPseudoState( 'hover' );
		$definition->setBreakpoint( 'desktop' );
		$definition->setBlockType( 'core/button' );
		$definition->setBlock(
			[
				'attrs' => [
					'blockeraBlockStates' => [
						'value' => [
							'hover' => [
								'breakpoints' => [
									'desktop' => [
										'attributes' => [
											'blockeraInnerBlocks' => [
												'core/button' => [
													'attributes' => [
														'blockeraDisplay' => 'grid',
													],
												],
											],
										],
									],
								],
							],
						],
					],
				],
			]
		);

		$this->assertSame( 'grid', $this->invokeDisplay( $definition ) );
	}

	public function testResolvesFromDefaultSettings(): void {
		$definition = $this->displayConsumer();
		$definition->setDefaultSettings(
			[
				'blockeraDisplay' => [
					'default' => [
						'value' => 'table',
					],
				],
			]
		);

		$this->assertSame( 'table', $this->invokeDisplay( $definition ) );
	}

	public function testReturnsEmptyWhenUnresolved(): void {
		$definition = $this->displayConsumer();

		$this->assertSame( '', $this->invokeDisplay( $definition ) );
	}

	public function testCustomPropertyName(): void {
		$definition = $this->displayConsumer();
		$definition->setSettings( [ 'customDisplay' => 'flex' ] );

		$this->assertSame( 'flex', $this->invokeDisplay( $definition, 'customDisplay' ) );
	}

	public function testSkipsArrayValueWhenNestedValueEmpty(): void {
		$definition = $this->displayConsumer();
		$definition->setSettings( [ 'blockeraDisplay' => [ 'value' => '' ] ] );
		$definition->setDefaultSettings(
			[
				'blockeraDisplay' => [
					'default' => [
						'value' => 'flex',
					],
				],
			]
		);

		$this->assertSame( 'flex', $this->invokeDisplay( $definition ) );
	}
}
