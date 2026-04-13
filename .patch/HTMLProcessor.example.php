<?php

namespace Blockera\WordPress\RenderBlock\Examples;

use Blockera\WordPress\RenderBlock\HTMLProcessor;

class HTMLProcessorExamples {

	public static function examplecleanupHTML() {

		$processor = new HTMLProcessor();

		$html = '<div id="main-content" style="color: red; font-size: 16px;">
			<p class="blockera-block-abc123 text-content" style="margin: 10px; padding: 5px;">Hello World</p>
			<span class="highlight 123-item" style="background: yellow;">Important</span>
		</div>';

		echo "=== Example 1: Collect Inline Styles and Generate CSS ===\n\n";
		echo "Original HTML:\n";
		echo $html . "\n\n";

		echo "Without global CSS props classes:\n";
		$result = $processor->cleanupHTML( $html );
		echo "Cleaned HTML:\n";
		echo $result['html'] . "\n\n";
		echo "Generated CSS:\n";
		print_r( $result['css'] );
		echo "\n\n";

		echo "With global CSS props classes:\n";
		$global_css_props = [
			'color'      => 'has-text-color',
			'background' => 'has-background',
			'margin'     => 'has-margin',
		];
		$result2          = $processor->cleanupHTML( $html, $global_css_props );
		echo "Cleaned HTML (with added classes):\n";
		echo $result2['html'] . "\n\n";
		echo "Generated CSS:\n";
		print_r( $result2['css'] );
		echo "\n\n";
	}

	public static function exampleUpdateWrapperClassname() {

		$processor = new HTMLProcessor();

		$html = '<div class="existing-class">Content</div>';

		$updated = $processor->updateWrapperClassname( $html, 'new-wrapper-class' );

		echo "=== Example 2: Update Wrapper Classname ===\n\n";
		echo "Original HTML:\n";
		echo $html . "\n\n";

		echo "Updated HTML:\n";
		echo $updated . "\n\n";
	}

	public static function exampleAddClassname() {

		$processor = new HTMLProcessor();

		echo "=== Example 2b: Add Classname to Elements ===\n\n";

		$html = '<div class="container">
			<p class="text">First paragraph</p>
			<p>Second paragraph</p>
			<span id="highlight">Important</span>
		</div>';

		echo "Original HTML:\n";
		echo $html . "\n\n";

		echo "Add classname to wrapper only (no selector):\n";
		$result1 = $processor->addClassname( $html, 'wrapper-class' );
		echo $result1 . "\n\n";

		echo "Add classname to all <p> tags:\n";
		$result2 = $processor->addClassname( $html, 'paragraph-style', 'p' );
		echo $result2 . "\n\n";

		echo "Add classname to elements with 'text' class:\n";
		$result3 = $processor->addClassname( $html, 'text-style', '.text' );
		echo $result3 . "\n\n";

		echo "Add classname to element with 'highlight' id:\n";
		$result4 = $processor->addClassname( $html, 'highlighted', '#highlight' );
		echo $result4 . "\n\n";
	}

	public static function exampleReplaceHtmlWithPlaceholder() {

		$processor = new HTMLProcessor();

		$html = '<div class="container">
			<div class="header">Header Content</div>
			<div class="main">Main Content</div>
		</div>';

		$target_html = '<div class="header">Header Content</div>';

		$result = $processor->replaceHtmlWithPlaceholder( $html, $target_html, 'header' );

		echo "=== Example 3: Replace HTML with Placeholder ===\n\n";
		echo "Original HTML:\n";
		echo $html . "\n\n";

		echo "Target HTML to Replace:\n";
		echo $target_html . "\n\n";

		echo "HTML with Placeholder:\n";
		echo $result['html'] . "\n\n";

		echo "Placeholder Used:\n";
		echo $result['placeholder'] . "\n\n";
	}

