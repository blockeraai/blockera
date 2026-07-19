<?php

namespace Blockera\Editor\Tests;

use Blockera\Editor\StyleDefinitions\WebkitTextStrokeColor;

/**
 * @covers \Blockera\Editor\StyleDefinitions\WebkitTextStrokeColor
 * @covers \Blockera\Editor\StyleDefinitions\WebkitTextStrokeColor::css
 */
class WebkitTextStrokeColorTest extends StyleDefinitionTestCase {

	protected string $definition_class = WebkitTextStrokeColor::class;

	/**
	 * @param array<string, mixed> $stroke
	 * @return array<string, mixed>
	 */
	private function setting( array $stroke ): array {
		return [
			'type'                     => '-webkit-text-stroke-color',
			'-webkit-text-stroke-color' => $stroke,
		];
	}

	public function testReturnsEmptyOnGuards(): void {
		$definition = $this->definition();

		$this->assertSame( [], $this->invokeCss( $definition, [] ) );
		$this->assertSame( [], $this->invokeCss( $definition, [ 'type' => '' ] ) );
		$this->assertSame( [], $this->invokeCss( $definition, [ 'type' => 'color' ] ) );
		$this->assertSame( [], $this->invokeCss( $definition, [ 'type' => '-webkit-text-stroke-color' ] ) );
	}

	public function testReturnsEmptyWhenColorKeyMissing(): void {
		$this->assertSame( [], $this->invokeCss( $this->definition(), $this->setting( [] ) ) );
	}

	public function testReturnsEmptyWhenColorEmptyAfterResolution(): void {
		$this->assertSame(
			[],
			$this->invokeCss(
				$this->definition(),
				$this->setting( [ 'color' => '' ] )
			)
		);
	}

	public function testEmitsColorOnly(): void {
		$result = $this->invokeCss(
			$this->definition(),
			$this->setting( [ 'color' => '#000000' ] )
		);

		$this->assertSame(
			$this->cssMap(
				[
					'-webkit-text-stroke-color' => '#000000',
					'text-stroke-color'         => '#000000',
				]
			),
			$result
		);
	}

	public function testEmitsColorAndWidthWhenWidthPresent(): void {
		$result = $this->invokeCss(
			$this->definition(),
			$this->setting(
				[
					'color' => '#ff0000',
					'width' => '3px',
				]
			)
		);

		$this->assertSame(
			$this->cssMap(
				[
					'-webkit-text-stroke-color' => '#ff0000',
					'text-stroke-color'         => '#ff0000',
					'-webkit-text-stroke-width' => '3px',
					'text-stroke-width'         => '3px',
				]
			),
			$result
		);
	}
}
