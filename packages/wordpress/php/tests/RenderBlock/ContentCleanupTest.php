<?php

namespace Blockera\WordPress\Tests\RenderBlock;

use Blockera\WordPress\RenderBlock\ContentCleanup;

class ContentCleanupTest extends \WP_UnitTestCase {

	protected ContentCleanup $cleanup;

	public function setUp(): void {

		parent::setUp();
		$this->cleanup = new ContentCleanup();
	}

	/**
	 * @dataProvider processDataProvider
	 *
	 * @param array $fixture Fixture data with 'input', 'expected_content', and 'expected_style'.
	 *
	 * @return void
	 */
	public function testProcess( array $fixture ): void {

		$result = $this->cleanup->process( $fixture['input'] );

		$this->assertIsArray( $result );
		$this->assertArrayHasKey( 'content', $result );
		$this->assertArrayHasKey( 'style', $result );
		$this->assertIsString( $result['content'] );
		$this->assertIsString( $result['style'] );

		// Verify inline styles are removed from content (unless explicitly skipped).
		// Only perform this check if we expect ALL styles to be removed (no skip_style_removal
		// and no content_contains that includes styles, which would indicate some should remain).
		if ( ! empty( $fixture['input'] ) && strpos( $fixture['input'], 'style=' ) !== false ) {
			if ( empty( $fixture['skip_style_removal'] ) ) {
				// Check if fixture expects any styles to remain in content_contains
				$expects_styles_to_remain = false;
				if ( isset( $fixture['content_contains'] ) && is_array( $fixture['content_contains'] ) ) {
					foreach ( $fixture['content_contains'] as $string ) {
						if ( strpos( $string, 'style=' ) !== false ) {
							$expects_styles_to_remain = true;
							break;
						}
					}
				}
				
				// Only assert all styles removed if we don't expect any to remain
				if ( ! $expects_styles_to_remain ) {
					$this->assertStringNotContainsString( 'style=', $result['content'], 'Inline styles should be removed from content' );
				}
			}
		}

		// Exact content validation.
		if ( isset( $fixture['expected_content'] ) ) {
			$this->assertEquals( $fixture['expected_content'], $result['content'], 'Content should match expected output' );
		}

		// Exact style validation.
		if ( isset( $fixture['expected_style'] ) ) {
			$this->assertEquals( $fixture['expected_style'], $result['style'], 'Style should match expected output' );
		}

		// Pattern-based validation for cases with unpredictable values (like hashes).
		if ( isset( $fixture['content_patterns'] ) && is_array( $fixture['content_patterns'] ) ) {
			foreach ( $fixture['content_patterns'] as $pattern ) {
				$this->assertMatchesRegularExpression( $pattern, $result['content'], 'Content should match pattern: ' . $pattern );
			}
		}

		if ( isset( $fixture['style_patterns'] ) && is_array( $fixture['style_patterns'] ) ) {
			foreach ( $fixture['style_patterns'] as $pattern ) {
				$this->assertMatchesRegularExpression( $pattern, $result['style'], 'Style should match pattern: ' . $pattern );
			}
		}

		// Content must contain/not contain specific strings.
		if ( isset( $fixture['content_contains'] ) && is_array( $fixture['content_contains'] ) ) {
			foreach ( $fixture['content_contains'] as $string ) {
				$this->assertStringContainsString( $string, $result['content'], 'Content should contain: ' . $string );
			}
		}

		if ( isset( $fixture['content_not_contains'] ) && is_array( $fixture['content_not_contains'] ) ) {
			foreach ( $fixture['content_not_contains'] as $string ) {
				$this->assertStringNotContainsString( $string, $result['content'], 'Content should not contain: ' . $string );
			}
		}

		// Style must contain/not contain specific strings.
		if ( isset( $fixture['style_contains'] ) && is_array( $fixture['style_contains'] ) ) {
			foreach ( $fixture['style_contains'] as $string ) {
				$this->assertStringContainsString( $string, $result['style'], 'Style should contain: ' . $string );
			}
		}

		if ( isset( $fixture['style_not_contains'] ) && is_array( $fixture['style_not_contains'] ) ) {
			foreach ( $fixture['style_not_contains'] as $string ) {
				$this->assertStringNotContainsString( $string, $result['style'], 'Style should not contain: ' . $string );
			}
		}
	}

	public function processDataProvider(): array {

		$fixtures = require __DIR__ . '/Fixtures/ContentCleanup/process-fixtures.php';
		
		// PHPUnit data provider: each element is passed as arguments to the test method.
		// Since testProcess expects a single array argument, wrap each fixture in an array.
		return array_map(
			function( $fixture ) {
				return [ $fixture ];
			},
			$fixtures
		);
	}

	public function testProcessWithEmptyContent(): void {

		$result = $this->cleanup->process( '' );

		$this->assertEquals(
			[
				'content' => '',
				'style'   => '',
			],
			$result
		);
	}

	public function testProcessWithNoInlineStyles(): void {

		$html = '<div class="container">Content</div>';

		$result = $this->cleanup->process( $html );

		$this->assertEquals( $html, $result['content'] );
		$this->assertEquals( '', $result['style'] );
	}

	public function testProcessWithNoStyleKeyword(): void {

		$html = '<div class="container">Content</div>';

		$result = $this->cleanup->process( $html );

		$this->assertEquals( $html, $result['content'] );
		$this->assertEquals( '', $result['style'] );
	}

	public function testProcessPriority1BlockeraBlockClass(): void {

		$html = '<div class="blockera-block-abc123" style="color: red; margin: 10px;">Content</div>';

		$result = $this->cleanup->process( $html );

		$this->assertStringNotContainsString( 'style=', $result['content'] );
		$this->assertStringContainsString( ':where(.blockera-block-abc123)', $result['style'] );
		$this->assertStringContainsString( 'color: red', $result['style'] );
		$this->assertStringContainsString( 'margin: 10px', $result['style'] );
	}

