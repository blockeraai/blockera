<?php

namespace Blockera\Editor\Tests;

use Blockera\Editor\StyleDefinitions\WebkitTextStrokeWidth;

/**
 * @covers \Blockera\Editor\StyleDefinitions\WebkitTextStrokeWidth
 * @covers \Blockera\Editor\StyleDefinitions\WebkitTextStrokeWidth::css
 */
class WebkitTextStrokeWidthTest extends StyleDefinitionTestCase {

	protected string $definition_class = WebkitTextStrokeWidth::class;

	/**
	 * @param array<string, mixed> $stroke
	 * @return array<string, mixed>
	 */
	private function setting( array $stroke ): array {
		return [
			'type'                    => '-webkit-text-stroke-width',
			'-webkit-text-stroke-width' => $stroke,
		];
	}

	public function testReturnsEmptyOnGuards(): void {
		$definition = $this->definition();

		$this->assertSame( [], $this->invokeCss( $definition, [] ) );
		$this->assertSame( [], $this->invokeCss( $definition, [ 'type' => '' ] ) );
		$this->assertSame( [], $this->invokeCss( $definition, [ 'type' => 'text-stroke-width' ] ) );
		$this->assertSame( [], $this->invokeCss( $definition, [ 'type' => '-webkit-text-stroke-width' ] ) );
	}

	public function testReturnsEmptyWhenWidthKeyMissing(): void {
		$this->assertSame( [], $this->invokeCss( $this->definition(), $this->setting( [] ) ) );
	}

	public function testReturnsEmptyWhenWidthEmptyAfterResolution(): void {
		$this->assertSame(
			[],
			$this->invokeCss(
				$this->definition(),
				$this->setting( [ 'width' => '' ] )
			)
		);
	}

	public function testEmitsWebkitAndStandardStrokeWidth(): void {
		$result = $this->invokeCss(
			$this->definition(),
			$this->setting( [ 'width' => '2px' ] )
		);

		$this->assertSame(
			$this->cssMap(
				[
					'-webkit-text-stroke-width' => '2px',
					'text-stroke-width'         => '2px',
				]
			),
			$result
		);
	}
}
