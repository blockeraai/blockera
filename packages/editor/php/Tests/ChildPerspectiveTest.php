<?php

namespace Blockera\Editor\Tests;

require_once __DIR__ . '/Fixtures/child-perspective-value-addon-stub.php';

use Blockera\Editor\StyleDefinitions\ChildPerspective;

/**
 * @covers \Blockera\Editor\StyleDefinitions\ChildPerspective
 * @covers \Blockera\Editor\StyleDefinitions\ChildPerspective::css
 */
class ChildPerspectiveTest extends StyleDefinitionTestCase {

	protected string $definition_class = ChildPerspective::class;

	public function testReturnsEmptyOnGuards(): void {
		$definition = $this->definition();

		$this->assertSame( [], $this->invokeCss( $definition, [] ) );
		$this->assertSame( [], $this->invokeCss( $definition, [ 'type' => 'perspective' ] ) );
		$this->assertSame( [], $this->invokeCss( $definition, [ 'type' => 'child-perspective' ] ) );
		$this->assertSame( [], $this->invokeCss( $definition, $this->typedSetting( 'child-perspective', '' ) ) );
		$this->assertSame( [], $this->invokeCss( $definition, $this->typedSetting( 'child-perspective', null ) ) );
	}

	public function testEmitsResolvedPerspective(): void {
		$result = $this->invokeCss(
			$this->definition(),
			$this->typedSetting( 'child-perspective', '500px' )
		);

		$this->assertSame( $this->cssMap( [ 'perspective' => '500px' ] ), $result );
	}

	public function testZeroPxResolvesToZero(): void {
		$result = $this->invokeCss(
			$this->definition(),
			$this->typedSetting( 'child-perspective', '0px' )
		);

		$this->assertSame( $this->cssMap( [ 'perspective' => '0' ] ), $result );
	}

	public function testZeroPxFuncMapsToNone(): void {
		$result = $this->invokeCss(
			$this->definition(),
			$this->typedSetting( 'child-perspective', '0pxfunc' )
		);

		$this->assertSame( $this->cssMap( [ 'perspective' => 'none' ] ), $result );
	}

	public function testReturnsStoredCssWhenResolvedValueIsEmpty(): void {
		$this->assertSame(
			[],
			$this->invokeCss(
				$this->definition(),
				$this->typedSetting(
					'child-perspective',
					[ '__test_force_empty__' => true ]
				)
			)
		);
	}
}