	public function testProcessPriority2WpBlockClassShouldSkip(): void {

		$html = '<div class="wp-block-button" style="color: blue;">Button</div>';

		$result = $this->cleanup->process( $html );

		// Should skip processing - inline style should remain.
		$this->assertStringContainsString( 'style="color: blue;"', $result['content'] );
		// Should not generate any CSS.
		$this->assertEquals( '', $result['style'] );
	}

	public function testProcessPriority3ParentBlockeraBlock(): void {

		$html = '<div class="blockera-block-parent"><span style="color: green;">Child</span></div>';

		$result = $this->cleanup->process( $html );

		$this->assertStringNotContainsString( 'style=', $result['content'] );
		// Should use parent selector + child selector with counter-based naming.
		$this->assertStringContainsString( ':where(.blockera-block-parent .blockera-block-parent-child-1)', $result['style'] );
		// Child should get class based on parent class + counter.
		$this->assertStringContainsString( 'class="blockera-block-parent-child-1"', $result['content'] );
	}

	public function testProcessPriority3ParentWpBlockWithoutBlockeraBlock(): void {

		$html = '<div class="wp-block-group"><span style="color: red;">Child</span></div>';

		$result = $this->cleanup->process( $html );

		// Should skip processing - inline style should remain.
		$this->assertStringContainsString( 'style="color: red;"', $result['content'] );
		$this->assertEquals( '', $result['style'] );
	}

	public function testProcessPriority3ParentWpBlockWithBlockeraBlock(): void {

		$html = '<div class="wp-block-group blockera-block-xyz"><span style="color: blue;">Child</span></div>';

		$result = $this->cleanup->process( $html );

		$this->assertStringNotContainsString( 'style=', $result['content'] );
		// Should use blockera-block-* class from parent with counter-based child class.
		$this->assertStringContainsString( ':where(.blockera-block-xyz .blockera-block-xyz-child-1)', $result['style'] );
		$this->assertStringContainsString( 'class="blockera-block-xyz-child-1"', $result['content'] );
	}

	public function testProcessChildWithClassesPrioritizesWpAndNumbers(): void {

		$html = '<div class="blockera-block-parent"><span class="custom-class button-123 other-class" style="color: purple;">Button</span></div>';

		$result = $this->cleanup->process( $html );

		$this->assertStringNotContainsString( 'style=', $result['content'] );
		// Since child doesn't have blockera-block-* or wp-block-*, Priority 3 applies.
		// Should use parent + child classes (prioritizing classes with numbers: button-123).
		$this->assertStringContainsString( ':where(.blockera-block-parent', $result['style'] );
		$this->assertStringContainsString( '.button-123', $result['style'] );
		$this->assertStringContainsString( 'color: purple', $result['style'] );
	}

	public function testProcessChildWithNoClassesGeneratesUniqueClass(): void {

		$html = '<div class="blockera-block-parent"><span style="color: orange;">No classes</span></div>';

		$result = $this->cleanup->process( $html );

		$this->assertStringNotContainsString( 'style=', $result['content'] );
		// Should generate class using parent class + counter format.
		$this->assertStringContainsString( 'class="blockera-block-parent-child-1"', $result['content'] );
		$this->assertStringContainsString( ':where(.blockera-block-parent .blockera-block-parent-child-1)', $result['style'] );
	}

	public function testProcessMultipleElements(): void {

		$html = '<div class="blockera-block-1" style="padding: 20px;">
			<p class="blockera-block-2" style="margin: 10px;">First</p>
			<span class="wp-block-button" style="color: red;">Button</span>
		</div>';

		$result = $this->cleanup->process( $html );

		// wp-block-button should keep its inline style (skipped).
		$this->assertStringContainsString( 'style="color: red;"', $result['content'] );
		// blockera-block elements should have styles removed.
		$this->assertStringNotContainsString( 'style="padding: 20px"', $result['content'] );
		$this->assertStringNotContainsString( 'style="margin: 10px"', $result['content'] );
		// Should process blockera-block elements.
		$this->assertStringContainsString( ':where(.blockera-block-1)', $result['style'] );
		$this->assertStringContainsString( ':where(.blockera-block-2)', $result['style'] );
		$this->assertStringContainsString( 'padding: 20px', $result['style'] );
		$this->assertStringContainsString( 'margin: 10px', $result['style'] );
		// wp-block-button style should NOT be in CSS (skipped).
		$this->assertStringNotContainsString( 'color: red', $result['style'] );
	}

	public function testProcessWrapsSelectorInWhere(): void {

		$html = '<div class="blockera-block-test" style="color: red;">Content</div>';

		$result = $this->cleanup->process( $html );

		$this->assertStringContainsString( ':where(.blockera-block-test)', $result['style'] );
		$this->assertStringNotContainsString( '.blockera-block-test {', $result['style'] );
	}

	public function testProcessEnsuresSemicolonAtEndOfStyles(): void {

		$html = '<div class="blockera-block-test" style="color: red">Content</div>';

		$result = $this->cleanup->process( $html );

		$this->assertStringContainsString( 'color: red;', $result['style'] );
	}

	public function testProcessHandlesStyleWithSemicolon(): void {

		$html = '<div class="blockera-block-test" style="color: red;">Content</div>';

		$result = $this->cleanup->process( $html );

		// Should not duplicate semicolon.
		$this->assertStringNotContainsString( 'color: red;;', $result['style'] );
		$this->assertStringContainsString( 'color: red;', $result['style'] );
	}

