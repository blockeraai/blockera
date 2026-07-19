<?php

namespace Blockera\Editor\Tests;

use Blockera\Editor\StyleDefinitions\Width;

/**
 * @covers \Blockera\Editor\StyleDefinitions\Width
 * @covers \Blockera\Editor\StyleDefinitions\Width::css
 */
class WidthTest extends StyleDefinitionTestCase {

	protected string $definition_class = Width::class;

	/**
	 * @param array<string, mixed> $width_config
	 * @param array<string, mixed> $height_config
	 * @return array<string, mixed>
	 */
	private function widthSupports( array $width_config, array $height_config = [] ): array {
		$supports = [
			'blockeraWidth' => [
				'style-engine-config' => $width_config,
			],
		];

		if ( [] !== $height_config ) {
			$supports['blockeraHeight'] = [
				'style-engine-config' => $height_config,
			];
		}

		return $supports;
	}

	/**
	 * Width css() reads style-engine config via getStyleEngineConfig(), which expects blockName.
	 *
	 * @param array<string, mixed> $supports
	 */
	private function widthDefinition( array $supports = [] ): \Blockera\Editor\StyleDefinitions\BaseStyleDefinition {
		return $this->definitionWithBlock(
			[
				'blockName' => 'core/group',
				'attrs'     => [],
			],
			[] === $supports ? $this->widthSupports( [ 'width' => 'width' ] ) : $supports
		);
	}

	public function testReturnsEmptyOnGuards(): void {
		$definition = $this->widthDefinition();

		$this->assertSame( [], $this->invokeCss( $definition, [] ) );
		$this->assertSame( [], $this->invokeCss( $definition, [ 'type' => '' ] ) );
		$this->assertSame( [], $this->invokeCss( $definition, [ 'type' => 'height', 'width' => '100px' ] ) );
		$this->assertSame( [], $this->invokeCss( $definition, [ 'type' => 'width' ] ) );
		$this->assertSame( [], $this->invokeCss( $definition, $this->typedSetting( 'width', '' ) ) );
	}

	public function testReturnsEmptyWhenStyleEngineConfigKeyMissing(): void {
		$definition = $this->widthDefinition( $this->widthSupports( [ 'width' => '' ] ) );

		$this->assertSame( [], $this->invokeCss( $definition, $this->typedSetting( 'width', '100px' ) ) );
	}

	public function testEmitsPlainWidth(): void {
		$result = $this->invokeCss(
			$this->widthDefinition(),
			$this->typedSetting( 'width', '200px' )
		);

		$this->assertSame( $this->cssMap( [ 'width' => '200px' ] ), $result );
	}

	public function testStretchRewritesWidthKey(): void {
		$result = $this->invokeCss(
			$this->widthDefinition(),
			$this->typedSetting( 'width', 'stretch' )
		);

		$this->assertSame(
			$this->cssMap(
				[
					'width: 100%; width: -moz-available; width: -webkit-fill-available; width' => 'stretch',
				]
			),
			$result
		);
	}

	public function testFlexBasisGetsImportantSuffix(): void {
		$result = $this->invokeCss(
			$this->widthDefinition( $this->widthSupports( [ 'width' => 'flex-basis' ] ) ),
			$this->typedSetting( 'width', '50%' )
		);

		$this->assertSame( $this->cssMap( [ 'flex-basis' => '50% !important' ] ), $result );
	}

	public function testCoreIconSetsMatchingHeightWhenHeightUnset(): void {
		$result = $this->invokeCss(
			$this->definitionWithBlock(
				[
					'blockName' => 'core/icon',
					'attrs'     => [],
				],
				$this->widthSupports(
					[ 'width' => 'width' ],
					[ 'height' => 'height' ]
				)
			),
			$this->typedSetting( 'width', '24px' )
		);

		$this->assertSame(
			$this->cssMap(
				[
					'width'  => '24px',
					'height' => '24px',
				]
			),
			$result
		);
	}

	public function testCoreIconStretchSetsMatchingHeightStretchKey(): void {
		$result = $this->invokeCss(
			$this->definitionWithBlock(
				[
					'blockName' => 'core/icon',
					'attrs'     => [],
				],
				$this->widthSupports(
					[ 'width' => 'width' ],
					[ 'height' => 'height' ]
				)
			),
			$this->typedSetting( 'width', 'stretch' )
		);

		$this->assertSame(
			$this->cssMap(
				[
					'width: 100%; width: -moz-available; width: -webkit-fill-available; width' => 'stretch',
					'height: 100%; height: -moz-available; height: -webkit-fill-available; height' => 'stretch',
				]
			),
			$result
		);
	}

	public function testCoreIconSkipsHeightWhenHeightAlreadySet(): void {
		$result = $this->invokeCss(
			$this->definitionWithBlock(
				[
					'blockName' => 'core/icon',
					'attrs'     => [
						'blockeraHeight' => [ 'value' => '32px' ],
					],
				],
				$this->widthSupports(
					[ 'width' => 'width' ],
					[ 'height' => 'height' ]
				)
			),
			$this->typedSetting( 'width', '24px' )
		);

		$this->assertSame( $this->cssMap( [ 'width' => '24px' ] ), $result );
	}

	public function testCoreIconUsesDefaultHeightKeyWhenConfigEmpty(): void {
		$result = $this->invokeCss(
			$this->definitionWithBlock(
				[
					'blockName' => 'core/icon',
					'attrs'     => [],
				],
				$this->widthSupports( [ 'width' => 'width' ], [ 'height' => '' ] )
			),
			$this->typedSetting( 'width', '20px' )
		);

		$this->assertSame(
			$this->cssMap(
				[
					'width'  => '20px',
					'height' => '20px',
				]
			),
			$result
		);
	}
}
