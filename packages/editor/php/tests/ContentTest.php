<?php

namespace Blockera\Editor\Tests;

use Blockera\Editor\StyleDefinitions\Content;

/**
 * @covers \Blockera\Editor\StyleDefinitions\Content
 * @covers \Blockera\Editor\StyleDefinitions\Content::css
 * @covers \Blockera\Editor\StyleDefinitions\Content::validate
 * @covers \Blockera\Editor\StyleDefinitions\Content::getCssProperty
 */
class ContentTest extends StyleDefinitionTestCase {

	protected string $definition_class = Content::class;

	/**
	 * @return array<string, mixed>
	 */
	private function contentSupports(): array {
		return [
			'blockeraContentPseudoElement' => [
				'hasDefaultValueInStates' => [ 'before', 'after' ],
			],
		];
	}

	private function contentDefinition(): Content {
		$definition = new Content( $this->contentSupports() );
		$definition->setBreakpoint( 'desktop' );
		$definition->setBlock(
			[
				'blockName' => 'core/group',
				'attrs'     => [],
			]
		);

		return $definition;
	}

	public function testGetCssProperty(): void {
		$this->assertSame( 'content', $this->contentDefinition()->getCssProperty() );
	}

	public function testReturnsEmptyOnGuards(): void {
		$definition = $this->contentDefinition();

		$this->assertSame( [], $this->invokeCss( $definition, [] ) );
		$this->assertSame( [], $this->invokeCss( $definition, [ 'type' => 'opacity' ] ) );
		$this->assertSame( [], $this->invokeCss( $definition, [ 'type' => 'content' ] ) );
	}

	public function testValidateBlocksEmptyQuotesOnNormalState(): void {
		$definition = $this->contentDefinition();
		$definition->setPseudoState( 'normal' );

		$this->assertSame(
			[],
			$this->invokeCss(
				$definition,
				[
					'type'    => 'content',
					'content' => '""',
				]
			)
		);
	}

	public function testValidateAllowsEmptyQuotesOnBeforeState(): void {
		$definition = $this->contentDefinition();
		$definition->setPseudoState( 'before' );

		$this->assertSame(
			$this->cssMap( [ 'content' => '""' ] ),
			$this->invokeCss(
				$definition,
				[
					'type'    => 'content',
					'content' => '""',
				]
			)
		);
	}

	public function testEmitsPlainContent(): void {
		$definition = $this->contentDefinition();

		$this->assertSame(
			$this->cssMap( [ 'content' => 'Hello' ] ),
			$this->invokeCss(
				$definition,
				[
					'type'    => 'content',
					'content' => 'Hello',
				]
			)
		);
	}

	public function testStripsMatchingQuotesFromSingleFunction(): void {
		$definition = $this->contentDefinition();

		$this->assertSame(
			$this->cssMap( [ 'content' => 'attr(data-label)' ] ),
			$this->invokeCss(
				$definition,
				[
					'type'    => 'content',
					'content' => '"attr(data-label)"',
				]
			)
		);
	}

	public function testWrapsEmbeddedFunctionsInMixedContent(): void {
		$definition = $this->contentDefinition();

		$this->assertSame(
			$this->cssMap( [ 'content' => 'prefix "attr(title)" suffix' ] ),
			$this->invokeCss(
				$definition,
				[
					'type'    => 'content',
					'content' => 'prefix attr(title) suffix',
				]
			)
		);
	}

	public function testHandlesCounterAndUrlFunctions(): void {
		$definition = $this->contentDefinition();

		$this->assertSame(
			$this->cssMap( [ 'content' => 'counter(section)' ] ),
			$this->invokeCss(
				$definition,
				[
					'type'    => 'content',
					'content' => 'counter(section)',
				]
			)
		);

		$this->assertSame(
			$this->cssMap( [ 'content' => 'prefix "url(icon.svg)"' ] ),
			$this->invokeCss(
				$definition,
				[
					'type'    => 'content',
					'content' => 'prefix url(icon.svg)',
				]
			)
		);
	}

	public function testSingleQuotedFunctionIsStripped(): void {
		$definition = $this->contentDefinition();

		$this->assertSame(
			$this->cssMap( [ 'content' => 'attr(data-label)' ] ),
			$this->invokeCss(
				$definition,
				[
					'type'    => 'content',
					'content' => "'attr(data-label)'",
				]
			)
		);
	}

	public function testNonStringResolvedValueIsEmittedWithoutSanitization(): void {
		$definition = $this->contentDefinition();
		$definition->setPseudoState( 'after' );

		$payload = [
			'isValueAddon' => true,
			'valueType'    => 'dynamic-value',
			'settings'     => [],
			'name'         => 'missing',
		];

		$this->assertSame(
			$this->cssMap( [ 'content' => $payload ] ),
			$this->invokeCss(
				$definition,
				[
					'type'    => 'content',
					'content' => $payload,
				]
			)
		);
	}

	public function testValidateReturnsExistingStateWhenContentMissing(): void {
		$definition = $this->contentDefinition();
		$definition->setPseudoState( 'before' );

		$method = new \ReflectionMethod( Content::class, 'validate' );
		$method->setAccessible( true );

		$this->assertTrue( $method->invoke( $definition, [] ) );
	}
}
