<?php

namespace Blockera\Editor\Tests;

use Blockera\Editor\StyleDefinitions\Margin;

/**
 * @covers \Blockera\Editor\StyleDefinitions\Margin
 * @covers \Blockera\Editor\StyleDefinitions\Margin::css
 */
class MarginTest extends StyleDefinitionTestCase {

	protected string $definition_class = Margin::class;

	/**
	 * @param array<string, string> $sides
	 * @return array<string, mixed>
	 */
	private function setting( array $sides, string $type = 'margin' ): array {
		return $this->typedSetting(
			$type,
			[
				'margin' => $sides,
			]
		);
	}

	public function testReturnsEmptyWhenTypeMissing(): void {
		$definition = $this->definition();

		$this->assertSame( [], $this->invokeCss( $definition, [] ) );
		$this->assertSame( [], $this->invokeCss( $definition, [ 'margin' => [ 'margin' => [ 'top' => '1px' ] ] ] ) );
	}

	public function testReturnsEmptyWhenTypeIsEmptyString(): void {
		$definition = $this->definition();

		$this->assertSame(
			[],
			$this->invokeCss(
				$definition,
				[
					'type'   => '',
					'margin' => [
						'margin' => [
							'top' => '1px',
						],
					],
				]
			)
		);
	}

	public function testReturnsEmptyWhenMarginKeyMissingOrInvalid(): void {
		$definition = $this->definition();

		$this->assertSame(
			[],
			$this->invokeCss(
				$definition,
				[
					'type'   => 'margin',
					'margin' => [
						'padding' => [
							'top' => '1px',
						],
					],
				]
			)
		);

		$this->assertSame(
			[],
			$this->invokeCss(
				$definition,
				[
					'type'   => 'margin',
					'margin' => [
						'margin' => '10px',
					],
				]
			)
		);

		$this->assertSame( [], $this->invokeCss( $definition, $this->setting( [] ) ) );
	}

	public function testEmitsLonghandWithImportantOnLeftAndRight(): void {
		$definition = $this->definition();

		$result = $this->invokeCss(
			$definition,
			$this->setting(
				[
					'top'    => '10px',
					'right'  => '15px',
					'bottom' => '20px',
					'left'   => '25px',
				]
			)
		);

		$this->assertSame(
			$this->cssMap(
				[
					'margin-top'    => '10px',
					'margin-right'  => '15px !important',
					'margin-bottom' => '20px',
					'margin-left'   => '25px !important',
				]
			),
			$result
		);
	}

	public function testSkipsEmptySides(): void {
		$definition = $this->definition();

		$result = $this->invokeCss(
			$definition,
			$this->setting(
				[
					'top'   => '8px',
					'right' => '',
					'left'  => '4px',
				]
			)
		);

		$this->assertSame(
			$this->cssMap(
				[
					'margin-top'  => '8px',
					'margin-left' => '4px !important',
				]
			),
			$result
		);
	}

	public function testResolvesValueAddons(): void {
		$definition = $this->definition();

		$result = $this->invokeCss(
			$definition,
			$this->setting(
				[
					'right' => '12pxfunc',
					'left'  => [
						'isValueAddon' => true,
						'valueType'    => 'variable',
						'settings'     => [
							'var'   => '--wp--preset--spacing--40',
							'value' => '1rem',
						],
					],
				]
			)
		);

		$this->assertSame(
			$this->cssMap(
				[
					'margin-right' => '12px !important',
					'margin-left'  => 'var(--wp--preset--spacing--40, 1rem) !important',
				]
			),
			$result
		);
	}

	public function testAllEmptySidesDoesNotSetCss(): void {
		$definition = $this->definition();

		$result = $this->invokeCss(
			$definition,
			$this->setting(
				[
					'top'    => '',
					'right'  => '',
					'bottom' => '',
					'left'   => '',
				]
			)
		);

		$this->assertSame( [], $result );
	}

	public function testCustomTypeKeyIsRespected(): void {
		$definition = $this->definition();

		$result = $this->invokeCss(
			$definition,
			[
				'type'    => 'spacing',
				'spacing' => [
					'margin' => [
						'top' => '5px',
					],
				],
			]
		);

		$this->assertSame( $this->cssMap( [ 'margin-top' => '5px' ] ), $result );
	}

	public function testSupportsExtraMarginKeys(): void {
		$definition = $this->definition();

		$result = $this->invokeCss(
			$definition,
			$this->setting(
				[
					'block-start' => '6px',
				]
			)
		);

		$this->assertSame( $this->cssMap( [ 'margin-block-start' => '6px' ] ), $result );
	}
}
