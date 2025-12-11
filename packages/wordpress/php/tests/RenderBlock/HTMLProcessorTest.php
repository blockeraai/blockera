<?php

namespace Blockera\WordPress\Tests\RenderBlock;

use Blockera\WordPress\RenderBlock\HTMLProcessor;

class HTMLProcessorTest extends \WP_UnitTestCase {

	protected HTMLProcessor $processor;

	public function setUp(): void {

		parent::setUp();
		$this->processor = new HTMLProcessor();
	}

	public function testCollectInlineStylesWithIdSelector() {

		$html = '<div id="main-content" style="color: red; font-size: 16px;">Content</div>';

		$result = $this->processor->cleanupHTML( $html );

		$this->assertIsArray( $result );
		$this->assertArrayHasKey( 'html', $result );
		$this->assertArrayHasKey( 'css', $result );

		$this->assertStringNotContainsString( 'style=', $result['html'] );

		$this->assertStringContainsString( 'div#main-content', array_keys($result['css']['root'])[0] );
		$this->assertStringContainsString( 'red', $result['css']['root']['div#main-content']['color'] );
		$this->assertStringContainsString( '16px', $result['css']['root']['div#main-content']['font-size'] );
	}

	public function testCollectInlineStylesWithBlockeraClassname() {

		$html = '<p class="blockera-block-abc123 text-content" style="margin: 10px; padding: 5px;">Hello</p>';

		$result = $this->processor->cleanupHTML( $html );

		$this->assertStringNotContainsString( 'style=', $result['html'] );

		$this->assertStringContainsString( '.blockera-block-abc123', array_keys($result['css']['root'])[0] );
		$this->assertStringContainsString( '10px', $result['css']['root']['.blockera-block-abc123']['margin'] );
		$this->assertStringContainsString( '5px', $result['css']['root']['.blockera-block-abc123']['padding'] );
	}

	public function testCollectInlineStylesWithNumericClassname() {

		$html = '<span class="highlight 123-item" style="background: yellow;">Important</span>';

		$result = $this->processor->cleanupHTML( $html );

		$this->assertStringNotContainsString( 'style=', $result['html'] );

		$this->assertStringContainsString( '.123-item', array_keys($result['css']['root'])[0] );
		$this->assertStringContainsString( 'yellow', $result['css']['root']['.123-item']['background'] );
	}

	public function testCollectInlineStylesWithMultipleElements() {

		$html = '<div id="wrapper" style="padding: 20px;">
			<p class="blockera-block-xyz" style="margin: 5px;">Text</p>
			<span class="item-123" style="color: blue;">Span</span>
		</div>';

		$result = $this->processor->cleanupHTML( $html );

		$this->assertStringNotContainsString( 'style=', $result['html'] );

		$this->assertStringContainsString( 'div#wrapper', array_keys($result['css']['root'])[0] );
		$this->assertStringContainsString( 'p.blockera-block-xyz', array_keys($result['css']['child'])[0] );
		$this->assertStringContainsString( 'span.item-123', array_keys($result['css']['child'])[1] );
		$this->assertStringContainsString( ' { color: blue; }', $result['css']['child']['span.item-123'] );
	}

	public function testCollectInlineStylesWithNoInlineStyles() {

		$html = '<div class="container">Content</div>';

		$result = $this->processor->cleanupHTML( $html );

		$this->assertEquals( $html, $result['html'] );
		$this->assertEmpty( $result['css'] );
	}

	public function testCollectInlineStylesWithEmptyHtml() {

		$result = $this->processor->cleanupHTML( '' );

		$this->assertEquals( '', $result['html'] );
		$this->assertEquals( [], $result['css'] );
	}

	public function testCollectInlineStylesWithTagOnly() {

		$html = '<div style="width: 100px;">Content</div>';

		$result = $this->processor->cleanupHTML( $html );

		$this->assertStringNotContainsString( 'style=', $result['html'] );
		$this->assertStringContainsString( 'div', array_keys($result['css']['root'])[0] );
		$this->assertStringContainsString( '100px', $result['css']['root']['div']['width'] );
	}