	public function testProcessPriority1TakesPrecedenceOverPriority2(): void {

		$html = '<div class="blockera-block-abc wp-block-button" style="color: green;">Content</div>';

		$result = $this->cleanup->process( $html );

		// Should use blockera-block-* (Priority 1), not wp-block-* (Priority 2).
		$this->assertStringContainsString( ':where(.blockera-block-abc)', $result['style'] );
		// Should NOT contain a generated unique class selector (which would be a different blockera-block-* hash).
		// Check that the style contains only the expected selector, not a generated one.
		$this->assertMatchesRegularExpression( '/:where\(\.blockera-block-abc\)/', $result['style'] );
		// Should not generate new class since we use Priority 1.
		$this->assertDoesNotMatchRegularExpression( '/class="blockera-block-abc wp-block-button blockera-block-abc-child-\d+"/', $result['content'] );
	}

	/**
	 * Test that counter increments for multiple children under the same parent.
	 * Note: elements are processed in reverse order, so last element gets child-1.
	 */
	public function testProcessChildCounterIncrementsForSameParent(): void {

		$html = '<div class="blockera-block-parent">
			<span style="color: red;">Child 1</span>
			<span style="color: green;">Child 2</span>
			<span style="color: blue;">Child 3</span>
		</div>';

		$result = $this->cleanup->process( $html );

		// All children should have counter-based classes (reverse order: child3=1, child2=2, child1=3).
		$this->assertStringContainsString( 'class="blockera-block-parent-child-1"', $result['content'] );
		$this->assertStringContainsString( 'class="blockera-block-parent-child-2"', $result['content'] );
		$this->assertStringContainsString( 'class="blockera-block-parent-child-3"', $result['content'] );

		// All styles should be extracted.
		$this->assertStringContainsString( ':where(.blockera-block-parent .blockera-block-parent-child-1)', $result['style'] );
		$this->assertStringContainsString( ':where(.blockera-block-parent .blockera-block-parent-child-2)', $result['style'] );
		$this->assertStringContainsString( ':where(.blockera-block-parent .blockera-block-parent-child-3)', $result['style'] );
		$this->assertStringContainsString( 'color: red', $result['style'] );
		$this->assertStringContainsString( 'color: green', $result['style'] );
		$this->assertStringContainsString( 'color: blue', $result['style'] );
	}

	/**
	 * Test that counter is independent per parent class.
	 * Note: elements are processed in reverse order within each parent.
	 */
	public function testProcessChildCounterResetsForDifferentParents(): void {

		$html = '<div class="blockera-block-first">
			<span style="color: red;">First Parent Child 1</span>
			<span style="color: green;">First Parent Child 2</span>
		</div>
		<div class="blockera-block-second">
			<span style="color: blue;">Second Parent Child 1</span>
			<span style="color: yellow;">Second Parent Child 2</span>
		</div>';

		$result = $this->cleanup->process( $html );

		// Both parents' children should have counter-based classes.
		$this->assertStringContainsString( 'class="blockera-block-first-child-1"', $result['content'] );
		$this->assertStringContainsString( 'class="blockera-block-first-child-2"', $result['content'] );
		$this->assertStringContainsString( 'class="blockera-block-second-child-1"', $result['content'] );
		$this->assertStringContainsString( 'class="blockera-block-second-child-2"', $result['content'] );

		// Verify styles use correct selectors.
		$this->assertStringContainsString( ':where(.blockera-block-first .blockera-block-first-child-1)', $result['style'] );
		$this->assertStringContainsString( ':where(.blockera-block-first .blockera-block-first-child-2)', $result['style'] );
		$this->assertStringContainsString( ':where(.blockera-block-second .blockera-block-second-child-1)', $result['style'] );
		$this->assertStringContainsString( ':where(.blockera-block-second .blockera-block-second-child-2)', $result['style'] );
	}

	/**
	 * Test that counter is independent per parent in nested structures.
	 * Note: elements are processed in reverse order within each parent.
	 */
	public function testProcessChildCounterInNestedParents(): void {

		$html = '<div class="blockera-block-outer">
			<span style="margin: 10px;">Outer Child 1</span>
			<div class="blockera-block-inner">
				<span style="padding: 5px;">Inner Child 1</span>
				<span style="padding: 10px;">Inner Child 2</span>
			</div>
			<span style="margin: 20px;">Outer Child 2</span>
		</div>';

		$result = $this->cleanup->process( $html );

		// Outer parent's children should use outer parent's class + counter.
		// Note: "Outer Child 2" appears after "Outer Child 1" but is processed first due to reverse order.
		$this->assertStringContainsString( 'class="blockera-block-outer-child-1"', $result['content'] );
		$this->assertStringContainsString( 'class="blockera-block-outer-child-2"', $result['content'] );

		// Inner parent's children should use inner parent's class + counter (independent).
		$this->assertStringContainsString( 'class="blockera-block-inner-child-1"', $result['content'] );
		$this->assertStringContainsString( 'class="blockera-block-inner-child-2"', $result['content'] );

		// Verify styles use correct selectors.
		$this->assertStringContainsString( ':where(.blockera-block-outer .blockera-block-outer-child-1)', $result['style'] );
		$this->assertStringContainsString( ':where(.blockera-block-outer .blockera-block-outer-child-2)', $result['style'] );
		$this->assertStringContainsString( ':where(.blockera-block-inner .blockera-block-inner-child-1)', $result['style'] );
		$this->assertStringContainsString( ':where(.blockera-block-inner .blockera-block-inner-child-2)', $result['style'] );
	}

