<?php

namespace Blockera\Editor\Tests;

use Blockera\Editor\StyleDefinitions\Transition;

/**
 * @covers \Blockera\Editor\StyleDefinitions\Transition
 */
class TransitionTest extends StyleDefinitionTestCase {

	protected string $definition_class = Transition::class;

	public function testReturnsEmptyOnGuards(): void {
		$definition = $this->definition();

		$this->assertSame( [], $this->invokeCss( $definition, [] ) );
		$this->assertSame( [], $this->invokeCss( $definition, [ 'type' => '' ] ) );
		$this->assertSame( [], $this->invokeCss( $definition, [ 'type' => 'transform' ] ) );
		$this->assertSame( [], $this->invokeCss( $definition, [ 'type' => 'transition' ] ) );
		$this->assertSame( [], $this->invokeCss( $definition, [ 'type' => 'transition', 'transition' => '' ] ) );
	}

	public function testEmitsSingleTransition(): void {
		$result = $this->invokeCss(
			$this->definition(),
			[
				'type'       => 'transition',
				'transition' => [
					[
						'type'      => 'opacity',
						'duration'  => '200ms',
						'timing'    => 'ease',
						'delay'     => '0ms',
						'isVisible' => true,
					],
				],
			]
		);

		$this->assertSame( $this->cssMap( [ 'transition' => 'opacity 200ms ease 0ms' ] ), $result );
	}

	public function testJoinsMultipleAndMapsCubicTiming(): void {
		$result = $this->invokeCss(
			$this->definition(),
			[
				'type'       => 'transition',
				'transition' => [
					[
						'type'      => 'all',
						'duration'  => '1s',
						'timing'    => 'ease-in-quad',
						'delay'     => '0s',
						'isVisible' => true,
					],
					[
						'type'      => 'opacity',
						'duration'  => '2s',
						'timing'    => 'linear',
						'delay'     => '100ms',
						'isVisible' => true,
					],
				],
			]
		);

		$this->assertSame(
			$this->cssMap(
				[
					'transition' => 'all 1s cubic-bezier(0.55, 0.085, 0.68, 0.53) 0s, opacity 2s linear 100ms',
				]
			),
			$result
		);
	}

	public function testSkipsInvisibleRows(): void {
		$result = $this->invokeCss(
			$this->definition(),
			[
				'type'       => 'transition',
				'transition' => [
					[
						'type'      => 'opacity',
						'duration'  => '1s',
						'timing'    => 'ease',
						'delay'     => '0s',
						'isVisible' => false,
					],
				],
			]
		);

		$this->assertSame( [], $result );
	}

	public function testDeclarationOnly(): void {
		$definition = $this->definition();

		$result = $this->invokeCss(
			$definition,
			[
				'type'                     => 'transition',
				'transition'               => [
					[
						'type'      => 'opacity',
						'duration'  => '1s',
						'timing'    => 'ease',
						'delay'     => '0s',
						'isVisible' => true,
					],
				],
				'_blockeraDeclarationOnly' => true,
			]
		);

		$this->assertSame( [], $result );
		$this->assertSame( 'opacity 1s ease 0s', $definition->getDeclarations()['transition'] ?? null );
	}

	public function testTransitionRowToCssValuePresetDefaultsType(): void {
		$this->assertSame(
			'all 1s ease 0s',
			Transition::transitionRowToCssValue(
				[
					'duration' => '1s',
					'delay'    => '0s',
				],
				true
			)
		);
		$this->assertSame(
			'',
			Transition::transitionRowToCssValue(
				[
					'duration' => '1s',
					'delay'    => '0s',
				],
				false
			)
		);
	}

	public function testIsValidSetting(): void {
		$definition = $this->definition();

		$this->assertFalse( $definition->isValidSetting( [] ) );
		$this->assertFalse( $definition->isValidSetting( [ 'type' => 'opacity' ] ) );
		$this->assertTrue(
			$definition->isValidSetting(
				[
					'type'      => 'opacity',
					'isVisible' => true,
				]
			)
		);
	}

	public function testPresetMode(): void {
		$result = $this->invokeCss(
			$this->definition(),
			[
				'type'                  => 'transition',
				'transition'            => [
					[
						'type'      => 'color',
						'duration'  => '300ms',
						'timing'    => 'ease-out',
						'delay'     => '0ms',
						'isVisible' => true,
					],
				],
				'_blockeraGlobalPreset' => true,
			]
		);

		$this->assertSame( $this->cssMap( [ 'transition' => 'color 300ms ease-out 0ms' ] ), $result );
	}
}
