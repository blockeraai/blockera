<?php

namespace Blockera\Editor\Tests;

use Blockera\Editor\StyleDefinitions\Gap;

/**
 * @covers \Blockera\Editor\StyleDefinitions\Gap
 * @covers \Blockera\Editor\StyleDefinitions\Gap::css
 */
class GapTest extends StyleDefinitionTestCase {

	protected string $definition_class = Gap::class;

	/**
	 * @param array<string, mixed> $gap
	 * @return array<string, mixed>
	 */
	private function gapSetting( array $gap ): array {
		return [
			'type' => 'gap',
			'gap'  => $gap,
		];
	}

	public function testReturnsEmptyOnGuards(): void {
		$definition = $this->definition();

		$this->assertSame( [], $this->invokeCss( $definition, [] ) );
		$this->assertSame( [], $this->invokeCss( $definition, [ 'type' => 'margin' ] ) );
		$this->assertSame( [], $this->invokeCss( $definition, [ 'type' => 'gap' ] ) );
		$this->assertSame( [], $this->invokeCss( $definition, [ 'type' => 'gap', 'gap' => [] ] ) );
	}

	public function testLockedGapUsesGapPropertyByDefault(): void {
		$definition = $this->definition();
		$definition->setSettings( [ 'blockeraDisplay' => 'flex' ] );

		$result = $this->invokeCss(
			$definition,
			$this->gapSetting(
				[
					'lock' => true,
					'gap'  => '20px',
				]
			)
		);

		$this->assertSame( $this->cssMap( [ 'gap' => '20px' ] ), $result );
	}

	public function testUnlockedGapEmitsRowAndColumnGap(): void {
		$definition = $this->definition();
		$definition->setSettings( [ 'blockeraDisplay' => 'grid' ] );

		$result = $this->invokeCss(
			$definition,
			$this->gapSetting(
				[
					'lock'    => false,
					'rows'    => '10px',
					'columns' => '15px',
				]
			)
		);

		$this->assertSame(
			$this->cssMap(
				[
					'row-gap'    => '10px',
					'column-gap' => '15px',
				]
			),
			$result
		);
	}

	public function testMarginGapTypeUsesMarginBlockStartWithImportant(): void {
		$definition = $this->definition();
		$definition->setConfig( [ 'gap-type' => 'margin' ] );

		$result = $this->invokeCss(
			$definition,
			$this->gapSetting(
				[
					'lock' => true,
					'gap'  => '8px',
				]
			)
		);

		$this->assertSame( $this->cssMap( [ 'margin-block-start' => '8px !important' ] ), $result );
	}

	public function testGapAndMarginWithBlockDisplayUsesMarginBlockStart(): void {
		$definition = $this->definition();
		$definition->setConfig( [ 'gap-type' => 'gap-and-margin' ] );
		$definition->setSettings( [ 'blockeraDisplay' => 'block' ] );

		$result = $this->invokeCss(
			$definition,
			$this->gapSetting(
				[
					'lock' => true,
					'gap'  => '12px',
				]
			)
		);

		$this->assertSame( $this->cssMap( [ 'margin-block-start' => '12px !important' ] ), $result );
	}

	public function testGapAndMarginWithFlexDisplayResetsWpMargin(): void {
		$definition = $this->definition();
		$definition->setConfig( [ 'gap-type' => 'gap-and-margin' ] );
		$definition->setSettings( [ 'blockeraDisplay' => 'flex' ] );

		$result = $this->invokeCss(
			$definition,
			$this->gapSetting(
				[
					'lock' => true,
					'gap'  => '16px',
				]
			)
		);

		$this->assertSame(
			[
				'.wp-block-group.is-layout-constrained > * + *' => [
					'margin-block-start' => '0 !important',
				],
				'' => [
					'gap' => '16px',
				],
			],
			$result
		);
	}

	public function testGapAndMarginWithEmptyDisplayMovesMarginToSuffixSelector(): void {
		$definition = $this->definition();
		$definition->setConfig( [ 'gap-type' => 'gap-and-margin' ] );

		$result = $this->invokeCss(
			$definition,
			$this->gapSetting(
				[
					'lock' => true,
					'gap'  => '24px',
				]
			)
		);

		$this->assertSame(
			[
				'.wp-block-group.is-layout-constrained > * + *' => [
					'margin-block-start' => '24px !important',
				],
			],
			$result
		);
		$this->assertArrayNotHasKey( 'margin-block-start', $definition->getDeclarations() );
	}

	public function testSkipsEmptyGapValues(): void {
		$definition = $this->definition();
		$definition->setSettings( [ 'blockeraDisplay' => 'flex' ] );

		$result = $this->invokeCss(
			$definition,
			$this->gapSetting(
				[
					'lock'    => false,
					'rows'    => '',
					'columns' => '',
				]
			)
		);

		$this->assertSame( [], $result );
	}
}