	/**
	 * Test that children with existing classes don't get counter-based classes.
	 * Note: elements are processed in reverse order.
	 */
	public function testProcessChildWithExistingClassesDontGetCounterClass(): void {

		$html = '<div class="blockera-block-parent">
			<span style="color: red;">No class child</span>
			<span class="existing-class-123" style="color: green;">Has class child</span>
			<span style="color: blue;">Another no class child</span>
		</div>';

		$result = $this->cleanup->process( $html );

		// First and third children (no classes) should get counter-based classes.
		// Due to reverse processing: "Another no class child" gets child-1, "No class child" gets child-2.
		$this->assertStringContainsString( 'class="blockera-block-parent-child-1"', $result['content'] );
		$this->assertStringContainsString( 'class="blockera-block-parent-child-2"', $result['content'] );

		// Second child (has class) should keep its existing class.
		$this->assertStringContainsString( 'class="existing-class-123"', $result['content'] );
		// Second child should NOT get a counter-based class.
		$this->assertStringNotContainsString( 'class="existing-class-123 blockera-block-parent-child', $result['content'] );

		// Verify styles for counter-based classes.
		$this->assertStringContainsString( ':where(.blockera-block-parent .blockera-block-parent-child-1)', $result['style'] );
		$this->assertStringContainsString( ':where(.blockera-block-parent .blockera-block-parent-child-2)', $result['style'] );
		// Verify style for existing class uses the existing class.
		$this->assertStringContainsString( '.existing-class-123', $result['style'] );
	}

	/**
	 * Test that counter resets between process() calls.
	 */
	public function testProcessCounterResetsOnNewProcessCall(): void {

		// First process call.
		$html1 = '<div class="blockera-block-parent">
			<span style="color: red;">Child 1</span>
		</div>';
		$result1 = $this->cleanup->process( $html1 );
		$this->assertStringContainsString( 'class="blockera-block-parent-child-1"', $result1['content'] );

		// Second process call - counter should reset.
		$html2 = '<div class="blockera-block-parent">
			<span style="color: blue;">Another Child</span>
		</div>';
		$result2 = $this->cleanup->process( $html2 );
		// Counter should reset, so this child should also be child-1.
		$this->assertStringContainsString( 'class="blockera-block-parent-child-1"', $result2['content'] );
	}

	/**
	 * Test that has-*-font-family classes are removed from blockera-block-* elements.
	 */
	public function testRemoveHasFontFamilyClassesFromBlockeraBlocks(): void {

		$html = '<div class="blockera-block-abc123 has-custom-font-family">Content</div>';

		$result = $this->cleanup->process( $html );

		$this->assertStringNotContainsString( 'has-custom-font-family', $result['content'] );
		$this->assertStringContainsString( 'blockera-block-abc123', $result['content'] );
	}

	/**
	 * Test that has-*-font-size classes are removed from blockera-block-* elements.
	 */
	public function testRemoveHasFontSizeClassesFromBlockeraBlocks(): void {

		$html = '<div class="blockera-block-xyz has-large-font-size">Content</div>';

		$result = $this->cleanup->process( $html );

		$this->assertStringNotContainsString( 'has-large-font-size', $result['content'] );
		$this->assertStringContainsString( 'blockera-block-xyz', $result['content'] );
	}

	/**
	 * Test that has-*-color classes are removed from blockera-block-* elements.
	 */
	public function testRemoveHasColorClassesFromBlockeraBlocks(): void {

		$html = '<div class="blockera-block-test has-primary-color">Content</div>';

		$result = $this->cleanup->process( $html );

		$this->assertStringNotContainsString( 'has-primary-color', $result['content'] );
		$this->assertStringContainsString( 'blockera-block-test', $result['content'] );
	}

	/**
	 * Test that has-text-* classes are NOT removed from blockera-block-* elements.
	 */
	public function testKeepHasTextColorClassesFromBlockeraBlocks(): void {

		$html = '<div class="blockera-block-abc has-text-primary">Content</div>';

		$result = $this->cleanup->process( $html );

		$this->assertStringContainsString( 'has-text-primary', $result['content'] );
		$this->assertStringContainsString( 'blockera-block-abc', $result['content'] );
	}

	/**
	 * Test that has-link-* classes are NOT removed from blockera-block-* elements.
	 */
	public function testKeepHasLinkColorClassesFromBlockeraBlocks(): void {

		$html = '<div class="blockera-block-xyz has-link-primary">Content</div>';

		$result = $this->cleanup->process( $html );

		$this->assertStringContainsString( 'has-link-primary', $result['content'] );
		$this->assertStringContainsString( 'blockera-block-xyz', $result['content'] );
	}

	/**
	 * Test that has-border-* classes are NOT removed from blockera-block-* elements.
	 */
	public function testKeepHasBorderColorClassesFromBlockeraBlocks(): void {

		$html = '<div class="blockera-block-test has-border-primary">Content</div>';

		$result = $this->cleanup->process( $html );

		$this->assertStringContainsString( 'has-border-primary', $result['content'] );
		$this->assertStringContainsString( 'blockera-block-test', $result['content'] );
	}

	/**
	 * Test that multiple removable classes are all removed from blockera-block-* elements.
	 */
	public function testRemoveMultipleHasClassesFromBlockeraBlocks(): void {

		$html = '<div class="blockera-block-abc has-custom-font-family has-large-font-size has-primary-color">Content</div>';

		$result = $this->cleanup->process( $html );

		$this->assertStringNotContainsString( 'has-custom-font-family', $result['content'] );
		$this->assertStringNotContainsString( 'has-large-font-size', $result['content'] );
		$this->assertStringNotContainsString( 'has-primary-color', $result['content'] );
		$this->assertStringContainsString( 'blockera-block-abc', $result['content'] );
	}