	public function testCollectInlineStylesPicksTwoClassnames() {

		$html = '<div class="blockera-block-abc 123-item extra-class another" style="color: red;">Content</div>';

		$result = $this->processor->cleanupHTML( $html );

		$this->assertStringContainsString( '.blockera-block-abc.123-item', array_keys($result['css']['root'])[0] );
		$this->assertStringNotContainsString( 'extra-class', array_keys($result['css']['root'])[0] );
		$this->assertStringNotContainsString( 'another', array_keys($result['css']['root'])[0] );
	}

	public function testUpdateWrapperClassnameAddsNewClass() {

		$html = '<div class="existing-class">Content</div>';

		$result = $this->processor->updateWrapperClassname( $html, 'new-class' );

		$this->assertStringContainsString( 'existing-class', $result );
		$this->assertStringContainsString( 'new-class', $result );
		$this->assertStringContainsString( 'class="existing-class new-class"', $result );
	}

	public function testUpdateWrapperClassnameOnEmptyClass() {

		$html = '<div>Content</div>';

		$result = $this->processor->updateWrapperClassname( $html, 'new-class' );

		$this->assertStringContainsString( 'class="new-class"', $result );
	}

	public function testUpdateWrapperClassnameDoesNotDuplicate() {

		$html = '<div class="existing-class">Content</div>';

		$result = $this->processor->updateWrapperClassname( $html, 'existing-class' );

		$class_count = substr_count( $result, 'existing-class' );
		$this->assertEquals( 1, $class_count );
	}

	public function testUpdateWrapperClassnameWithEmptyHtml() {

		$result = $this->processor->updateWrapperClassname( '', 'new-class' );

		$this->assertEquals( '', $result );
	}

	public function testUpdateWrapperClassnameWithEmptyClassname() {

		$html = '<div class="test">Content</div>';

		$result = $this->processor->updateWrapperClassname( $html, '' );

		$this->assertEquals( $html, $result );
	}

	public function testUpdateWrapperClassnameOnlyFirstElement() {

		$html = '<div class="first">First</div><div class="second">Second</div>';

		$result = $this->processor->updateWrapperClassname( $html, 'new-class' );

		$this->assertStringContainsString( 'class="first new-class"', $result );
		$this->assertStringContainsString( 'class="second"', $result );
	}

	public function testReplaceHtmlWithPlaceholder() {

		$html        = '<div class="container"><p>Target</p></div>';
		$target_html = '<p>Target</p>';

		$result = $this->processor->replaceHtmlWithPlaceholder( $html, $target_html, 'test-id' );

		$this->assertIsArray( $result );
		$this->assertArrayHasKey( 'html', $result );
		$this->assertArrayHasKey( 'placeholder', $result );

		$this->assertStringNotContainsString( '<p>Target</p>', $result['html'] );
		$this->assertStringContainsString( '${{BLOCKERA_HTML_PLACEHOLDER_test-id}}', $result['html'] );
		$this->assertEquals( '${{BLOCKERA_HTML_PLACEHOLDER_test-id}}', $result['placeholder'] );
	}

	public function testReplaceHtmlWithPlaceholderAutoGeneratesId() {

		$html        = '<div><p>Content</p></div>';
		$target_html = '<p>Content</p>';

		$result = $this->processor->replaceHtmlWithPlaceholder( $html, $target_html );

		$this->assertStringContainsString( '${{BLOCKERA_HTML_PLACEHOLDER_', $result['html'] );
		$this->assertStringContainsString( '}}', $result['html'] );
		$this->assertNotEmpty( $result['placeholder'] );
	}

	public function testReplaceHtmlWithPlaceholderEmptyHtml() {

		$result = $this->processor->replaceHtmlWithPlaceholder( '', '<p>Test</p>', 'id' );

		$this->assertEquals( '', $result['html'] );
		$this->assertEquals( '', $result['placeholder'] );
	}

	public function testReplaceHtmlWithPlaceholderEmptyTarget() {

		$html = '<div>Content</div>';

		$result = $this->processor->replaceHtmlWithPlaceholder( $html, '', 'id' );

		$this->assertEquals( $html, $result['html'] );
		$this->assertEquals( '', $result['placeholder'] );
	}

