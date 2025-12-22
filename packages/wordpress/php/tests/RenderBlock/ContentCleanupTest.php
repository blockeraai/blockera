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
		// Should use parent selector + child selector.
		$this->assertStringContainsString( ':where(.blockera-block-parent', $result['style'] );
		// Child should get unique class.
		$this->assertMatchesRegularExpression( '/class="blockera-block-[a-z0-9]+"/', $result['content'] );
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
		// Should use blockera-block-* class from parent.
		$this->assertStringContainsString( ':where(.blockera-block-xyz', $result['style'] );
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
		// Should generate unique class for child.
		$this->assertMatchesRegularExpression( '/class="blockera-block-[a-z0-9]+"/', $result['content'] );
		$this->assertMatchesRegularExpression( '/:where\(\.blockera-block-parent \.blockera-block-[a-z0-9]+\)/', $result['style'] );
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
		$this->assertDoesNotMatchRegularExpression( '/class="blockera-block-abc wp-block-button blockera-block-[a-z0-9]+"/', $result['content'] );
	}
}

