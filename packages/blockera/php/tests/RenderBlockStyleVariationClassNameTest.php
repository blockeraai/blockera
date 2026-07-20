<?php

namespace Blockera\Setup\Tests;

/**
 * Input/output contract for blockera_render_block_style_variation_class_name().
 *
 * Locks every branch so a performance refactor can prove identical results.
 *
 * Hot path: `render_block` filter ({@see bootstrap/hooks.php}).
 *
 * @covers ::blockera_render_block_style_variation_class_name
 */
class RenderBlockStyleVariationClassNameTest extends \Blockera\Dev\PHPUnit\AppTestCase {

	/**
	 * @param mixed $block_content Block markup (or falsy early-return value).
	 * @param array $block         Parsed block.
	 * @return mixed
	 */
	private function render( $block_content, array $block ) {
		return blockera_render_block_style_variation_class_name( $block_content, $block );
	}

	/**
	 * @param string $class_name Block attrs.className.
	 * @return array
	 */
	private function block_with_class( string $class_name ): array {
		return array(
			'attrs' => array(
				'className' => $class_name,
			),
		);
	}

	public function testEmptyContentReturnsAsIs(): void {
		$this->assertSame( '', $this->render( '', $this->block_with_class( 'is-style-akbar--1' ) ) );
	}

	public function testFalsyContentReturnsAsIs(): void {
		$this->assertSame( false, $this->render( false, $this->block_with_class( 'is-style-akbar--1' ) ) );
		$this->assertSame( null, $this->render( null, $this->block_with_class( 'is-style-akbar--1' ) ) );
		$this->assertSame( 0, $this->render( 0, $this->block_with_class( 'is-style-akbar--1' ) ) );
		$this->assertSame( '0', $this->render( '0', $this->block_with_class( 'is-style-akbar--1' ) ) );
	}

	public function testEmptyClassNameReturnsContentUnchanged(): void {
		$html = '<p class="wp-block-paragraph">Hi</p>';
		$this->assertSame( $html, $this->render( $html, $this->block_with_class( '' ) ) );
	}

	public function testMissingAttrsReturnsContentUnchanged(): void {
		$html = '<p class="wp-block-paragraph">Hi</p>';
		$this->assertSame( $html, $this->render( $html, array() ) );
	}

	public function testMissingClassNameKeyReturnsContentUnchanged(): void {
		$html = '<p class="wp-block-paragraph">Hi</p>';
		$this->assertSame( $html, $this->render( $html, array( 'attrs' => array() ) ) );
	}

	public function testNonInstanceStyleClassReturnsUnchanged(): void {
		$html = '<p class="x">Hi</p>';
		$this->assertSame(
			$html,
			$this->render( $html, $this->block_with_class( 'is-style-default' ) )
		);
	}

	public function testNonInstanceSizeClassReturnsUnchanged(): void {
		$html = '<p class="x">Hi</p>';
		$this->assertSame(
			$html,
			$this->render( $html, $this->block_with_class( 'is-size-large' ) )
		);
	}

	public function testAppliesStyleInstanceToDoubleQuotedClass(): void {
		$this->assertSame(
			'<p class="wp-block-paragraph is-style-akbar--1">Hi</p>',
			$this->render(
				'<p class="wp-block-paragraph">Hi</p>',
				$this->block_with_class( 'is-style-akbar--1' )
			)
		);
	}

	public function testAppliesSizeInstanceOnly(): void {
		$this->assertSame(
			'<div class="wp-block-group is-size-large--2">x</div>',
			$this->render(
				'<div class="wp-block-group">x</div>',
				$this->block_with_class( 'is-size-large--2' )
			)
		);
	}

	public function testAppliesStyleAndSizeInstances(): void {
		$this->assertSame(
			'<p class="a is-style-a--1 is-size-b--2">x</p>',
			$this->render(
				'<p class="a">x</p>',
				$this->block_with_class( 'is-style-a--1 is-size-b--2' )
			)
		);
	}