	public function testReplacePlaceholderWithHtml() {

		$html_with_placeholder = '<div>${{BLOCKERA_HTML_PLACEHOLDER_header}}</div>';
		$replacement_html      = '<header>Content</header>';

		$result = $this->processor->replacePlaceholderWithHtml(
			$html_with_placeholder,
			$replacement_html,
			'header'
		);

		$this->assertStringNotContainsString( '${{BLOCKERA_HTML_PLACEHOLDER_header}}', $result );
		$this->assertStringContainsString( '<header>Content</header>', $result );
	}

	public function testReplacePlaceholderWithHtmlEmptyId() {

		$html_with_placeholder = '<div>${{BLOCKERA_HTML_PLACEHOLDER}}</div>';
		$replacement_html      = '<p>Content</p>';

		$result = $this->processor->replacePlaceholderWithHtml(
			$html_with_placeholder,
			$replacement_html
		);

		$this->assertStringNotContainsString( '${{BLOCKERA_HTML_PLACEHOLDER}}', $result );
		$this->assertStringContainsString( '<p>Content</p>', $result );
	}

	public function testReplacePlaceholderWithHtmlEmptyHtml() {

		$result = $this->processor->replacePlaceholderWithHtml( '', '<p>Test</p>', 'id' );

		$this->assertEquals( '', $result );
	}

	public function testReplacePlaceholderWithHtmlEmptyReplacement() {

		$html = '<div>${{BLOCKERA_HTML_PLACEHOLDER_test}}</div>';

		$result = $this->processor->replacePlaceholderWithHtml( $html, '', 'test' );

		$this->assertEquals( $html, $result );
	}

	public function testCompleteWorkflow() {

		$html = '<div class="container" style="padding: 20px;">
			<p id="intro" style="margin: 10px;">Introduction</p>
			<span class="blockera-block-xyz 456-item" style="color: blue;">Content</span>
		</div>';

		$result = $this->processor->cleanupHTML( $html );

		$this->assertStringNotContainsString( 'style=', $result['html'] );
		$this->assertStringContainsString( '.container', array_keys($result['css']['root'])[0] );
		$this->assertStringContainsString( 'p#intro', array_keys($result['css']['child'])[0] );
		$this->assertStringContainsString( ' { color: blue; }', $result['css']['child']['span.blockera-block-xyz.456-item'] );

		$updated = $this->processor->updateWrapperClassname( $result['html'], 'wrapper-class' );
		$this->assertStringContainsString( 'wrapper-class', $updated );
	}

	public function testCssFormattingWithSemicolon() {

		$html = '<div style="color: red">
			Content
			<span class="intro" style="margin: 10px;">Introduction</span>
		</div>';

		$result = $this->processor->cleanupHTML( $html );

		$this->assertStringEndsWith( '; }', trim( $result['css']['child']['span.intro'] ) );
	}

	public function testMultiplePlaceholderOperations() {

		$html = '<div><header>Header</header><footer>Footer</footer></div>';

		$result1 = $this->processor->replaceHtmlWithPlaceholder(
			$html,
			'<header>Header</header>',
			'header'
		);

		$result2 = $this->processor->replaceHtmlWithPlaceholder(
			$result1['html'],
			'<footer>Footer</footer>',
			'footer'
		);

		$this->assertStringContainsString( '${{BLOCKERA_HTML_PLACEHOLDER_header}}', $result2['html'] );
		$this->assertStringContainsString( '${{BLOCKERA_HTML_PLACEHOLDER_footer}}', $result2['html'] );

		$restored1 = $this->processor->replacePlaceholderWithHtml(
			$result2['html'],
			'<header>Header</header>',
			'header'
		);

		$restored2 = $this->processor->replacePlaceholderWithHtml(
			$restored1,
			'<footer>Footer</footer>',
			'footer'
		);

		$this->assertStringContainsString( '<header>Header</header>', $restored2 );
		$this->assertStringContainsString( '<footer>Footer</footer>', $restored2 );
	}

	public function testInlineStylesWithMalformedDeclarations() {

		$html = '<div style="color: red;; margin: ; padding: 10px; ;">Content</div>';

		$result = $this->processor->cleanupHTML( $html );

		$this->assertStringContainsString( 'red', $result['css']['root']['div']['color'] );
		$this->assertStringContainsString( '10px', $result['css']['root']['div']['padding'] );
		$this->assertStringNotContainsString( ' ;', $result['css']['root']['div']['margin'] );
	}

