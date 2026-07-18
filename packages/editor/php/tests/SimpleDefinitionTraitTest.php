<?php

namespace Blockera\Editor\Tests;

use Blockera\Editor\StyleDefinitions\AlignContent;
use Blockera\Editor\StyleDefinitions\AlignSelf;
use Blockera\Editor\StyleDefinitions\BackfaceVisibility;
use Blockera\Editor\StyleDefinitions\BaseStyleDefinition;
use Blockera\Editor\StyleDefinitions\BoxSizing;
use Blockera\Editor\StyleDefinitions\Contracts\StandardDefinition;
use Blockera\Editor\StyleDefinitions\Direction;
use Blockera\Editor\StyleDefinitions\FontSize;
use Blockera\Editor\StyleDefinitions\LetterSpacing;
use Blockera\Editor\StyleDefinitions\LineHeight;
use Blockera\Editor\StyleDefinitions\MixBlendMode;
use Blockera\Editor\StyleDefinitions\ObjectFit;
use Blockera\Editor\StyleDefinitions\Opacity;
use Blockera\Editor\StyleDefinitions\Overflow;
use Blockera\Editor\StyleDefinitions\TextAlign;
use Blockera\Editor\StyleDefinitions\TextDecoration;
use Blockera\Editor\StyleDefinitions\TextIndent;
use Blockera\Editor\StyleDefinitions\TextTransform;
use Blockera\Editor\StyleDefinitions\TextWrap;
use Blockera\Editor\StyleDefinitions\Traits\SimpleDefinitionTrait;
use Blockera\Editor\StyleDefinitions\WordBreak;
use Blockera\Editor\StyleDefinitions\WordSpacing;
use Blockera\Editor\StyleDefinitions\ZIndex;
use ReflectionMethod;

/**
 * @covers \Blockera\Editor\StyleDefinitions\Traits\SimpleDefinitionTrait
 */
class SimpleDefinitionTraitTest extends \Blockera\Dev\PHPUnit\AppTestCase {

	/**
	 * @return array<string, array{0: class-string<BaseStyleDefinition&StandardDefinition>, 1: string}>
	 */
	public function consumerProvider(): array {
		return [
			'AlignContent'       => [ AlignContent::class, 'align-content' ],
			'AlignSelf'          => [ AlignSelf::class, 'align-self' ],
			'BackfaceVisibility' => [ BackfaceVisibility::class, 'backface-visibility' ],
			'BoxSizing'          => [ BoxSizing::class, 'box-sizing' ],
			'Direction'          => [ Direction::class, 'direction' ],
			'FontSize'           => [ FontSize::class, 'font-size' ],
			'LetterSpacing'      => [ LetterSpacing::class, 'letter-spacing' ],
			'LineHeight'         => [ LineHeight::class, 'line-height' ],
			'MixBlendMode'       => [ MixBlendMode::class, 'mix-blend-mode' ],
			'ObjectFit'          => [ ObjectFit::class, 'object-fit' ],
			'Opacity'            => [ Opacity::class, 'opacity' ],
			'Overflow'           => [ Overflow::class, 'overflow' ],
			'TextAlign'          => [ TextAlign::class, 'text-align' ],
			'TextDecoration'     => [ TextDecoration::class, 'text-decoration' ],
			'TextIndent'         => [ TextIndent::class, 'text-indent' ],
			'TextTransform'      => [ TextTransform::class, 'text-transform' ],
			'TextWrap'           => [ TextWrap::class, 'text-wrap' ],
			'WordBreak'          => [ WordBreak::class, 'word-break' ],
			'WordSpacing'        => [ WordSpacing::class, 'word-spacing' ],
			'ZIndex'             => [ ZIndex::class, 'z-index' ],
		];
	}

	/**
	 * @param class-string<BaseStyleDefinition> $class
	 * @return array<string, mixed>
	 */
	private function css( string $class, array $setting ): array {
		$m = new ReflectionMethod( $class, 'css' );
		$m->setAccessible( true );

		return $m->invoke( new $class( [] ), $setting );
	}

	/**
	 * @dataProvider consumerProvider
	 * @param class-string<BaseStyleDefinition&StandardDefinition> $class
	 */
	public function testEmitsSingleProperty( string $class, string $property ): void {
		$result = $this->css(
			$class,
			[
				'type'    => $property,
				$property => '50%',
			]
		);

		$this->assertSame( [ '' => [ $property => '50%' ] ], $result );
	}

	/**
	 * @dataProvider consumerProvider
	 * @param class-string<BaseStyleDefinition&StandardDefinition> $class
	 */
	public function testResolvesValueAddon( string $class, string $property ): void {
		$result = $this->css(
			$class,
			[
				'type'    => $property,
				$property => '12pxfunc',
			]
		);

		$this->assertSame( [ '' => [ $property => '12px' ] ], $result );
	}

	/**
	 * @dataProvider consumerProvider
	 * @param class-string<BaseStyleDefinition&StandardDefinition> $class
	 */
	public function testReturnsEmptyOnGuards( string $class, string $property ): void {
		$this->assertSame( [], $this->css( $class, [] ) );
		$this->assertSame( [], $this->css( $class, [ 'type' => '' ] ) );
		$this->assertSame( [], $this->css( $class, [ 'type' => 'not-' . $property, $property => '1' ] ) );
		$this->assertSame( [], $this->css( $class, [ 'type' => $property ] ) );
		$this->assertSame( [], $this->css( $class, [ 'type' => $property, $property => '' ] ) );
	}

	public function testReturnsEmptyWhenNotStandardDefinition(): void {
		$def = new class([]) extends BaseStyleDefinition {
			use SimpleDefinitionTrait;
		};

		$m = new ReflectionMethod( $def, 'css' );
		$m->setAccessible( true );

		$this->assertSame(
			[],
			$m->invoke(
				$def,
				[
					'type'    => 'opacity',
					'opacity' => '1',
				]
			)
		);
	}

	public function testValidateHookCanBlockEmission(): void {
		$def = new class([]) extends BaseStyleDefinition implements StandardDefinition {
			use SimpleDefinitionTrait;

			public bool $allow = true;

			public function getCssProperty(): string {
				return 'opacity';
			}

			protected function validate( array $setting ): bool {
				return $this->allow;
			}
		};

		$m = new ReflectionMethod( $def, 'css' );
		$m->setAccessible( true );

		$setting = [
			'type'    => 'opacity',
			'opacity' => '0.5',
		];

		$def->allow = false;
		$this->assertSame( [], $m->invoke( $def, $setting ) );

		$def->allow = true;
		$this->assertSame( [ '' => [ 'opacity' => '0.5' ] ], $m->invoke( $def, $setting ) );
	}
}
