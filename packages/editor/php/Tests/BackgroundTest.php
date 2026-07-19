<?php

namespace Blockera\Editor\Tests;

use Blockera\Editor\StyleDefinitions\Background;

/**
 * @covers \Blockera\Editor\StyleDefinitions\Background
 */
class BackgroundTest extends StyleDefinitionTestCase {

	protected string $definition_class = Background::class;

	public function testReturnsEmptyOnGuards(): void {
		$definition = $this->definition();

		$this->assertSame( [], $this->invokeCss( $definition, [] ) );
		$this->assertSame( [], $this->invokeCss( $definition, [ 'type' => '' ] ) );
		$this->assertSame( [], $this->invokeCss( $definition, [ 'type' => 'background' ] ) );
	}

	public function testNoneBackground(): void {
		$result = $this->invokeCss(
			$this->definition(),
			[
				'type'       => 'background',
				'background' => [
					[
						'type'      => 'none',
						'isVisible' => true,
					],
				],
			]
		);

		$this->assertArrayHasKey( '', $result );
		$this->assertArrayHasKey( 'background-image', $result[''] );
	}

	public function testImageBackground(): void {
		$result = $this->invokeCss(
			$this->definition(),
			[
				'type'       => 'background',
				'background' => [
					[
						'type'      => 'image',
						'image'     => 'https://example.com/a.jpg',
						'isVisible' => true,
					],
				],
			]
		);

		$this->assertArrayHasKey( '', $result );
		$this->assertNotEmpty( $result[''] );
	}

	public function testLinearGradient(): void {
		$result = $this->invokeCss(
			$this->definition(),
			[
				'type'       => 'background',
				'background' => [
					[
						'type'            => 'linear-gradient',
						'linear-gradient' => 'linear-gradient(90deg, #000, #fff)',
						'isVisible'       => true,
					],
				],
			]
		);

		$this->assertArrayHasKey( '', $result );
		$this->assertNotEmpty( $result[''] );
	}

	public function testIsValidSetting(): void {
		$definition = $this->definition();

		$this->assertFalse( $definition->isValidSetting( [] ) );
		$this->assertFalse( $definition->isValidSetting( [ 'type' => 'unknown' ] ) );
		$this->assertTrue(
			$definition->isValidSetting(
				[
					'type'      => 'none',
					'isVisible' => true,
				]
			)
		);
		$this->assertTrue(
			$definition->isValidSetting(
				[
					'type'  => 'image',
					'image' => 'x.jpg',
				]
			)
		);
	}
}