	public function testStyleInstancesPrecedeSizeEvenWhenSizeAppearsFirstInClassName(): void {
		$this->assertSame(
			'<p class="a is-style-a--1 is-size-b--2">x</p>',
			$this->render(
				'<p class="a">x</p>',
				$this->block_with_class( 'is-size-b--2 is-style-a--1' )
			)
		);
	}

	public function testDedupesDuplicateInstanceTokens(): void {
		$this->assertSame(
			'<p class="a is-style-a--1 is-size-b--2">x</p>',
			$this->render(
				'<p class="a">x</p>',
				$this->block_with_class( 'is-style-a--1 is-style-a--1 is-size-b--2' )
			)
		);
	}

	public function testDoesNotDuplicateClassAlreadyPresent(): void {
		$this->assertSame(
			'<p class="is-style-a--1 wp-block">x</p>',
			$this->render(
				'<p class="is-style-a--1 wp-block">x</p>',
				$this->block_with_class( 'is-style-a--1' )
			)
		);
	}

	public function testSingleQuotedClassBecomesDoubleQuotedAndAppends(): void {
		$this->assertSame(
			'<p class="wp-block is-style-a--1">x</p>',
			$this->render(
				"<p class='wp-block'>x</p>",
				$this->block_with_class( 'is-style-a--1' )
			)
		);
	}

	public function testSingleQuotedClassAlreadyPresentStillNormalizesQuotes(): void {
		$this->assertSame(
			'<p class="is-style-a--1">x</p>',
			$this->render(
				"<p class='is-style-a--1'>x</p>",
				$this->block_with_class( 'is-style-a--1' )
			)
		);
	}

	public function testAddsClassAttributeWhenMissing(): void {
		$this->assertSame(
			'<p class="is-style-a--1" id="p1">x</p>',
			$this->render(
				'<p id="p1">x</p>',
				$this->block_with_class( 'is-style-a--1' )
			)
		);
	}

	public function testAddsClassOnSelfClosingTagPreservingSlash(): void {
		$this->assertSame(
			'<img class="is-style-a--1" src="x" />',
			$this->render(
				'<img src="x" />',
				$this->block_with_class( 'is-style-a--1' )
			)
		);
	}

	public function testAddsClassOnVoidTagWithoutSlash(): void {
		$this->assertSame(
			'<br class="is-style-a--1">',
			$this->render(
				'<br>',
				$this->block_with_class( 'is-style-a--1' )
			)
		);
	}

	public function testSkipsHtmlCommentAndAppliesToFirstRealTag(): void {
		$this->assertSame(
			'<!-- c --><p class="a is-style-a--1">x</p>',
			$this->render(
				'<!-- c --><p class="a">x</p>',
				$this->block_with_class( 'is-style-a--1' )
			)
		);
	}

	public function testSkipsDoctypeAndAppliesToFirstRealTag(): void {
		$this->assertSame(
			'<!DOCTYPE html><p class="a is-style-a--1">x</p>',
			$this->render(
				'<!DOCTYPE html><p class="a">x</p>',
				$this->block_with_class( 'is-style-a--1' )
			)
		);
	}

	public function testOnlyMutatesFirstWrapperTag(): void {
		$this->assertSame(
			'<div class="outer is-style-a--1"><p class="inner">x</p></div>',
			$this->render(
				'<div class="outer"><p class="inner">x</p></div>',
				$this->block_with_class( 'is-style-a--1' )
			)
		);
	}

	public function testNamespacedTagSupported(): void {
		$this->assertSame(
			'<svg:rect class="is-size-m--3" width="1"></svg:rect>',
			$this->render(
				'<svg:rect width="1"></svg:rect>',
				$this->block_with_class( 'is-size-m--3' )
			)
		);
	}