	/**
	 * Test that removable classes are removed but non-removable has-* classes are kept.
	 */
	public function testRemoveHasClassesButKeepNonRemovableHasClasses(): void {

		$html = '<div class="blockera-block-xyz has-custom-font-family has-text-primary has-link-secondary has-border-accent has-primary-color">Content</div>';

		$result = $this->cleanup->process( $html );

		// Removable classes should be removed.
		$this->assertStringNotContainsString( 'has-custom-font-family', $result['content'] );
		$this->assertStringNotContainsString( 'has-primary-color', $result['content'] );
		// Non-removable classes should be kept.
		$this->assertStringContainsString( 'has-text-primary', $result['content'] );
		$this->assertStringContainsString( 'has-link-secondary', $result['content'] );
		$this->assertStringContainsString( 'has-border-accent', $result['content'] );
		$this->assertStringContainsString( 'blockera-block-xyz', $result['content'] );
	}

	/**
	 * Test that elements without blockera-block-* classes are not modified.
	 */
	public function testDoNotRemoveHasClassesFromNonBlockeraBlocks(): void {

		$html = '<div class="wp-block-button has-custom-font-family has-primary-color">Button</div>';

		$result = $this->cleanup->process( $html );

		// Classes should remain because element doesn't have blockera-block-*.
		$this->assertStringContainsString( 'has-custom-font-family', $result['content'] );
		$this->assertStringContainsString( 'has-primary-color', $result['content'] );
		$this->assertStringContainsString( 'wp-block-button', $result['content'] );
	}

	/**
	 * Test that elements with blockera-block-* but no removable classes are not modified.
	 */
	public function testDoNotModifyBlockeraBlocksWithoutRemovableClasses(): void {

		$html = '<div class="blockera-block-abc custom-class other-class">Content</div>';

		$result = $this->cleanup->process( $html );

		// Should remain unchanged.
		$this->assertEquals( $html, $result['content'] );
	}

	/**
	 * Test that multiple elements are processed independently.
	 */
	public function testRemoveHasClassesFromMultipleBlockeraBlocks(): void {

		$html = '<div class="blockera-block-first has-custom-font-family">First</div>
			<div class="blockera-block-second has-large-font-size">Second</div>
			<div class="wp-block-button has-primary-color">Third</div>';

		$result = $this->cleanup->process( $html );

		// First element: removable class removed.
		$this->assertStringNotContainsString( 'has-custom-font-family', $result['content'] );
		$this->assertStringContainsString( 'blockera-block-first', $result['content'] );
		// Second element: removable class removed.
		$this->assertStringNotContainsString( 'has-large-font-size', $result['content'] );
		$this->assertStringContainsString( 'blockera-block-second', $result['content'] );
		// Third element: not modified (no blockera-block-*).
		$this->assertStringContainsString( 'has-primary-color', $result['content'] );
		$this->assertStringContainsString( 'wp-block-button', $result['content'] );
	}

	/**
	 * Test that class attribute with single quotes is handled correctly.
	 */
	public function testRemoveHasClassesWithSingleQuotes(): void {

		$html = "<div class='blockera-block-abc has-custom-font-family has-primary-color'>Content</div>";

		$result = $this->cleanup->process( $html );

		$this->assertStringNotContainsString( 'has-custom-font-family', $result['content'] );
		$this->assertStringNotContainsString( 'has-primary-color', $result['content'] );
		$this->assertStringContainsString( 'blockera-block-abc', $result['content'] );
	}

	/**
	 * Test that multiple spaces between classes are normalized.
	 */
	public function testNormalizeSpacesWhenRemovingHasClasses(): void {

		$html = '<div class="blockera-block-abc   has-custom-font-family    has-primary-color">Content</div>';

		$result = $this->cleanup->process( $html );

		$this->assertStringNotContainsString( 'has-custom-font-family', $result['content'] );
		$this->assertStringNotContainsString( 'has-primary-color', $result['content'] );
		// Should have normalized spaces (single space between remaining classes).
		$this->assertStringNotContainsString( '  ', $result['content'] ); // No double spaces.
		$this->assertStringContainsString( 'blockera-block-abc', $result['content'] );
	}

	/**
	 * Test that empty class attribute after removal is handled correctly.
	 */
	public function testHandleEmptyClassAfterRemoval(): void {

		$html = '<div class="blockera-block-abc has-custom-font-family">Content</div>';

		$result = $this->cleanup->process( $html );

		// Should still have blockera-block-abc class.
		$this->assertStringContainsString( 'blockera-block-abc', $result['content'] );
		$this->assertStringNotContainsString( 'has-custom-font-family', $result['content'] );
	}

	/**
	 * Test that has-* classes with complex names (numbers, hyphens) are handled correctly.
	 */
	public function testRemoveHasClassesWithComplexNames(): void {

		$html = '<div class="blockera-block-abc has-custom-123-font-family has-large-456-font-size has-primary-789-color">Content</div>';

		$result = $this->cleanup->process( $html );

		$this->assertStringNotContainsString( 'has-custom-123-font-family', $result['content'] );
		$this->assertStringNotContainsString( 'has-large-456-font-size', $result['content'] );
		$this->assertStringNotContainsString( 'has-primary-789-color', $result['content'] );
		$this->assertStringContainsString( 'blockera-block-abc', $result['content'] );
	}

	/**
	 * Test that has-* classes are removed even when element has inline styles.
	 */
	public function testRemoveHasClassesWithInlineStyles(): void {

		$html = '<div class="blockera-block-abc has-custom-font-family has-primary-color" style="color: red; margin: 10px;">Content</div>';

		$result = $this->cleanup->process( $html );

		// Has classes should be removed.
		$this->assertStringNotContainsString( 'has-custom-font-family', $result['content'] );
		$this->assertStringNotContainsString( 'has-primary-color', $result['content'] );
		// Blockera class should remain.
		$this->assertStringContainsString( 'blockera-block-abc', $result['content'] );
		// Inline style should be removed and converted to CSS.
		$this->assertStringNotContainsString( 'style=', $result['content'] );
		$this->assertStringContainsString( 'color: red', $result['style'] );
		$this->assertStringContainsString( 'margin: 10px', $result['style'] );
	}

