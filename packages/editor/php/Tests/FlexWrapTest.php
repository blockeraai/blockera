<?php

namespace Blockera\Editor\Tests;

use Blockera\Editor\StyleDefinitions\FlexWrap;

/**
 * @covers \Blockera\Editor\StyleDefinitions\FlexWrap
 * @covers \Blockera\Editor\StyleDefinitions\FlexWrap::css
 */
class FlexWrapTest extends StyleDefinitionTestCase {

	protected string $definition_class = FlexWrap::class;

	/**
	 * @param array<string, mixed> $flex_wrap
	 * @return array<string, mixed>
	 */
	private function setting( array $flex_wrap ): array {
		return [
			'type'      => 'flex-wrap',
			'flex-wrap' => $flex_wrap,
		];
	}

	public function testReturnsEmptyOnGuards(): void {
		$definition = $this->definition();

		$this->assertSame( [], $this->invokeCss( $definition, [] ) );
		$this->assertSame( [], $this->invokeCss( $definition, [ 'type' => 'flex-direction' ] ) );
		$this->assertSame( [], $this->invokeCss( $definition, [ 'type' => 'flex-wrap' ] ) );
		$this->assertSame( [], $this->invokeCss( $definition, $this->setting( [] ) ) );
		$this->assertSame( [], $this->invokeCss( $definition, $this->setting( [ 'value' => '', 'val' => '' ] ) ) );
	}

	public function testEmitsWrapWithImportant(): void {
		$result = $this->invokeCss(
			$this->definition(),
			$this->setting( [ 'value' => 'wrap' ] )
		);

		$this->assertSame( $this->cssMap( [ 'flex-wrap' => 'wrap !important' ] ), $result );
	}

	public function testUsesValFallbackKey(): void {
		$result = $this->invokeCss(
			$this->definition(),
			$this->setting( [ 'val' => 'nowrap' ] )
		);

		$this->assertSame( $this->cssMap( [ 'flex-wrap' => 'nowrap !important' ] ), $result );
	}

	public function testReverseSuffixWhenWrapAndReverseTrue(): void {
		$result = $this->invokeCss(
			$this->definition(),
			$this->setting(
				[
					'value'   => 'wrap',
					'reverse' => true,
				]
			)
		);

		$this->assertSame( $this->cssMap( [ 'flex-wrap' => 'wrap-reverse !important' ] ), $result );
	}

	public function testReverseIgnoredWhenValueIsNotWrap(): void {
		$result = $this->invokeCss(
			$this->definition(),
			$this->setting(
				[
					'value'   => 'nowrap',
					'reverse' => true,
				]
			)
		);

		$this->assertSame( $this->cssMap( [ 'flex-wrap' => 'nowrap !important' ] ), $result );
	}
}