	public function testClassnamePriorityOverID() {

		$html = '<div id="with-id" class="blockera-block-test" style="color: red;">Content</div>';

		$result = $this->processor->cleanupHTML( $html );

		$this->assertStringContainsString( '.blockera-block-test', array_keys($result['css']['root'])[0] );
		$this->assertStringNotContainsString( '#with-id', array_keys($result['css']['root'])[0] );
	}

	public function testUseIdIfClassnameNotFound() {

		$html = '<div id="with-id" style="color: red;">Content</div>';

		$result = $this->processor->cleanupHTML( $html );

		$this->assertStringContainsString( '#with-id', array_keys($result['css']['root'])[0] );
		$this->assertStringNotContainsString( '.blockera-block-test', array_keys($result['css']['root'])[0] );
	}

	public function testPickUpTwiceNotSpecificClassnames() {

		$html = '<div class="regular-class another-class" style="color: red;">Content</div>';

		$result = $this->processor->cleanupHTML( $html );

		$this->assertStringContainsString( '.regular-class.another-class', array_keys($result['css']['root'])[0] );
	}

	public function testConvertInlineStylesWithGlobalCssPropsClasses() {

		$html = '<div class="blockera-block-1" style="color: red; display: flex;">Content</div>';

		$global_css_props = [
			'color'   => 'has-color',
			'display' => 'has-display',
		];

		$result = $this->processor->cleanupHTML( $html, '',$global_css_props );

		$this->assertStringNotContainsString( 'style=', $result['html'] );
		$this->assertStringContainsString( 'class="blockera-block-1 has-color has-display"', $result['html'] );
	}

	public function testConvertInlineStylesWithGlobalCssPropsClassesPartialMatch() {

		$html = '<div class="blockera-block-1" style="color: red; margin: 10px;">Content</div>';

		$global_css_props = [
			'color' => 'has-color',
			'width' => 'has-width',
		];

		$result = $this->processor->cleanupHTML( $html, '', $global_css_props );

		$this->assertStringNotContainsString( 'style=', $result['html'] );
		$this->assertStringContainsString( 'class="blockera-block-1 has-color"', $result['html'] );
		$this->assertStringNotContainsString( 'has-width', $result['html'] );
	}

	public function testConvertInlineStylesWithGlobalCssPropsClassesAndExistingClass() {

		$html = '<div class="blockera-block-1 existing-class" style="color: red;">Content</div>';

		$global_css_props = [
			'color' => 'has-color',
		];

		$result = $this->processor->cleanupHTML( $html, '', $global_css_props );

		$this->assertStringNotContainsString( 'style=', $result['html'] );
		$this->assertStringContainsString( 'class="blockera-block-1 existing-class has-color"', $result['html'] );
	}

	public function testConvertInlineStylesWithEmptyGlobalCssPropsClasses() {

		$html = '<div class="blockera-block-1" style="color: red;">Content</div>';

		$result = $this->processor->cleanupHTML( $html, '', [] );

		$this->assertStringNotContainsString( 'style=', $result['html'] );
		$this->assertStringContainsString( 'class="blockera-block-1"', $result['html'] );
	}

	public function testConvertInlineStylesWithGlobalCssPropsClassesMultipleElements() {

		$html = '<div class="blockera-block-1" style="color: red;"><p style="display: block;">Text</p></div>';

		$global_css_props = [
			'color'   => 'has-color',
			'display' => 'has-display',
		];

		$result = $this->processor->cleanupHTML( $html, '', $global_css_props );

		$this->assertStringContainsString( '<div class="blockera-block-1 has-color">', $result['html'] );
		$this->assertStringContainsString( '<p>', $result['html'] );
	}

	public function testConvertInlineStylesWithGlobalCssPropsClassesNoDuplicates() {

		$html = '<div class="blockera-block-1 has-color" style="color: red;">Content</div>';

		$global_css_props = [
			'color' => 'has-color',
		];

		$result = $this->processor->cleanupHTML( $html, '', $global_css_props );

		$count = substr_count( $result['html'], 'has-color' );
		$this->assertEquals( 1, $count );
	}