	/**
	 * Test that nested blockera-block elements are processed independently.
	 */
	public function testRemoveHasClassesFromNestedBlockeraBlocks(): void {

		$html = '<div class="blockera-block-parent has-custom-font-family">
			<div class="blockera-block-child has-large-font-size">Child</div>
		</div>';

		$result = $this->cleanup->process( $html );

		// Parent: removable class removed.
		$this->assertStringNotContainsString( 'has-custom-font-family', $result['content'] );
		$this->assertStringContainsString( 'blockera-block-parent', $result['content'] );
		// Child: removable class removed.
		$this->assertStringNotContainsString( 'has-large-font-size', $result['content'] );
		$this->assertStringContainsString( 'blockera-block-child', $result['content'] );
	}

	/**
	 * Test that has-* classes at the beginning of class attribute are removed correctly.
	 */
	public function testRemoveHasClassesAtBeginningOfClassAttribute(): void {

		$html = '<div class="has-custom-font-family blockera-block-abc other-class">Content</div>';

		$result = $this->cleanup->process( $html );

		$this->assertStringNotContainsString( 'has-custom-font-family', $result['content'] );
		$this->assertStringContainsString( 'blockera-block-abc', $result['content'] );
		$this->assertStringContainsString( 'other-class', $result['content'] );
	}

	/**
	 * Test that has-* classes at the end of class attribute are removed correctly.
	 */
	public function testRemoveHasClassesAtEndOfClassAttribute(): void {

		$html = '<div class="blockera-block-abc other-class has-primary-color">Content</div>';

		$result = $this->cleanup->process( $html );

		$this->assertStringNotContainsString( 'has-primary-color', $result['content'] );
		$this->assertStringContainsString( 'blockera-block-abc', $result['content'] );
		$this->assertStringContainsString( 'other-class', $result['content'] );
	}

	/**
	 * Test that has-* classes in the middle of class attribute are removed correctly.
	 */
	public function testRemoveHasClassesInMiddleOfClassAttribute(): void {

		$html = '<div class="blockera-block-abc has-custom-font-family other-class has-primary-color another-class">Content</div>';

		$result = $this->cleanup->process( $html );

		$this->assertStringNotContainsString( 'has-custom-font-family', $result['content'] );
		$this->assertStringNotContainsString( 'has-primary-color', $result['content'] );
		$this->assertStringContainsString( 'blockera-block-abc', $result['content'] );
		$this->assertStringContainsString( 'other-class', $result['content'] );
		$this->assertStringContainsString( 'another-class', $result['content'] );
	}

	/**
	 * Test that empty content returns empty string.
	 */
	public function testRemoveHasClassesWithEmptyContent(): void {

		$html = '';

		$result = $this->cleanup->process( $html );

		$this->assertEquals( '', $result['content'] );
		$this->assertEquals( '', $result['style'] );
	}

	/**
	 * Test that display: none alone is preserved in tag and not extracted to CSS.
	 * Special case: When only preserved properties exist, tag should remain unchanged
	 * (no class added, inline style remains).
	 */
	public function testPreserveDisplayNoneAlone(): void {

		$html = '<div class="blockera-block-abc123" style="display: none;">Content</div>';

		$result = $this->cleanup->process( $html );

		// Verify tag was not modified - should match input exactly when only preserved properties exist.
		$this->assertEquals( $html, $result['content'], 'Tag should remain unchanged when only preserved properties exist' );
		
		// Additional verifications:
		// display: none should remain in tag.
		$this->assertStringContainsString( 'style=', $result['content'] );
		$this->assertStringContainsString( 'display: none', $result['content'] );
		// Tag should remain exactly as input (no additional classes added).
		$this->assertStringContainsString( 'class="blockera-block-abc123"', $result['content'] );
		// Should not be in CSS output.
		$this->assertStringNotContainsString( 'display: none', $result['style'] );
		// CSS should be empty since only display: none was present.
		$this->assertEquals( '', $result['style'] );
		// Verify no CSS rule was created for this element.
		$this->assertStringNotContainsString( ':where(.blockera-block-abc123)', $result['style'] );
	}

	/**
	 * Test that display: none with other properties preserves display: none and extracts others to CSS.
	 */
	public function testPreserveDisplayNoneWithOtherProperties(): void {

		$html = '<div class="blockera-block-abc123" style="color: red; display: none; margin: 10px;">Content</div>';

		$result = $this->cleanup->process( $html );

		// display: none should remain in tag.
		$this->assertStringContainsString( 'style="display: none"', $result['content'] );
		// Other properties should be in CSS.
		$this->assertStringContainsString( 'color: red', $result['style'] );
		$this->assertStringContainsString( 'margin: 10px', $result['style'] );
		// display: none should NOT be in CSS.
		$this->assertStringNotContainsString( 'display: none', $result['style'] );
	}

	/**
	 * Test that display: none at beginning of style string is preserved.
	 */
	public function testPreserveDisplayNoneAtBeginning(): void {

		$html = '<div class="blockera-block-abc123" style="display: none; color: red;">Content</div>';

		$result = $this->cleanup->process( $html );

		$this->assertStringContainsString( 'style="display: none"', $result['content'] );
		$this->assertStringContainsString( 'color: red', $result['style'] );
		$this->assertStringNotContainsString( 'display: none', $result['style'] );
	}

