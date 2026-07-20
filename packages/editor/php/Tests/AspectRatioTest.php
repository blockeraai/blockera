<?php

namespace Blockera\Editor\Tests;

use Blockera\Editor\StyleDefinitions\AspectRatio;

/**
 * @covers \Blockera\Editor\StyleDefinitions\AspectRatio
 * @covers \Blockera\Editor\StyleDefinitions\AspectRatio::css
 */
class AspectRatioTest extends StyleDefinitionTestCase {

	protected string $definition_class = AspectRatio::class;

	/**
	 * @param array<string, mixed> $data
	 * @return array<string, mixed>
	 */
	private function setting( array $data ): array {
		return [
			'type'         => 'aspect-ratio',
			'aspect-ratio' => $data,
		];
	}

	public function testReturnsEmptyOnGuards(): void {
		$definition = $this->definition();

		$this->assertSame( [], $this->invokeCss( $definition, [] ) );
		$this->assertSame( [], $this->invokeCss( $definition, [ 'type' => 'width' ] ) );
		$this->assertSame( [], $this->invokeCss( $definition, [ 'type' => 'aspect-ratio' ] ) );
		$this->assertSame( [], $this->invokeCss( $definition, $this->setting( [] ) ) );
	}

	public function testEmitsPresetValueFromValKey(): void {
		$result = $this->invokeCss(
			$this->definition(),
			$this->setting( [ 'val' => '16/9' ] )
		);

		$this->assertSame( $this->cssMap( [ 'aspect-ratio' => '16/9' ] ), $result );
	}

	public function testEmitsPresetValueFromValueKey(): void {
		$result = $this->invokeCss(
			$this->definition(),
			$this->setting( [ 'value' => '4/3' ] )
		);

		$this->assertSame( $this->cssMap( [ 'aspect-ratio' => '4/3' ] ), $result );
	}

	public function testEmitsCustomWidthAndHeight(): void {
		$result = $this->invokeCss(
			$this->definition(),
			$this->setting(
				[
					'value'  => 'custom',
					'width'  => '16',
					'height' => '9',
				]
			)
		);

		$this->assertSame( $this->cssMap( [ 'aspect-ratio' => '16 / 9' ] ), $result );
	}
}
