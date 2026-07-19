<?php

namespace Blockera\Editor\Tests;

use Blockera\Editor\StyleDefinitions\Mask;

/**
 * @covers \Blockera\Editor\StyleDefinitions\Mask
 *
 * Mask experimental flag is false in experimental.config.json — cover gates + validators.
 * SVG shape table in setMask() is intentionally not rewritten/retested payload-by-payload.
 */
class MaskTest extends StyleDefinitionTestCase {

	protected string $definition_class = Mask::class;

	public function testReturnsEmptyOnGuards(): void {
		$definition = $this->definition();

		$this->assertSame( [], $this->invokeCss( $definition, [] ) );
		$this->assertSame( [], $this->invokeCss( $definition, [ 'type' => '' ] ) );
		$this->assertSame( [], $this->invokeCss( $definition, [ 'type' => 'filter' ] ) );
		$this->assertSame( [], $this->invokeCss( $definition, [ 'type' => 'mask' ] ) );
		$this->assertSame( [], $this->invokeCss( $definition, [ 'type' => 'mask', 'mask' => [] ] ) );
	}

	public function testReturnsEmptyWhenExperimentalDisabled(): void {
		// experimental.config.json: effectsExtension.mask = false
		$result = $this->invokeCss(
			$this->definition(),
			[
				'type' => 'mask',
				'mask' => [
					[
						'type'      => 'shape',
						'isVisible' => true,
					],
				],
			]
		);

		$this->assertSame( [], $result );
	}

	public function testIsValidSetting(): void {
		$definition = $this->definition();

		$this->assertFalse( $definition->isValidSetting( [] ) );
		$this->assertFalse( $definition->isValidSetting( [ 'type' => '' ] ) );
		$this->assertFalse(
			$definition->isValidSetting(
				[
					'type'      => 'shape',
					'isVisible' => false,
				]
			)
		);
		$this->assertTrue(
			$definition->isValidSetting(
				[
					'type'      => 'shape',
					'isVisible' => true,
				]
			)
		);
	}
}