	/**
	 * Test that display: none at end of style string is preserved.
	 */
	public function testPreserveDisplayNoneAtEnd(): void {

		$html = '<div class="blockera-block-abc123" style="color: red; display: none;">Content</div>';

		$result = $this->cleanup->process( $html );

		$this->assertStringContainsString( 'style="display: none"', $result['content'] );
		$this->assertStringContainsString( 'color: red', $result['style'] );
		$this->assertStringNotContainsString( 'display: none', $result['style'] );
	}

	/**
	 * Test that display: none in middle of style string is preserved.
	 */
	public function testPreserveDisplayNoneInMiddle(): void {

		$html = '<div class="blockera-block-abc123" style="color: red; display: none; margin: 10px;">Content</div>';

		$result = $this->cleanup->process( $html );

		$this->assertStringContainsString( 'style="display: none"', $result['content'] );
		$this->assertStringContainsString( 'color: red', $result['style'] );
		$this->assertStringContainsString( 'margin: 10px', $result['style'] );
		$this->assertStringNotContainsString( 'display: none', $result['style'] );
	}

	/**
	 * Test case-insensitive matching: Display: None.
	 * When only preserved properties exist, tag remains unchanged (original case preserved).
	 */
	public function testPreserveDisplayNoneCaseInsensitive(): void {

		$html = '<div class="blockera-block-abc123" style="Display: None;">Content</div>';

		$result = $this->cleanup->process( $html );

		// Tag should remain unchanged when only preserved properties exist (original case preserved).
		$this->assertEquals( $html, $result['content'], 'Tag should remain unchanged when only preserved properties exist' );
		// Verify style attribute exists (case-insensitive matching works, but output preserves original case).
		$this->assertStringContainsString( 'style=', $result['content'] );
		$this->assertStringContainsString( 'Display: None', $result['content'] );
		// CSS should be empty.
		$this->assertEquals( '', $result['style'] );
	}

	/**
	 * Test case-insensitive matching: DISPLAY: NONE.
	 * When only preserved properties exist, tag remains unchanged (original case preserved).
	 */
	public function testPreserveDisplayNoneUppercase(): void {

		$html = '<div class="blockera-block-abc123" style="DISPLAY: NONE;">Content</div>';

		$result = $this->cleanup->process( $html );

		// Tag should remain unchanged when only preserved properties exist (original case preserved).
		$this->assertEquals( $html, $result['content'], 'Tag should remain unchanged when only preserved properties exist' );
		// Verify style attribute exists (case-insensitive matching works, but output preserves original case).
		$this->assertStringContainsString( 'style=', $result['content'] );
		$this->assertStringContainsString( 'DISPLAY: NONE', $result['content'] );
		// CSS should be empty.
		$this->assertEquals( '', $result['style'] );
	}

	/**
	 * Test spacing variation: display:none (no spaces).
	 * When only preserved properties exist, tag remains unchanged (original spacing preserved).
	 */
	public function testPreserveDisplayNoneNoSpaces(): void {

		$html = '<div class="blockera-block-abc123" style="display:none;">Content</div>';

		$result = $this->cleanup->process( $html );

		// Tag should remain unchanged when only preserved properties exist (original spacing preserved).
		$this->assertEquals( $html, $result['content'], 'Tag should remain unchanged when only preserved properties exist' );
		// Verify style attribute exists.
		$this->assertStringContainsString( 'style=', $result['content'] );
		$this->assertStringContainsString( 'display:none', $result['content'] );
		// CSS should be empty.
		$this->assertEquals( '', $result['style'] );
	}

	/**
	 * Test spacing variation: display:  none (extra spaces).
	 * When only preserved properties exist, tag remains unchanged (original spacing preserved).
	 */
	public function testPreserveDisplayNoneExtraSpaces(): void {

		$html = '<div class="blockera-block-abc123" style="display:  none;">Content</div>';

		$result = $this->cleanup->process( $html );

		// Tag should remain unchanged when only preserved properties exist (original spacing preserved).
		$this->assertEquals( $html, $result['content'], 'Tag should remain unchanged when only preserved properties exist' );
		// Verify style attribute exists.
		$this->assertStringContainsString( 'style=', $result['content'] );
		$this->assertStringContainsString( 'display:  none', $result['content'] );
		// CSS should be empty.
		$this->assertEquals( '', $result['style'] );
	}

	/**
	 * Test with semicolon: display: none;.
	 * When only preserved properties exist, tag remains unchanged.
	 */
	public function testPreserveDisplayNoneWithSemicolon(): void {

		$html = '<div class="blockera-block-abc123" style="display: none;">Content</div>';

		$result = $this->cleanup->process( $html );

		// Tag should remain unchanged when only preserved properties exist.
		$this->assertEquals( $html, $result['content'], 'Tag should remain unchanged when only preserved properties exist' );
		// Verify style attribute exists.
		$this->assertStringContainsString( 'style=', $result['content'] );
		$this->assertStringContainsString( 'display: none', $result['content'] );
		// CSS should be empty.
		$this->assertEquals( '', $result['style'] );
	}

	/**
	 * Test with !important: display: none !important.
	 * When only preserved properties exist, tag remains unchanged.
	 */
	public function testPreserveDisplayNoneWithImportant(): void {

		$html = '<div class="blockera-block-abc123" style="display: none !important;">Content</div>';

		$result = $this->cleanup->process( $html );

		// Tag should remain unchanged when only preserved properties exist.
		$this->assertEquals( $html, $result['content'], 'Tag should remain unchanged when only preserved properties exist' );
		// Verify style attribute exists.
		$this->assertStringContainsString( 'style=', $result['content'] );
		$this->assertStringContainsString( 'display: none !important', $result['content'] );
		// CSS should be empty.
		$this->assertEquals( '', $result['style'] );
	}

