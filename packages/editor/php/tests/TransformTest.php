<?php

namespace Blockera\Editor\Tests;

use Blockera\Editor\StyleDefinitions\Transform;

/**
 * @covers \Blockera\Editor\StyleDefinitions\Transform
 */
class TransformTest extends StyleDefinitionTestCase {

	protected string $definition_class = Transform::class;

	public function testReturnsEmptyOnGuards(): void {
		$definition = $this->definition();

		$this->assertSame( [], $this->invokeCss( $definition, [] ) );
		$this->assertSame( [], $this->invokeCss( $definition, [ 'type' => 'rotate' ] ) );
		$this->assertSame( [], $this->invokeCss( $definition, [ 'type' => 'transform' ] ) );
		$this->assertSame( [], $this->invokeCss( $definition, [ 'type' => 'transform', 'transform' => [] ] ) );
	}

	public function testMoveThenScale(): void {
		$result = $this->invokeCss(
			$this->definition(),
			[
				'type'      => 'transform',
				'transform' => [
					[
						'type'      => 'move',
						'move-x'    => '10px',
						'move-y'    => '20px',
						'move-z'    => '0px',
						'isVisible' => true,
					],
					[
						'type'      => 'scale',
						'scale'     => '120%',
						'isVisible' => true,
					],
				],
			]
		);

		$this->assertSame(
			$this->cssMap(
				[
					'transform' => 'translate3d(10px, 20px, 0) scale3d(120%, 120%, 50%)',
				]
			),
			$result
		);
	}

	public function testRotateAndSkew(): void {
		$result = $this->invokeCss(
			$this->definition(),
			[
				'type'      => 'transform',
				'transform' => [
					[
						'type'      => 'rotate',
						'rotate-x'  => '1deg',
						'rotate-y'  => '2deg',
						'rotate-z'  => '3deg',
						'isVisible' => true,
					],
					[
						'type'      => 'skew',
						'skew-x'    => '4deg',
						'skew-y'    => '5deg',
						'isVisible' => true,
					],
				],
			]
		);

		$this->assertSame(
			$this->cssMap(
				[
					'transform' => 'rotateX(1deg) rotateY(2deg) rotateZ(3deg) skew(4deg, 5deg)',
				]
			),
			$result
		);
	}

	public function testSelfPerspectivePrepend(): void {
		$definition = $this->definition();
		$definition->setBreakpoint( 'desktop' );
		$definition->setBlock(
			[
				'blockName' => 'core/group',
				'attrs'     => [
					'blockeraTransformSelfPerspective' => [
						'value' => '500px',
					],
				],
			]
		);

		$result = $this->invokeCss(
			$definition,
			[
				'type'      => 'transform',
				'transform' => [
					[
						'type'      => 'scale',
						'scale'     => '100%',
						'isVisible' => true,
					],
				],
			]
		);

		$this->assertSame(
			$this->cssMap(
				[
					'transform' => 'perspective(500px) scale3d(100%, 100%, 50%)',
				]
			),
			$result
		);
	}

	public function testDeclarationOnly(): void {
		$definition = $this->definition();

		$result = $this->invokeCss(
			$definition,
			[
				'type'                     => 'transform',
				'transform'                => [
					[
						'type'      => 'scale',
						'scale'     => '50%',
						'isVisible' => true,
					],
				],
				'_blockeraDeclarationOnly' => true,
			]
		);

		$this->assertSame( [], $result );
		$this->assertSame( 'scale3d(50%, 50%, 50%)', $definition->getDeclarations()['transform'] ?? null );
	}

	public function testIsValidSetting(): void {
		$definition = $this->definition();

		$this->assertFalse( $definition->isValidSetting( [] ) );
		$this->assertFalse( $definition->isValidSetting( [ 'type' => 'flip' ] ) );
		$this->assertFalse(
			$definition->isValidSetting(
				[
					'type'      => 'move',
					'isVisible' => false,
				]
			)
		);
		$this->assertTrue(
			$definition->isValidSetting(
				[
					'type'      => 'move',
					'isVisible' => true,
				]
			)
		);
	}

	public function testTransformRowHelpers(): void {
		$this->assertSame(
			'translate3d(1px, 2px, 3px)',
			Transform::transformRowToCssValue(
				[
					'type'   => 'move',
					'move-x' => '1px',
					'move-y' => '2px',
					'move-z' => '3px',
				]
			)
		);
		$this->assertSame( '', Transform::transformRowToCssValue( [ 'type' => 'unknown' ] ) );
	}
}
