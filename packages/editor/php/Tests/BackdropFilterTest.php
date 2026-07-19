<?php

namespace Blockera\Editor\Tests;

use Blockera\Editor\StyleDefinitions\BackdropFilter;

/**
 * @covers \Blockera\Editor\StyleDefinitions\BackdropFilter
 * @covers \Blockera\Editor\StyleDefinitions\BackdropFilter::css
 * @covers \Blockera\Editor\StyleDefinitions\BackdropFilter::isValidSetting
 */
class BackdropFilterTest extends StyleDefinitionTestCase {

	protected string $definition_class = BackdropFilter::class;

	public function testReturnsEmptyOnGuards(): void {
		$definition = $this->definition();

		$this->assertSame( [], $this->invokeCss( $definition, [] ) );
		$this->assertSame( [], $this->invokeCss( $definition, [ 'type' => 'filter' ] ) );
		$this->assertSame( [], $this->invokeCss( $definition, [ 'type' => 'backdrop-filter' ] ) );
		$this->assertSame(
			[],
			$this->invokeCss(
				$definition,
				[
					'type'            => 'backdrop-filter',
					'backdrop-filter' => [],
				]
			)
		);
	}

	public function testBuildsBlurFilter(): void {
		$definition = $this->definition();

		$result = $this->invokeCss(
			$definition,
			[
				'type'            => 'backdrop-filter',
				'backdrop-filter' => [
					'blur-0' => [
						'type'      => 'blur',
						'blur'      => '5px',
						'isVisible' => true,
						'order'     => 0,
					],
				],
			]
		);

		$this->assertSame( $this->cssMap( [ 'backdrop-filter' => 'blur(5px)' ] ), $result );
	}

	public function testBuildsDropShadowFilter(): void {
		$definition = $this->definition();

		$result = $this->invokeCss(
			$definition,
			[
				'type'            => 'backdrop-filter',
				'backdrop-filter' => [
					'shadow-0' => [
						'type'               => 'drop-shadow',
						'drop-shadow-x'      => '1px',
						'drop-shadow-y'      => '2px',
						'drop-shadow-blur'   => '3px',
						'drop-shadow-color'  => '#000',
						'isVisible'          => true,
						'order'              => 0,
					],
				],
			]
		);

		$this->assertSame( $this->cssMap( [ 'backdrop-filter' => 'drop-shadow(1px 2px 3px #000)' ] ), $result );
	}

	public function testSkipsInvisibleFilters(): void {
		$definition = $this->definition();

		$result = $this->invokeCss(
			$definition,
			[
				'type'            => 'backdrop-filter',
				'backdrop-filter' => [
					'blur-0' => [
						'type'      => 'blur',
						'blur'      => '5px',
						'isVisible' => false,
						'order'     => 0,
					],
				],
			]
		);

		$this->assertSame( [], $result );
	}

	public function testAppendsToExistingDeclaration(): void {
		$definition = $this->definition();

		$this->invokeCss(
			$definition,
			[
				'type'            => 'backdrop-filter',
				'backdrop-filter' => [
					'blur-0' => [
						'type'      => 'blur',
						'blur'      => '2px',
						'isVisible' => true,
						'order'     => 0,
					],
				],
			]
		);

		$result = $this->invokeCss(
			$definition,
			[
				'type'            => 'backdrop-filter',
				'backdrop-filter' => [
					'bright-0' => [
						'type'       => 'brightness',
						'brightness' => '120%',
						'isVisible'  => true,
						'order'      => 0,
					],
				],
			]
		);

		$this->assertSame( $this->cssMap( [ 'backdrop-filter' => 'blur(2px) brightness(120%)' ] ), $result );
	}

	public function testIsValidSetting(): void {
		$definition = $this->definition();

		$this->assertFalse( $definition->isValidSetting( [] ) );
		$this->assertFalse(
			$definition->isValidSetting(
				[
					'type'      => 'blur',
					'isVisible' => false,
				]
			)
		);
		$this->assertTrue(
			$definition->isValidSetting(
				[
					'type'      => 'blur',
					'isVisible' => true,
				]
			)
		);
	}
}