	/**
	 * Test display: none !important with other properties.
	 */
	public function testPreserveDisplayNoneImportantWithOtherProperties(): void {

		$html = '<div class="blockera-block-abc123" style="color: red; display: none !important; margin: 10px;">Content</div>';

		$result = $this->cleanup->process( $html );

		$this->assertStringContainsString( 'style="display: none !important"', $result['content'] );
		$this->assertStringContainsString( 'color: red', $result['style'] );
		$this->assertStringContainsString( 'margin: 10px', $result['style'] );
		$this->assertStringNotContainsString( 'display: none', $result['style'] );
	}

	/**
	 * Test Priority 1 (blockera-block-*): display: none preservation.
	 */
	public function testPreserveDisplayNonePriority1BlockeraBlock(): void {

		$html = '<div class="blockera-block-abc123" style="display: none; color: red;">Content</div>';

		$result = $this->cleanup->process( $html );

		$this->assertStringContainsString( 'style="display: none"', $result['content'] );
		$this->assertStringContainsString( ':where(.blockera-block-abc123)', $result['style'] );
		$this->assertStringContainsString( 'color: red', $result['style'] );
		$this->assertStringNotContainsString( 'display: none', $result['style'] );
	}

	/**
	 * Test Priority 3 (parent blockera-block): display: none preservation for children.
	 */
	public function testPreserveDisplayNonePriority3ParentBlockeraBlock(): void {

		$html = '<div class="blockera-block-parent"><span style="display: none; color: green;">Child</span></div>';

		$result = $this->cleanup->process( $html );

		// Child should have display: none preserved.
		$this->assertStringContainsString( 'style="display: none"', $result['content'] );
		// Child should get counter-based class (because there are other properties).
		$this->assertStringContainsString( 'class="blockera-block-parent-child-1"', $result['content'] );
		// Other properties should be in CSS.
		$this->assertStringContainsString( ':where(.blockera-block-parent .blockera-block-parent-child-1)', $result['style'] );
		$this->assertStringContainsString( 'color: green', $result['style'] );
		// display: none should NOT be in CSS.
		$this->assertStringNotContainsString( 'display: none', $result['style'] );
	}

	/**
	 * Test Priority 3 (parent blockera-block): display: none alone for children.
	 * Special case: When only preserved properties exist, child should not get class.
	 */
	public function testPreserveDisplayNonePriority3ChildOnlyPreserved(): void {

		$html = '<div class="blockera-block-parent"><span style="display: none;">Child</span></div>';

		$result = $this->cleanup->process( $html );

		// Tag should remain unchanged when only preserved properties exist.
		$this->assertEquals( $html, $result['content'], 'Tag should remain unchanged when only preserved properties exist' );
		// Child should have display: none preserved (tag not modified).
		$this->assertStringContainsString( 'style=', $result['content'] );
		$this->assertStringContainsString( 'display: none', $result['content'] );
		// Child should NOT get counter-based class (no processing occurred).
		$this->assertStringNotContainsString( 'class="blockera-block-parent-child-1"', $result['content'] );
		// No CSS should be generated.
		$this->assertEquals( '', $result['style'] );
		// Verify no CSS rule was created.
		$this->assertStringNotContainsString( ':where(.blockera-block-parent', $result['style'] );
	}

	/**
	 * Test edge case: display: none with only whitespace in style attribute.
	 * When only preserved properties exist, tag remains unchanged (whitespace preserved).
	 */
	public function testPreserveDisplayNoneWithWhitespaceOnly(): void {

		$html = '<div class="blockera-block-abc123" style="display: none;   ">Content</div>';

		$result = $this->cleanup->process( $html );

		// Tag should remain unchanged when only preserved properties exist (whitespace preserved).
		$this->assertEquals( $html, $result['content'], 'Tag should remain unchanged when only preserved properties exist' );
		// Verify style attribute exists with original formatting.
		$this->assertStringContainsString( 'style=', $result['content'] );
		$this->assertStringContainsString( 'display: none', $result['content'] );
		// CSS should be empty.
		$this->assertEquals( '', $result['style'] );
		// Verify no CSS rule was created.
		$this->assertStringNotContainsString( ':where(.blockera-block-abc123)', $result['style'] );
	}

	/**
	 * Test that display: none is preserved even when wp-block-* should skip (Priority 2).
	 * Note: wp-block-* without blockera-block-* skips processing, so display: none should remain.
	 */
	public function testPreserveDisplayNoneWithWpBlockSkip(): void {

		$html = '<div class="wp-block-button" style="display: none; color: blue;">Button</div>';

		$result = $this->cleanup->process( $html );

		// Should skip processing - inline style should remain (including display: none).
		$this->assertStringContainsString( 'style="display: none; color: blue;"', $result['content'] );
		// Should not generate any CSS.
		$this->assertEquals( '', $result['style'] );
	}

	/**
	 * Test multiple display: none occurrences (should be deduplicated).
	 */
	public function testPreserveDisplayNoneMultipleOccurrences(): void {

		$html = '<div class="blockera-block-abc123" style="display: none; color: red; display: none;">Content</div>';

		$result = $this->cleanup->process( $html );

		// Should have only one display: none in preserved style.
		$this->assertStringContainsString( 'style="display: none"', $result['content'] );
		// Should not have duplicate display: none.
		$style_count = substr_count( $result['content'], 'display: none' );
		$this->assertEquals( 1, $style_count, 'display: none should appear only once' );
		// Other properties should be in CSS.
		$this->assertStringContainsString( 'color: red', $result['style'] );
	}
}

