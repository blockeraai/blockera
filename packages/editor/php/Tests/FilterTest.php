<?php

namespace Blockera\Editor\Tests;

use Blockera\Editor\StyleDefinitions\Filter;

/**
 * @covers \Blockera\Editor\StyleDefinitions\Filter
 * @covers \Blockera\Editor\StyleDefinitions\Filter::css
 * @covers \Blockera\Editor\StyleDefinitions\Filter::filterRowToCssValue
 * @covers \Blockera\Editor\StyleDefinitions\Filter::isValidSetting
 */
class FilterTest extends StyleDefinitionTestCase {

	protected string $definition_class = Filter::class;

	public function testReturnsEmptyOnGuards(): void {
		$definition = $this->definition();

		$this->assertSame( [], $this->invokeCss( $definition, [] ) );
		$this->assertSame( [], $this->invokeCss( $definition, [ 'type' => 'blur' ] ) );
		$this->assertSame( [], $this->invokeCss( $definition, [ 'type' => 'filter' ] ) );
		$this->assertSame( [], $this->invokeCss( $definition, [ 'type' => 'filter', 'filter' => '' ] ) );
	}

	public function testEmitsTypedFilterFunction(): void {
		$result = $this->invokeCss(
			$this->definition(),
			[
				'type'   => 'filter',
				'filter' => [
					[
						'type'      => 'blur',
						'blur'      => '4px',
						'isVisible' => true,
					],
				],
			]
		);

		$this->assertSame( $this->cssMap( [ 'filter' => 'blur(4px)' ] ), $result );
	}

	public function testJoinsMultipleVisibleFilters(): void {
		$result = $this->invokeCss(
			$this->definition(),
			[
				'type'   => 'filter',
				'filter' => [
					[
						'type'      => 'blur',
						'blur'      => '2px',
						'isVisible' => true,
					],
					[
						'type'      => 'brightness',
						'brightness'=> '80%',
						'isVisible' => true,
					],
				],
			]
		);

		$this->assertSame( $this->cssMap( [ 'filter' => 'blur(2px) brightness(80%)' ] ), $result );
	}

	public function testSkipsInvisibleAndIncompleteRows(): void {
		$result = $this->invokeCss(
			$this->definition(),
			[
				'type'   => 'filter',
				'filter' => [
					[
						'type'      => 'blur',
						'blur'      => '1px',
						'isVisible' => false,
					],
					[
						'type'      => 'contrast',
						'isVisible' => true,
					],
					[
						'type'      => 'grayscale',
						'grayscale' => '50%',
						'isVisible' => true,
					],
				],
			]
		);

		$this->assertSame( $this->cssMap( [ 'filter' => 'grayscale(50%)' ] ), $result );
	}

	public function testDropShadowBranch(): void {
		$result = $this->invokeCss(
			$this->definition(),
			[
				'type'   => 'filter',
				'filter' => [
					[
						'type'              => 'drop-shadow',
						'drop-shadow-x'     => '1px',
						'drop-shadow-y'     => '2px',
						'drop-shadow-blur'  => '3px',
						'drop-shadow-color' => '#000',
						'isVisible'         => true,
					],
				],
			]
		);

		$this->assertSame(
			$this->cssMap( [ 'filter' => 'drop-shadow(1px 2px 3px #000)' ] ),
			$result
		);
	}

	public function testDeclarationOnlyDoesNotCallSetCss(): void {
		$definition = $this->definition();

		$result = $this->invokeCss(
			$definition,
			[
				'type'                     => 'filter',
				'filter'                   => [
					[
						'type'      => 'blur',
						'blur'      => '5px',
						'isVisible' => true,
					],
				],
				'_blockeraDeclarationOnly' => true,
			]
		);

		$this->assertSame( [], $result );
		$this->assertSame( 'blur(5px)', $definition->getDeclarations()['filter'] ?? null );
	}

	public function testFilterRowToCssValueHelpers(): void {
		$this->assertSame(
			'blur(3px)',
			Filter::filterRowToCssValue(
				[
					'type' => 'blur',
					'blur' => '3px',
				]
			)
		);
		$this->assertSame( '', Filter::filterRowToCssValue( [ 'type' => 'blur' ] ) );
	}

	public function testIsValidSetting(): void {
		$definition = $this->definition();

		$this->assertFalse( $definition->isValidSetting( [] ) );
		$this->assertFalse( $definition->isValidSetting( [ 'type' => '' ] ) );
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
					'type' => 'blur',
				]
			)
		);
	}

	public function testReturnsEmptyWhenNoVisibleFilters(): void {
		$result = $this->invokeCss(
			$this->definition(),
			[
				'type'   => 'filter',
				'filter' => [
					[
						'type'      => 'blur',
						'blur'      => '1px',
						'isVisible' => false,
					],
				],
			]
		);

		$this->assertSame( [], $result );
	}
}
