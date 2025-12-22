<?php

/**
 * Fixtures for ContentCleanup::process() method tests.
 *
 * Each fixture contains:
 * - 'input': The HTML input to process
 * - 'expected_content': Expected processed HTML (optional, will be auto-validated if not provided)
 * - 'expected_style': Expected CSS output (optional, will be auto-validated if not provided)
 * - 'skip_style_removal': Set to true if styles should NOT be removed (e.g., when parent is wp-block without blockera-block)
 */

return [
	// Priority 1: blockera-block-* class
	// #0
	[
		'input'            => '<div class="blockera-block-abc123" style="color: red; margin: 10px;">Content</div>',
		'expected_content' => '<div class="blockera-block-abc123">Content</div>',
		'expected_style'   => ':where(.blockera-block-abc123) { color: red; margin: 10px; }' . PHP_EOL,
	],
	// #1
	[
		'input'            => '<p class="blockera-block-xyz text-content" style="padding: 5px;">Hello</p>',
		'expected_content' => '<p class="blockera-block-xyz text-content">Hello</p>',
		'expected_style'   => ':where(.blockera-block-xyz) { padding: 5px; }' . PHP_EOL,
	],

	// Priority 2: wp-block-* class (should skip - no blockera-block-* class)
	// #2
	[
		'input'             => '<div class="wp-block-button" style="color: blue;">Button</div>',
		'skip_style_removal' => true,
		'expected_content'   => '<div class="wp-block-button" style="color: blue;">Button</div>',
		'expected_style'     => '',
	],
	// #3
	[
		'input'             => '<span class="wp-block-group__inner-container" style="display: flex;">Container</span>',
		'skip_style_removal' => true,
		'expected_content'   => '<span class="wp-block-group__inner-container" style="display: flex;">Container</span>',
		'expected_style'     => '',
	],

	// Priority 3: Parent with blockera-block-* class
	// #4
	[
		'input'            => '<div class="blockera-block-parent"><span style="color: green;">Child</span></div>',
		'content_patterns' => [
			'/class="blockera-block-parent"/',
			'/class="blockera-block-[a-z0-9]+"/',
		],
		'style_patterns'   => [
			'/:where\(\.blockera-block-parent \.blockera-block-[a-z0-9]+\) \{ color: green; \}/',
		],
	],
	// #5
	[
		'input'            => '<div class="blockera-block-wrapper"><p class="text-class" style="margin: 20px;">Text</p></div>',
		'content_contains' => [
			'class="blockera-block-wrapper"',
			'class="text-class"',
		],
		'style_patterns'   => [
			'/:where\(\.blockera-block-wrapper \.text-class\) \{ margin: 20px; \}/',
		],
	],

	// Priority 3: Parent with wp-block-* but NO blockera-block-* (should skip)
	// #6
	[
		'input'             => '<div class="wp-block-group"><span style="color: red;">Child</span></div>',
		'skip_style_removal' => true,
		'expected_content'   => '<div class="wp-block-group"><span style="color: red;">Child</span></div>',
		'expected_style'     => '',
	],
	// #7
	[
		'input'             => '<div class="wp-block-columns"><div style="padding: 10px;">Column</div></div>',
		'skip_style_removal' => true,
		'expected_content'   => '<div class="wp-block-columns"><div style="padding: 10px;">Column</div></div>',
		'expected_style'     => '',
	],

	// Priority 3: Parent with wp-block-* AND blockera-block-* (should process)
	// #8
	[
		'input'            => '<div class="wp-block-group blockera-block-xyz"><span style="color: blue;">Child</span></div>',
		'content_patterns' => [
			'/class="wp-block-group blockera-block-xyz"/',
			'/class="blockera-block-[a-z0-9]+"/',
		],
		'style_patterns'   => [
			'/:where\(\.blockera-block-xyz \.blockera-block-[a-z0-9]+\) \{ color: blue; \}/',
		],
	],

	// Child with classes - prioritizes wp-* and classes with numbers
	// #9
	[
		'input'             => '<div class="blockera-block-parent"><span class="wp-block-button custom-class button-123" style="color: purple;">Button</span></div>',
		'skip_style_removal' => true,
		'content_contains'   => [
			'class="blockera-block-parent"',
			'style="color: purple;"', // Should remain (skipped)
		],
		'expected_style'     => '',
	],

	// Child with no classes - generates unique class
	// #10
	[
		'input'            => '<div class="blockera-block-parent"><span style="color: orange;">No classes</span></div>',
		'content_patterns' => [
			'/class="blockera-block-parent"/',
			'/class="blockera-block-[a-z0-9]+"/',
		],
		'style_patterns'   => [
			'/:where\(\.blockera-block-parent \.blockera-block-[a-z0-9]+\) \{ color: orange; \}/',
		],
	],

	// Inner element with no class, parent has blockera-block-* - simple case
	// #11
	[
		'input'            => '<div class="blockera-block-container"><p style="margin: 15px; padding: 10px;">Paragraph text</p></div>',
		'content_patterns' => [
			'/class="blockera-block-container"/',
			'/class="blockera-block-[a-z0-9]+"/', // Generated for p element
		],
		'style_patterns'   => [
			'/:where\(\.blockera-block-container \.blockera-block-[a-z0-9]+\) \{ margin: 15px; padding: 10px; \}/',
		],
	],

	// Inner element with no class, parent has blockera-block-* - nested deeper
	// #12
	[
		'input'            => '<div class="blockera-block-wrapper">
			<div class="blockera-block-inner">
				<span style="color: blue; font-weight: bold;">Deep nested span</span>
			</div>
		</div>',
		'content_patterns' => [
			'/class="blockera-block-wrapper"/',
			'/class="blockera-block-inner"/',
			'/class="blockera-block-[a-z0-9]+"/', // Generated for span
		],
		'style_patterns'   => [
			'/:where\(\.blockera-block-inner \.blockera-block-[a-z0-9]+\) \{ color: blue; font-weight: bold; \}/',
		],
	],

	// Inner element with no class, parent has blockera-block-* - multiple siblings
	// #13
	[
		'input'            => '<div class="blockera-block-list">
			<li style="margin-bottom: 5px;">Item 1</li>
			<li style="margin-bottom: 5px;">Item 2</li>
			<li style="margin-bottom: 5px;">Item 3</li>
		</div>',
		'content_patterns' => [
			'/class="blockera-block-list"/',
			'/class="blockera-block-[a-z0-9]+"/', // Generated for each li
		],
		'style_contains'   => [
			':where(.blockera-block-list',
			'margin-bottom: 5px',
		],
	],

	// Inner element with no class, parent has blockera-block-* - mixed with other elements
	// #14
	[
		'input'            => '<div class="blockera-block-content">
			<h2 class="blockera-block-title" style="font-size: 24px;">Title</h2>
			<p style="line-height: 1.6;">Regular paragraph</p>
			<div style="background: #f0f0f0; padding: 15px;">Div with no class</div>
		</div>',
		'content_contains' => [
			'class="blockera-block-content"',
			'class="blockera-block-title"',
		],
		'content_patterns' => [
			'/class="blockera-block-[a-z0-9]+"/', // Generated for p and div
		],
		'style_contains'   => [
			':where(.blockera-block-title)',
			'font-size: 24px',
			':where(.blockera-block-content',
			'line-height: 1.6',
			'background: #f0f0f0',
			'padding: 15px',
		],
	],

	// Inner element with no class, parent has blockera-block-* - self-closing tags
	// #15
	[
		'input'            => '<div class="blockera-block-media">
			<img src="image.jpg" style="width: 100%; max-width: 800px;" alt="Image">
			<hr style="border: 2px solid #ccc; margin: 20px 0;">
		</div>',
		'content_patterns' => [
			'/class="blockera-block-media"/',
			'/class="blockera-block-[a-z0-9]+"/', // Generated for img and hr
		],
		'style_contains'   => [
			':where(.blockera-block-media',
			'width: 100%',
			'max-width: 800px',
			'border: 2px solid #ccc',
			'margin: 20px 0',
		],
	],

	// Inner element with no class, parent has blockera-block-* - with complex styles
	// #16
	[
		'input'            => '<section class="blockera-block-section">
			<article style="background: linear-gradient(to bottom, #fff, #f0f0f0); border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
				Content with complex styles
			</article>
		</section>',
		'content_patterns' => [
			'/class="blockera-block-section"/',
			'/class="blockera-block-[a-z0-9]+"/', // Generated for article
		],
		'style_contains'   => [
			':where(.blockera-block-section',
			'background: linear-gradient(to bottom, #fff, #f0f0f0)',
			'border-radius: 8px',
			'box-shadow: 0 2px 4px rgba(0,0,0,0.1)',
		],
	],

	// Inner element with no class, parent has blockera-block-* - table cell
	// #17
	[
		'input'            => '<table class="blockera-block-table">
			<tr>
				<td style="padding: 12px; text-align: left;">Cell 1</td>
				<td style="padding: 12px; text-align: right;">Cell 2</td>
			</tr>
		</table>',
		'content_patterns' => [
			'/class="blockera-block-table"/',
			'/class="blockera-block-[a-z0-9]+"/', // Generated for each td
		],
		'style_contains'   => [
			':where(.blockera-block-table',
			'padding: 12px',
			'text-align: left',
			'text-align: right',
		],
	],

	// Multiple elements
	// #18
	[
		'input'             => '<div class="blockera-block-1" style="padding: 20px;"><p class="blockera-block-2" style="margin: 10px;">First</p><span class="wp-block-button" style="color: red;">Button</span></div>',
		'content_contains'  => [
			'class="blockera-block-1"',
			'class="blockera-block-2"',
			'style="color: red;"', // wp-block-button style should remain (skipped)
		],
		'content_not_contains' => [
			'style="padding: 20px"', // Should be removed (processed)
			'style="margin: 10px"', // Should be removed (processed)
		],
		'style_contains'    => [
			':where(.blockera-block-1)',
			'padding: 20px',
			':where(.blockera-block-2)',
			'margin: 10px',
		],
		'style_not_contains' => [
			'color: red', // wp-block-button style should not be in CSS (skipped)
		],
	],

	// Edge cases
	// #19
	[
		'input'            => '',
		'expected_content' => '',
		'expected_style'   => '',
	],
	// #20
	[
		'input'            => '<div>No inline styles</div>',
		'expected_content' => '<div>No inline styles</div>',
		'expected_style'   => '',
	],
	// #21
	[
		'input'            => '<div class="blockera-block-test" style="color: red">No semicolon</div>',
		'expected_content' => '<div class="blockera-block-test">No semicolon</div>',
		'expected_style'   => ':where(.blockera-block-test) { color: red; }' . PHP_EOL,
	],
	// #22
	[
		'input'            => '<div class="blockera-block-test" style="color: red;">With semicolon</div>',
		'expected_content' => '<div class="blockera-block-test">With semicolon</div>',
		'expected_style'   => ':where(.blockera-block-test) { color: red; }' . PHP_EOL,
	],

	// Priority precedence: blockera-block takes precedence over wp-block
	// #23
	[
		'input'            => '<div class="blockera-block-abc wp-block-button" style="color: green;">Content</div>',
		'expected_content' => '<div class="blockera-block-abc wp-block-button">Content</div>',
		'expected_style'   => ':where(.blockera-block-abc) { color: green; }' . PHP_EOL,
	],

	// Complex nested structure
	// #24
	[
		'input'            => '<div class="blockera-block-outer" style="padding: 10px;"><div class="blockera-block-inner" style="margin: 5px;"><span style="color: blue;">Deep nested</span></div></div>',
		'content_contains' => [
			'class="blockera-block-outer"',
			'class="blockera-block-inner"',
		],
		'content_patterns' => [
			'/class="blockera-block-[a-z0-9]+"/', // For the span
		],
		'style_contains'   => [
			':where(.blockera-block-outer)',
			'padding: 10px',
			':where(.blockera-block-inner)',
			'margin: 5px',
			'color: blue',
		],
		'style_patterns'   => [
			'/:where\(\.blockera-block-inner \.blockera-block-[a-z0-9]+\) \{ color: blue; \}/',
		],
	],

	// Child with multiple classes, some with numbers
	// #25
	[
		'input'            => '<div class="blockera-block-parent"><span class="button-123 item-456 custom-class" style="padding: 10px;">Button</span></div>',
		'expected_content' => '<div class="blockera-block-parent"><span class="button-123 item-456 custom-class">Button</span></div>',
		'style_patterns'   => [
			'/:where\(\.blockera-block-parent \.button-123\.item-456\) \{ padding: 10px; \}/',
		],
	],

	// Child with only wp-* classes - Priority 2 applies and skips, not Priority 3
	// #26
	[
		'input'             => '<div class="blockera-block-parent"><span class="wp-block-button wp-element-button" style="color: navy;">Button</span></div>',
		'skip_style_removal' => true,
		'content_contains'   => [
			'class="blockera-block-parent"',
			'style="color: navy;"', // Should remain (skipped)
		],
		'expected_style'     => '',
	],

	// Empty style attribute (edge case)
	// #27
	[
		'input'            => '<div class="blockera-block-test" style="">Content</div>',
		'expected_content' => '<div class="blockera-block-test">Content</div>',
		'expected_style'   => ':where(.blockera-block-test) { ; }' . PHP_EOL,
	],

	// Multiple inline style elements in sequence
	// #28
	[
		'input'            => '<div class="blockera-block-1" style="margin: 10px;"></div><div class="blockera-block-2" style="padding: 20px;"></div>',
		'expected_content' => '<div class="blockera-block-1"></div><div class="blockera-block-2"></div>',
		'style_contains'   => [
			':where(.blockera-block-1)',
			'margin: 10px',
			':where(.blockera-block-2)',
			'padding: 20px',
		],
	],

	// Complex: Real-world WordPress block structure
	// #29
	[
		'input'            => '<div class="wp-block-group blockera-block-main">
			<div class="wp-block-columns" style="gap: 20px;">
				<div class="wp-block-column">
					<p class="blockera-block-text" style="color: #333; font-size: 16px;">Column 1</p>
					<span style="background: yellow;">Highlight</span>
				</div>
				<div class="wp-block-column">
					<div class="wp-block-button" style="padding: 10px;">Button</div>
				</div>
			</div>
		</div>',
		'content_contains' => [
			'class="wp-block-group blockera-block-main"',
			'class="blockera-block-text"',
			'style="padding: 10px;"', // wp-block-button style should remain (skipped)
			'background: yellow', // wp-block-column is parent of span, so span style should remain (skipped)
		],
		'content_patterns' => [
			'/class="blockera-block-[a-z0-9]+"/', // For span
		],
		'style_contains'   => [
			':where(.blockera-block-text)',
			'color: #333',
			'font-size: 16px',
		],
		'style_not_contains' => [
			':where(.blockera-block-main',
			'padding: 10px', // wp-block-button style should not be in CSS (skipped)
			'gap: 20px', // wp-block-columns style should not be in CSS (skipped)
		],
	],

	// Complex: Multiple siblings with different priority levels
	// #30
	[
		'input'            => '<div class="blockera-block-container">
			<div class="blockera-block-item1" style="margin: 10px;">Item 1</div>
			<div class="wp-block-group" style="padding: 15px;">Item 2</div>
			<div style="color: blue;">Item 3</div>
			<span class="blockera-block-span" style="font-weight: bold;">Item 4</span>
		</div>',
		'content_contains' => [
			'class="blockera-block-container"',
			'class="blockera-block-item1"',
			'class="blockera-block-span"',
		],
		'content_contains' => [
			'style="padding: 15px;"', // wp-block-group style should remain (skipped)
		],
		'content_patterns' => [
			'/class="blockera-block-[a-z0-9]+"/', // Item 3
		],
		'style_contains'   => [
			':where(.blockera-block-item1)',
			'margin: 10px',
			'color: blue',
			':where(.blockera-block-span)',
			'font-weight: bold',
		],
		'style_not_contains' => [
			'padding: 15px', // wp-block-group style should not be in CSS (skipped)
		],
	],

	// Complex: Deep nesting with parent-child relationships
	// #31
	[
		'input'            => '<div class="blockera-block-level1" style="position: relative;">
			<div class="blockera-block-level2" style="display: flex;">
				<div class="wp-block-group" style="flex: 1;">
					<p style="text-align: center;">Nested content</p>
				</div>
				<div style="flex: 1; background: #f0f0f0;">Another div</div>
			</div>
		</div>',
		'content_contains' => [
			'class="blockera-block-level1"',
			'class="blockera-block-level2"',
			'style="flex: 1;"', // wp-block-group style should remain (skipped)
			'text-align: center', // wp-block-group is parent of p, so p style should remain (skipped)
		],
		'content_patterns' => [
			'/class="blockera-block-[a-z0-9]+"/', // For both p and div
		],
		'style_contains'   => [
			':where(.blockera-block-level1)',
			'position: relative',
			':where(.blockera-block-level2)',
			'display: flex',
			'background: #f0f0f0',
			'flex: 1', // Second div's flex: 1 should be processed (parent has blockera-block-level2)
		],
		'style_not_contains' => [
			// Note: wp-block-group's flex: 1 should not appear (it's skipped),
			// but the second div's flex: 1 WILL appear (it's processed correctly).
			// The original test expected 'flex: 1' to not appear, but that was too broad
			// and incorrectly expected the second div's flex: 1 to also be skipped.
		],
	],

	// Complex: Mixed processed and skipped elements
	// #32
	[
		'input'             => '<div class="wp-block-group">
			<span style="color: red;">Should be skipped</span>
		</div>
		<div class="blockera-block-valid">
			<span style="color: green;">Should be processed</span>
		</div>',
		'content_contains'  => [
			'style="color: red;"', // Should remain (skipped)
			'class="blockera-block-valid"',
		],
		'content_not_contains' => [
			'style="color: green;"', // Should be removed (processed)
		],
		'content_patterns'  => [
			'/class="blockera-block-[a-z0-9]+"/', // Generated class for processed span
		],
		'style_contains'    => [
			':where(.blockera-block-valid',
			'color: green',
		],
		'style_not_contains' => [
			'color: red', // Should not be in CSS (skipped)
		],
	],

	// Complex: Child with multiple priority classes - Priority 2 applies and skips (wp-block-button)
	// #33
	[
		'input'             => '<div class="blockera-block-parent">
			<span class="wp-block-button button-123 item-456 custom-class extra" style="padding: 15px; margin: 5px;">Complex Button</span>
		</div>',
		'skip_style_removal' => true,
		'content_contains'   => [
			'class="blockera-block-parent"',
			'style="padding: 15px; margin: 5px;"', // Should remain (skipped)
		],
		'expected_style'     => '',
	],

	// Complex: Self-closing tags with inline styles
	// #34
	[
		'input'            => '<div class="blockera-block-wrapper">
			<img src="test.jpg" style="width: 100%; height: auto;" alt="Test">
			<br style="clear: both;">
			<hr style="border: 1px solid #ccc;">
		</div>',
		'content_contains' => [
			'class="blockera-block-wrapper"',
			'<img src="test.jpg"',
			'alt="Test"',
			'<br',
			'<hr',
		],
		'content_not_contains' => [
			'style="width: 100%',
			'style="clear: both',
			'style="border: 1px',
		],
		'content_patterns' => [
			'/class="blockera-block-[a-z0-9]+"/', // For img, br, hr
		],
		'style_contains'   => [
			'width: 100%',
			'height: auto',
			'clear: both',
			'border: 1px solid #ccc',
		],
	],

	// Complex: Inline styles with CSS functions and complex values
	// #35
	[
		'input'            => '<div class="blockera-block-gradient" style="background: linear-gradient(45deg, red, blue); transform: rotate(10deg);">Complex Styles</div>',
		'expected_content' => '<div class="blockera-block-gradient">Complex Styles</div>',
		'style_contains'   => [
			':where(.blockera-block-gradient)',
			'background: linear-gradient(45deg, red, blue)',
			'transform: rotate(10deg)',
		],
	],

	// Complex: Multiple blockera-block classes in same element
	// #36
	[
		'input'            => '<div class="blockera-block-base blockera-block-variant blockera-block-modifier" style="color: purple;">Multiple Blockera Classes</div>',
		'expected_content' => '<div class="blockera-block-base blockera-block-variant blockera-block-modifier">Multiple Blockera Classes</div>',
		'expected_style'   => ':where(.blockera-block-base) { color: purple; }' . PHP_EOL,
	],

	// Complex: Child elements with both blockera-block and wp-block
	// #37
	[
		'input'            => '<div class="blockera-block-container">
			<div class="blockera-block-child wp-block-group" style="display: grid;">Uses Priority 1</div>
		</div>',
		'expected_content' => '<div class="blockera-block-container">
			<div class="blockera-block-child wp-block-group">Uses Priority 1</div>
		</div>',
		'expected_style'   => ':where(.blockera-block-child) { display: grid; }' . PHP_EOL,
	],

	// Complex: Sequential processing of multiple independent elements
	// #38
	[
		'input'            => '<section>
			<header class="blockera-block-header" style="background: #000; color: #fff;">Header</header>
			<main class="blockera-block-main" style="padding: 20px;">Main Content</main>
			<footer class="blockera-block-footer" style="margin-top: 40px;">Footer</footer>
		</section>',
		'expected_content' => '<section>
			<header class="blockera-block-header">Header</header>
			<main class="blockera-block-main">Main Content</main>
			<footer class="blockera-block-footer">Footer</footer>
		</section>',
		'style_contains'   => [
			':where(.blockera-block-header)',
			'background: #000',
			'color: #fff',
			':where(.blockera-block-main)',
			'padding: 20px',
			':where(.blockera-block-footer)',
			'margin-top: 40px',
		],
	],

	// Complex: Nested wp-block elements (should skip inner if parent doesn't have blockera-block)
	// #39
	[
		'input'             => '<div class="wp-block-columns">
			<div class="wp-block-column">
				<p style="font-size: 18px;">Should be skipped</p>
			</div>
		</div>',
		'skip_style_removal' => true,
		'expected_content'   => '<div class="wp-block-columns">
			<div class="wp-block-column">
				<p style="font-size: 18px;">Should be skipped</p>
			</div>
		</div>',
		'expected_style'     => '',
	],

	// Complex: Adjacent elements with different processing outcomes
	// #40
	[
		'input'             => '<div>
			<div class="blockera-block-processed" style="color: red;">Processed</div>
			<div class="wp-block-group"><span style="color: blue;">Skipped</span></div>
			<div class="blockera-block-another" style="background: yellow;">Also Processed</div>
		</div>',
		'content_contains'  => [
			'class="blockera-block-processed"',
			'class="blockera-block-another"',
			'style="color: blue;"', // Should remain (skipped)
		],
		'content_not_contains' => [
			'style="color: red;"', // Should be removed
			'style="background: yellow;"', // Should be removed
		],
		'style_contains'    => [
			':where(.blockera-block-processed)',
			'color: red',
			':where(.blockera-block-another)',
			'background: yellow',
		],
		'style_not_contains' => [
			'color: blue', // Should not be in CSS (skipped)
		],
	],

	// Complex: Long class names and complex selectors
	// #41
	[
		'input'            => '<div class="blockera-block-very-long-class-name-that-should-work" style="width: 100%; max-width: 1200px;">Long Class Name</div>',
		'expected_content' => '<div class="blockera-block-very-long-class-name-that-should-work">Long Class Name</div>',
		'expected_style'   => ':where(.blockera-block-very-long-class-name-that-should-work) { width: 100%; max-width: 1200px; }' . PHP_EOL,
	],

	// Complex: Mixed quote types in attributes
	// #42
	[
		'input'            => '<div class=\'blockera-block-test\' style="color: red;">Single Quotes Class</div>',
		'expected_content' => '<div class=\'blockera-block-test\'>Single Quotes Class</div>',
		'expected_style'   => ':where(.blockera-block-test) { color: red; }' . PHP_EOL,
	],

	// Complex: Style attribute with special characters
	// #43
	[
		'input'            => '<div class="blockera-block-special" style="content: &quot;Hello&quot;; font-family: \'Arial\', sans-serif;">Special Chars</div>',
		'expected_content' => '<div class="blockera-block-special">Special Chars</div>',
		'style_contains'   => [
			':where(.blockera-block-special)',
			'content: &quot; Hello&quot; ;',
			"font-family: 'Arial', sans-serif",
		],
	],

	// Complex: Multiple style declarations with extra spaces
	// #44
	[
		'input'            => '<div class="blockera-block-spacing" style="  color  :  red  ;  margin  :  10px  ;  ">Extra Spaces</div>',
		'expected_content' => '<div class="blockera-block-spacing">Extra Spaces</div>',
		'expected_style'   => ':where(.blockera-block-spacing) { color: red; margin: 10px; }' . PHP_EOL,
	],

	// Complex: Empty elements with styles
	// #45
	[
		'input'            => '<div class="blockera-block-empty" style="min-height: 100px;"></div>',
		'expected_content' => '<div class="blockera-block-empty"></div>',
		'expected_style'   => ':where(.blockera-block-empty) { min-height: 100px; }' . PHP_EOL,
	],

	// Complex: Table structure with inline styles
	// #46
	[
		'input'            => '<table class="blockera-block-table">
			<tr style="background: #f0f0f0;">
				<th style="padding: 10px;">Header 1</th>
				<th style="padding: 10px;">Header 2</th>
			</tr>
			<tr>
				<td style="text-align: center;">Data 1</td>
				<td style="text-align: center;">Data 2</td>
			</tr>
		</table>',
		'content_contains' => [
			'class="blockera-block-table"',
		],
		'content_patterns' => [
			'/class="blockera-block-[a-z0-9]+"/', // For tr, th, td elements
		],
		'style_contains'   => [
			':where(.blockera-block-table',
			'background: #f0f0f0',
			'padding: 10px',
			'text-align: center',
		],
	],

	// Complex: List structure with nested styles
	// #47
	[
		'input'            => '<ul class="blockera-block-list">
			<li style="margin-bottom: 10px;">Item 1</li>
			<li style="margin-bottom: 10px;">
				<ul style="margin-left: 20px;">
					<li style="list-style: square;">Nested Item</li>
				</ul>
			</li>
		</ul>',
		'content_contains' => [
			'class="blockera-block-list"',
		],
		'content_patterns' => [
			'/class="blockera-block-[a-z0-9]+"/', // For li and ul elements
		],
		'style_contains'   => [
			':where(.blockera-block-list',
			'margin-bottom: 10px',
			'margin-left: 20px',
			'list-style: square',
		],
	],

	// Complex: Form elements with inline styles
	// #48
	[
		'input'            => '<form class="blockera-block-form">
			<input type="text" style="width: 100%; padding: 8px;" placeholder="Name">
			<button type="submit" class="wp-block-button" style="background: blue; color: white;">Submit</button>
		</form>',
		'content_contains' => [
			'class="blockera-block-form"',
		],
		'content_contains' => [
			'style="background: blue; color: white;"', // wp-block-button style should remain (skipped)
		],
		'content_patterns' => [
			'/class="blockera-block-[a-z0-9]+"/', // For input
		],
		'style_contains'   => [
			':where(.blockera-block-form',
			'width: 100%',
			'padding: 8px',
		],
		'style_not_contains' => [
			'background: blue', // wp-block-button style should not be in CSS (skipped)
			'color: white', // wp-block-button style should not be in CSS (skipped)
		],
	],

	// Real-world: wp-block-buttons with blockera-block button containing wp-block-button__link (with underscore)
	// #49
	[
		'input'            => '<div class="wp-block-buttons is-layout-flex wp-block-buttons-is-layout-flex">
<div class="wp-block-button blockera-block blockera-block--6x1dmu"><a class="wp-block-button__link has-background wp-element-button" style="border-radius:10px;background-color:#2200ff;padding-top:10px;padding-right:20px;padding-bottom:10px;padding-left:20px">Test Blockera BTN</a></div>
</div>',
		'content_contains' => [
			'class="wp-block-buttons',
			'class="wp-block-button blockera-block blockera-block--6x1dmu"',
			'class="wp-block-button__link',
		],
		'content_not_contains' => [
			'style="border-radius:10px', // Should be removed (processed)
		],
		'style_contains'   => [
			':where(.blockera-block--6x1dmu',
			'.wp-block-button__link',
			'border-radius: 10px',
			'background-color: #2200ff',
			'padding-top: 10px',
			'padding-right: 20px',
			'padding-bottom: 10px',
			'padding-left: 20px',
		],
	],

	// wp-block-* class with underscore, parent has only wp-block-* (no blockera-block) - should skip
	// #50
	[
		'input'            => '<div class="wp-block-buttons is-layout-flex">
<div class="wp-block-button"><a class="wp-block-button__link" style="color: red; padding: 5px;">Link</a></div>
</div>',
		'content_contains' => [
			'class="wp-block-button__link"',
			'style="color: red; padding: 5px;"', // Should remain (skipped - parent has only wp-block-*)
		],
		'style_not_contains' => [
			'color: red',
			'padding: 5px',
		],
	],

	// wp-block-* class with underscore, immediate parent has wp-block-* only - should skip
	// #51
	[
		'input'            => '<div class="blockera-block-container">
<div class="wp-block-group"><span class="wp-block-element__wrapper" style="margin: 10px; color: blue;">Wrapper</span></div>
</div>',
		'content_contains' => [
			'class="blockera-block-container"',
			'class="wp-block-group"',
			'class="wp-block-element__wrapper"',
			'style="margin: 10px; color: blue;"', // Should remain (skipped - immediate parent wp-block-group has no blockera-block)
		],
		'style_not_contains' => [
			'margin: 10px',
			'color: blue',
		],
	],

	// wp-block-* class with underscore, immediate parent has blockera-block - should process
	// #52
	[
		'input'            => '<div class="blockera-block-wrapper">
<span class="wp-block-element__child" style="padding: 15px;">Child</span>
</div>',
		'content_contains' => [
			'class="blockera-block-wrapper"',
			'class="wp-block-element__child"',
		],
		'content_not_contains' => [
			'style="padding: 15px"', // Should be removed (processed)
		],
		'style_contains'   => [
			':where(.blockera-block-wrapper',
			'.wp-block-element__child',
			'padding: 15px',
		],
	],

	// wp-block-* class without underscore - should skip (old behavior)
	// #53
	[
		'input'            => '<div class="blockera-block-wrapper">
<div class="wp-block-button" style="background: yellow;">Button</div>
</div>',
		'content_contains' => [
			'style="background: yellow;"', // Should remain (skipped - wp-block-button has no underscore)
		],
		'style_not_contains' => [
			'background: yellow',
		],
	],

	// Multiple wp-block-* with underscores - closest parent is wp-block-column (no blockera-block) - should skip
	// #54
	[
		'input'            => '<div class="blockera-block-main">
<div class="wp-block-columns">
<div class="wp-block-column">
<p class="wp-block-column__content" style="font-size: 18px;">Content 1</p>
</div>
<div class="wp-block-column">
<p class="wp-block-column__content" style="font-size: 18px;">Content 2</p>
</div>
</div>
</div>',
		'content_contains' => [
			'class="blockera-block-main"',
			'class="wp-block-columns"',
			'class="wp-block-column"',
			'class="wp-block-column__content"',
			'style="font-size: 18px;"', // Should remain (skipped - closest parent wp-block-column has no blockera-block)
		],
		'style_not_contains' => [
			'font-size: 18px', // Should not be in CSS (skipped)
			'wp-block-column__content',
		],
	],

	// wp-block-* with underscore - closest parent has blockera-block - should process
	// #55
	[
		'input'            => '<div class="blockera-block-wrapper">
<div class="blockera-block-inner">
<span class="wp-block-element__child" style="padding: 20px; margin: 10px;">Child with underscore</span>
</div>
</div>',
		'content_contains' => [
			'class="blockera-block-wrapper"',
			'class="blockera-block-inner"',
			'class="wp-block-element__child"',
		],
		'content_not_contains' => [
			'style="padding: 20px', // Should be removed (processed)
		],
		'style_contains'   => [
			':where(.blockera-block-inner',
			'.wp-block-element__child',
			'padding: 20px',
			'margin: 10px',
		],
	],

	// wp-block-* with underscore but parent is wp-block-* without blockera-block - should skip
	// #56
	[
		'input'            => '<div class="wp-block-group">
<div class="wp-block-column">
<span class="wp-block-column__inner" style="display: flex;">Inner</span>
</div>
</div>',
		'content_contains' => [
			'style="display: flex;"', // Should remain (skipped - parent wp-block-column has no blockera-block)
		],
		'style_not_contains' => [
			'display: flex',
		],
	],
];