	public static function exampleReplacePlaceholderWithHtml() {

		$processor = new HTMLProcessor();

		$html_with_placeholder = '<div class="container">
			${{BLOCKERA_HTML_PLACEHOLDER_header}}
			<div class="main">Main Content</div>
		</div>';

		$replacement_html = '<div class="header">Restored Header Content</div>';

		$restored = $processor->replacePlaceholderWithHtml(
			$html_with_placeholder,
			$replacement_html,
			'header'
		);

		echo "=== Example 4: Replace Placeholder with HTML ===\n\n";
		echo "HTML with Placeholder:\n";
		echo $html_with_placeholder . "\n\n";

		echo "Replacement HTML:\n";
		echo $replacement_html . "\n\n";

		echo "Restored HTML:\n";
		echo $restored . "\n\n";
	}

	public static function exampleHasChildren() {

		$processor = new HTMLProcessor();

		$html_with_children    = '<div><p>Child element</p></div>';
		$html_without_children = '<div>Just text</div>';
		$self_closing          = '<img src="image.jpg" />';

		echo "=== Example 5: Detect Children ===\n\n";

		echo 'HTML: ' . $html_with_children . "\n";
		echo 'Has Children: ' . ( $processor->hasChildren( $html_with_children ) ? 'Yes' : 'No' ) . "\n\n";

		echo 'HTML: ' . $html_without_children . "\n";
		echo 'Has Children: ' . ( $processor->hasChildren( $html_without_children ) ? 'Yes' : 'No' ) . "\n\n";

		echo 'HTML: ' . $self_closing . "\n";
		echo 'Has Children: ' . ( $processor->hasChildren( $self_closing ) ? 'Yes' : 'No' ) . "\n\n";
	}

	public static function exampleCompleteWorkflow() {

		$processor = new HTMLProcessor();

		echo "=== Example 6: Complete Workflow ===\n\n";

		$original_html = '<div class="container" style="padding: 20px;">
			<div id="header" style="background: blue; color: white;">
				<h1 class="blockera-block-xyz789" style="margin: 0;">Title</h1>
			</div>
			<div class="content" style="margin-top: 10px;">
				<p class="intro 456-text" style="font-size: 14px;">Introduction text</p>
			</div>
		</div>';

		echo "Step 1: Original HTML\n";
		echo $original_html . "\n\n";

		$result = $processor->cleanupHTML( $original_html );

		echo "Step 2: After collecting inline styles\n";
		echo "HTML:\n" . $result['html'] . "\n\n";
		echo "Generated CSS:\n" . $result['css'] . "\n\n";

		$updated_html = $processor->updateWrapperClassname( $result['html'], 'blockera-wrapper' );

		echo "Step 3: After updating wrapper classname\n";
		echo $updated_html . "\n\n";

		$placeholder_result = $processor->replaceHtmlWithPlaceholder(
			$updated_html,
			'<div id="header">',
			'header-id'
		);

		echo "Step 4: After replacing part with placeholder\n";
		echo $placeholder_result['html'] . "\n\n";

		$has_children = $processor->hasChildren( $updated_html );
		echo "Step 5: Check if wrapper has children\n";
		echo 'Has Children: ' . ( $has_children ? 'Yes' : 'No' ) . "\n\n";
	}

	public static function runAllExamples() {

		self::examplecleanupHTML();
		echo str_repeat( '=', 70 ) . "\n\n";

		self::exampleUpdateWrapperClassname();
		echo str_repeat( '=', 70 ) . "\n\n";

		self::exampleAddClassname();
		echo str_repeat( '=', 70 ) . "\n\n";

		self::exampleReplaceHtmlWithPlaceholder();
		echo str_repeat( '=', 70 ) . "\n\n";

		self::exampleReplacePlaceholderWithHtml();
		echo str_repeat( '=', 70 ) . "\n\n";

		self::exampleHasChildren();
		echo str_repeat( '=', 70 ) . "\n\n";

		self::exampleCompleteWorkflow();
	}
}