	public function testConvertInlineStylesWithGlobalCssPropsClassesNoDuplicatesAndNoBlockeraClass() {

		$html = '<div class="has-color" style="color: red; display: block;">Content</div>';

		$global_css_props = [
			'color' => 'has-color',
		];

		$result = $this->processor->cleanupHTML( $html, '', $global_css_props );

		$this->assertStringNotContainsString( 'style=', $result['html'] );
		$this->assertStringContainsString( 'class="has-color"', $result['html'] );
	}

	public function testAddClassnameToWrapper() {

		$html = '<div class="existing">Content</div>';

		$result = $this->processor->addClassname( $html, 'new-class' );

		$this->assertStringContainsString( 'existing', $result );
		$this->assertStringContainsString( 'new-class', $result );
		$this->assertStringContainsString( 'class="existing new-class"', $result );
	}

	public function testAddClassnameToWrapperWithoutExistingClass() {

		$html = '<div>Content</div>';

		$result = $this->processor->addClassname( $html, 'new-class' );

		$this->assertStringContainsString( 'class="new-class"', $result );
	}

	public function testAddClassnameDoesNotDuplicate() {

		$html = '<div class="test-class">Content</div>';

		$result = $this->processor->addClassname( $html, 'test-class' );

		$count = substr_count( $result, 'test-class' );
		$this->assertEquals( 1, $count );
	}

	public function testAddClassnameWithTagSelector() {

		$html = '<div><p>First</p><p>Second</p><span>Third</span></div>';

		$result = $this->processor->addClassname( $html, 'paragraph-class', 'p' );

		$this->assertStringContainsString( '<p class="paragraph-class">', $result );
		preg_match_all( '/class="paragraph-class"/', $result, $matches );
		$this->assertCount( 2, $matches[0] );
		$this->assertStringNotContainsString( '<span class="paragraph-class">', $result );
	}

	public function testAddClassnameWithClassSelector() {

		$html = '<div class="target">First</div><div class="other">Second</div><div class="target">Third</div>';

		$result = $this->processor->addClassname( $html, 'added-class', '.target' );

		$this->assertStringContainsString( 'class="target added-class"', $result );
		$this->assertStringNotContainsString( 'class="other added-class"', $result );
		preg_match_all( '/class="target added-class"/', $result, $matches );
		$this->assertCount( 2, $matches[0] );
	}

	public function testAddClassnameWithIdSelector() {

		$html = '<div id="unique">First</div><div>Second</div>';

		$result = $this->processor->addClassname( $html, 'id-class', '#unique' );

		$this->assertStringContainsString( 'class="id-class" id="unique"', $result );
	}

	public function testAddClassnameToElementsWithExistingClass() {

		$html = '<div><p class="existing">First</p><p>Second</p></div>';

		$result = $this->processor->addClassname( $html, 'new-class', 'p' );

		$this->assertStringContainsString( '<p class="existing new-class">', $result );
		$this->assertStringContainsString( '<p class="new-class">', $result );
	}

	public function testAddClassnameWithEmptySelector() {

		$html = '<div><p>First</p><p>Second</p></div>';

		$result = $this->processor->addClassname( $html, 'wrapper-class', '' );

		$this->assertStringContainsString( '<div class="wrapper-class">', $result );
		$this->assertStringNotContainsString( '<p class="wrapper-class">', $result );
	}

	public function testAddClassnameWithEmptyHtml() {

		$result = $this->processor->addClassname( '', 'test-class' );

		$this->assertEquals( '', $result );
	}

	public function testAddClassnameWithEmptyClassname() {

		$html = '<div>Content</div>';

		$result = $this->processor->addClassname( $html, '' );

		$this->assertEquals( $html, $result );
	}

	public function testAddClassnameWithInvalidSelector() {

		$html = '<div><p>Content</p></div>';

		$result = $this->processor->addClassname( $html, 'test-class', 'span' );

		$this->assertEquals( $html, $result );
	}

	public function testAddClassnameMultipleTimes() {

		$html = '<div><p class="first">Content</p></div>';

		$result = $this->processor->addClassname( $html, 'second', 'p' );
		$result = $this->processor->addClassname( $result, 'third', 'p' );

		$this->assertStringContainsString( 'class="first second third"', $result );
	}
}

