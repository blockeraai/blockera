<?php

namespace Blockera\Editor\Tests;

use Blockera\Editor\StyleDefinitions\ColumnCount;

/**
 * @covers \Blockera\Editor\StyleDefinitions\ColumnCount
 * @covers \Blockera\Editor\StyleDefinitions\ColumnCount::css
 */
class ColumnCountTest extends StyleDefinitionTestCase {

	protected string $definition_class = ColumnCount::class;

	public function testReturnsEmptyOnGuards(): void {
		$definition = $this->definition();

		$this->assertSame( [], $this->invokeCss( $definition, [] ) );
		$this->assertSame( [], $this->invokeCss( $definition, [ 'type' => '' ] ) );
		$this->assertSame( [], $this->invokeCss( $definition, [ 'type' => 'columns' ] ) );
		$this->assertSame( [], $this->invokeCss( $definition, [ 'type' => 'column-count' ] ) );
	}

	public function testEmptyColumnsStillSetsCss(): void {
		$definition = $this->definition();

		$this->assertSame(
			[],
			$this->invokeCss(
				$definition,
				[
					'type'         => 'column-count',
					'column-count' => [
						'columns' => '',
					],
				]
			)
		);
	}

	public function testNoneColumnsMapsToInitial(): void {
		$definition = $this->definition();

		$this->assertSame(
			$this->cssMap( [ 'column-count' => 'initial' ] ),
			$this->invokeCss(
				$definition,
				[
					'type'         => 'column-count',
					'column-count' => [
						'columns' => 'none',
					],
				]
			)
		);
	}

	public function testColumnCountGapAndDivider(): void {
		$definition = $this->definition();

		$result = $this->invokeCss(
			$definition,
			[
				'type'         => 'column-count',
				'column-count' => [
					'columns' => '3-columns',
					'gap'     => '20px',
					'divider' => [
						'width' => '2px',
						'style' => 'dotted',
						'color' => '#000000',
					],
				],
			]
		);

		$this->assertSame(
			$this->cssMap(
				[
					'column-count'       => '3',
					'column-gap'         => '20px',
					'column-rule-color'  => '#000000',
					'column-rule-style'  => 'dotted',
					'column-rule-width'  => '2px',
				]
			),
			$result
		);
	}

	public function testDividerWithoutColorUsesDefaultStyle(): void {
		$definition = $this->definition();

		$result = $this->invokeCss(
			$definition,
			[
				'type'         => 'column-count',
				'column-count' => [
					'columns' => '2-columns',
					'divider' => [
						'width' => '1px',
					],
				],
			]
		);

		$this->assertSame(
			$this->cssMap(
				[
					'column-count'      => '2',
					'column-rule-style' => 'solid',
					'column-rule-width' => '1px',
				]
			),
			$result
		);
	}

	public function testDividerColorFalseyIsSkipped(): void {
		$definition = $this->definition();

		$result = $this->invokeCss(
			$definition,
			[
				'type'         => 'column-count',
				'column-count' => [
					'columns' => '2-columns',
					'divider' => [
						'width' => '1px',
						'color' => false,
					],
				],
			]
		);

		$this->assertArrayNotHasKey( 'column-rule-color', $result[''] );
	}
}