	public function testWhitespaceOnlyAttrsCollapseWhenAddingClass(): void {
		$this->assertSame(
			'<p class="is-style-a--1">x</p>',
			$this->render(
				'<p   >x</p>',
				$this->block_with_class( 'is-style-a--1' )
			)
		);
	}

	public function testCollapsesMultipleSpacesInsideExistingClass(): void {
		$this->assertSame(
			'<p class="a b is-style-a--1">x</p>',
			$this->render(
				'<p class="a  b">x</p>',
				$this->block_with_class( 'is-style-a--1' )
			)
		);
	}

	public function testPreservesNonClassAttributesAndClassPosition(): void {
		$this->assertSame(
			'<p id="i" class="a is-style-a--1" data-x="1">x</p>',
			$this->render(
				'<p id="i" class="a" data-x="1">x</p>',
				$this->block_with_class( 'is-style-a--1' )
			)
		);
	}

	public function testPrependsClassBeforeExistingAttributesWhenMissing(): void {
		$this->assertSame(
			'<p class="is-style-a--1 is-size-s--9" data-x="1" id="i">x</p>',
			$this->render(
				'<p data-x="1" id="i">x</p>',
				$this->block_with_class( 'is-style-a--1 is-size-s--9' )
			)
		);
	}

	public function testEscapesSpecialCharactersInInstanceClass(): void {
		$this->assertSame(
			'<p class="a is-style-a&amp;b--1">x</p>',
			$this->render(
				'<p class="a">x</p>',
				$this->block_with_class( 'is-style-a&b--1' )
			)
		);
	}

	public function testHyphenatedVariationSlug(): void {
		$this->assertSame(
			'<p class="a is-style-text-annotation--2">x</p>',
			$this->render(
				'<p class="a">x</p>',
				$this->block_with_class( 'is-style-text-annotation--2' )
			)
		);
	}

	public function testPlainTextWithoutTagsReturnsUnchanged(): void {
		$this->assertSame(
			'plain text',
			$this->render(
				'plain text',
				$this->block_with_class( 'is-style-a--1' )
			)
		);
	}

	public function testMultipleStyleAndSizeInstancesPreserveStyleThenSizeOrder(): void {
		$this->assertSame(
			'<p class="x is-style-a--1 is-style-b--3 is-size-s--2 is-size-m--4">y</p>',
			$this->render(
				'<p class="x">y</p>',
				$this->block_with_class( 'is-style-a--1 is-size-s--2 is-style-b--3 is-size-m--4' )
			)
		);
	}

	public function testMultipleStyleInstancesOnlyDedupesAndKeepsOrder(): void {
		$this->assertSame(
			'<p class="x is-style-a--1 is-style-b--2">y</p>',
			$this->render(
				'<p class="x">y</p>',
				$this->block_with_class( 'is-style-a--1 is-style-b--2 is-style-a--1' )
			)
		);
	}

	public function testMultipleSizeInstancesOnlyDedupesAndKeepsOrder(): void {
		$this->assertSame(
			'<p class="x is-size-s--1 is-size-m--2">y</p>',
			$this->render(
				'<p class="x">y</p>',
				$this->block_with_class( 'is-size-s--1 is-size-m--2 is-size-s--1' )
			)
		);
	}

	/**
	 * Realistic frontend-like markup (paragraph with Blockera + instance class).
	 */
	public function testRealisticParagraphMarkup(): void {
		// Instance class is appended after existing class tokens (not inserted mid-list).
		$this->assertSame(
			'<p class="blockera-block blockera-block-2 blockera-has-font-size is-style-akbar has-background wp-block-paragraph is-style-akbar--1">Custom variation.</p>',
			$this->render(
				'<p class="blockera-block blockera-block-2 blockera-has-font-size is-style-akbar has-background wp-block-paragraph">Custom variation.</p>',
				$this->block_with_class( 'blockera-block blockera-block-2 is-style-akbar is-style-akbar--1' )
			)
		);
	}
}
