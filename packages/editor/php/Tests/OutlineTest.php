<?php

namespace Blockera\Editor\Tests;

use Blockera\Editor\StyleDefinitions\Outline;

/**
 * @covers \Blockera\Editor\StyleDefinitions\Outline
 * @covers \Blockera\Editor\StyleDefinitions\Outline::css
 * @covers \Blockera\Editor\StyleDefinitions\Outline::isValidSetting
 */
class OutlineTest extends StyleDefinitionTestCase {

	protected string $definition_class = Outline::class;

	public function testReturnsEmptyOnGuards(): void {
		$definition = $this->definition();

		$this->assertSame( [], $this->invokeCss( $definition, [] ) );
		$this->assertSame( [], $this->invokeCss( $definition, [ 'type' => 'border' ] ) );
		$this->assertSame( [], $this->invokeCss( $definition, [ 'type' => 'outline', 'outline' => '' ] ) );
	}

	public function testUsesFirstVisibleOutline(): void {
		$definition = $this->definition();

		$result = $this->invokeCss(
			$definition,
			[
				'type'    => 'outline',
				'outline' => [
					'hidden' => [
						'isVisible' => '',
						'order'     => 0,
						'border'    => [
							'width' => '1px',
							'style' => 'solid',
							'color' => '#000',
						],
					],
					'visible' => [
						'isVisible' => true,
						'order'     => 1,
						'border'    => [
							'width' => '2px',
							'style' => 'dashed',
							'color' => '#f00',
						],
						'offset' => '3px',
					],
				],
			]
		);

		$this->assertSame(
			$this->cssMap(
				[
					'outline'        => '2px dashed #f00',
					'outline-offset' => '3px',
				]
			),
			$result
		);
	}

	public function testReturnsEmptyWhenNoVisibleOutline(): void {
		$definition = $this->definition();

		$result = $this->invokeCss(
			$definition,
			[
				'type'    => 'outline',
				'outline' => [
					'hidden' => [
						'isVisible' => false,
						'order'     => 0,
					],
				],
			]
		);

		$this->assertSame( [], $result );
	}

	public function testReturnsEmptyWhenVisibleOutlineHasNoBorder(): void {
		$definition = $this->definition();

		$result = $this->invokeCss(
			$definition,
			[
				'type'    => 'outline',
				'outline' => [
					'visible' => [
						'isVisible' => true,
						'order'     => 0,
					],
				],
			]
		);

		$this->assertSame( [], $result );
	}

	public function testIsValidSetting(): void {
		$definition = $this->definition();

		$this->assertFalse( $definition->isValidSetting( [] ) );
		$this->assertFalse( $definition->isValidSetting( [ 'isVisible' => '' ] ) );
		$this->assertTrue( $definition->isValidSetting( [ 'isVisible' => true ] ) );
	}
}
