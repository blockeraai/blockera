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
		'expected_style'   => '.blockera-block-abc123 { color: red; margin: 10px; }' . PHP_EOL,
	],
	// #1
	[
		'input'            => '<p class="blockera-block-xyz text-content" style="padding: 5px;">Hello</p>',
		'expected_content' => '<p class="blockera-block-xyz text-content">Hello</p>',
		'expected_style'   => '.blockera-block-xyz { padding: 5px; }' . PHP_EOL,
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
		'expected_content' => '<div class="blockera-block-parent"><span class="blockera-block-parent-child-1">Child</span></div>',
		'expected_style'   => '.blockera-block-parent :where(.blockera-block-parent-child-1) { color: green; }' . PHP_EOL,
	],
	// #5
	[
		'input'            => '<div class="blockera-block-wrapper"><p class="text-class" style="margin: 20px;">Text</p></div>',
		'content_contains' => [
			'class="blockera-block-wrapper"',
			'class="text-class blockera-block-wrapper-child-1"', // text-class element gets unique class added (not blockera/wp)
		],
		'style_patterns'   => [
			'/\.blockera-block-wrapper :where\(\.blockera-block-wrapper-child-1\) \{ margin: 20px; \}/',
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
		'expected_content' => '<div class="wp-block-group blockera-block-xyz"><span class="blockera-block-xyz-child-1">Child</span></div>',
		'expected_style'   => '.blockera-block-xyz :where(.blockera-block-xyz-child-1) { color: blue; }' . PHP_EOL,
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

	// Child with no classes - generates unique class using parent class + counter
	// #10
	[
		'input'            => '<div class="blockera-block-parent"><span style="color: orange;">No classes</span></div>',
		'expected_content' => '<div class="blockera-block-parent"><span class="blockera-block-parent-child-1">No classes</span></div>',
		'expected_style'   => '.blockera-block-parent :where(.blockera-block-parent-child-1) { color: orange; }' . PHP_EOL,
	],

	// Inner element with no class, parent has blockera-block-* - simple case
	// #11
	[
		'input'            => '<div class="blockera-block-container"><p style="margin: 15px; padding: 10px;">Paragraph text</p></div>',
		'expected_content' => '<div class="blockera-block-container"><p class="blockera-block-container-child-1">Paragraph text</p></div>',
		'expected_style'   => '.blockera-block-container :where(.blockera-block-container-child-1) { margin: 15px; padding: 10px; }' . PHP_EOL,
	],

	// Inner element with no class, parent has blockera-block-* - nested deeper
	// #12
	[
		'input'            => '<div class="blockera-block-wrapper">
			<div class="blockera-block-inner">
				<span style="color: blue; font-weight: bold;">Deep nested span</span>
			</div>
		</div>',
		'expected_content' => '<div class="blockera-block-wrapper">
			<div class="blockera-block-inner">
				<span class="blockera-block-inner-child-1">Deep nested span</span>
			</div>
		</div>',
		'expected_style'   => '.blockera-block-inner :where(.blockera-block-inner-child-1) { color: blue; font-weight: bold; }' . PHP_EOL,
	],

	// Inner element with no class, parent has blockera-block-* - multiple siblings
	// Counter increments for each child. Note: elements are processed in reverse order
	// (to maintain string positions during replacements), so counter goes 3, 2, 1 top to bottom.
	// #13
	// Note: counters are assigned in reverse processing order (order doesn't matter for functionality).
	[
		'input'            => '<div class="blockera-block-list">
			<li style="margin-bottom: 5px;">Item 1</li>
			<li style="margin-bottom: 5px;">Item 2</li>
			<li style="margin-bottom: 5px;">Item 3</li>
		</div>',
		'content_contains' => [
			'blockera-block-list-child-1',
			'blockera-block-list-child-2',
			'blockera-block-list-child-3',
		],
		'style_contains'   => [
			'.blockera-block-list :where(.blockera-block-list-child-1)',
			'.blockera-block-list :where(.blockera-block-list-child-2)',
			'.blockera-block-list :where(.blockera-block-list-child-3)',
			'margin-bottom: 5px',
		],
	],

	// Inner element with no class, parent has blockera-block-* - mixed with other elements
	// Note: counters assigned in reverse processing order (order doesn't matter for functionality).
	// #14
	[
		'input'            => '<div class="blockera-block-content">
			<h2 class="blockera-block-title" style="font-size: 24px;">Title</h2>
			<p style="line-height: 1.6;">Regular paragraph</p>
			<div style="background: #f0f0f0; padding: 15px;">Div with no class</div>
		</div>',
		'content_contains' => [
			'blockera-block-content-child-1',
			'blockera-block-content-child-2',
		],
		'style_contains'   => [
			'.blockera-block-title',
			'font-size: 24px',
			'.blockera-block-content :where(.blockera-block-content-child-1)',
			'.blockera-block-content :where(.blockera-block-content-child-2)',
			'line-height: 1.6',
			'background: #f0f0f0',
			'padding: 15px',
		],
	],

	// Inner element with no class, parent has blockera-block-* - self-closing tags
	// Note: counters assigned in reverse processing order (order doesn't matter for functionality).
	// #15
	[
		'input'            => '<div class="blockera-block-media">
			<img src="image.jpg" style="width: 100%; max-width: 800px;" alt="Image">
			<hr style="border: 2px solid #ccc; margin: 20px 0;">
		</div>',
		'content_contains' => [
			'class="blockera-block-media"',
			'class="blockera-block-media-child-1"',
			'class="blockera-block-media-child-2"',
		],
		'style_contains'   => [
			'.blockera-block-media :where(.blockera-block-media-child-1)',
			'.blockera-block-media :where(.blockera-block-media-child-2)',
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
		'expected_content' => '<section class="blockera-block-section">
			<article class="blockera-block-section-child-1">
				Content with complex styles
			</article>
		</section>',
		'style_contains'   => [
			'.blockera-block-section :where(.blockera-block-section-child-1)',
			'background: linear-gradient(to bottom, #fff, #f0f0f0)',
			'border-radius: 8px',
			'box-shadow: 0 2px 4px rgba(0,0,0,0.1)',
		],
	],

	// Inner element with no class, parent has blockera-block-* - table cell
	// Note: counters assigned in reverse processing order (order doesn't matter for functionality).
	// #17
	[
		'input'            => '<table class="blockera-block-table">
			<tr>
				<td style="padding: 12px; text-align: left;">Cell 1</td>
				<td style="padding: 12px; text-align: right;">Cell 2</td>
			</tr>
		</table>',
		'content_contains' => [
			'class="blockera-block-table"',
			'class="blockera-block-table-child-1"',
			'class="blockera-block-table-child-2"',
		],
		'style_contains'   => [
			'.blockera-block-table :where(.blockera-block-table-child-1)',
			'.blockera-block-table :where(.blockera-block-table-child-2)',
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
			'.blockera-block-1',
			'padding: 20px',
			'.blockera-block-2',
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
		'expected_style'   => '.blockera-block-test { color: red; }' . PHP_EOL,
	],
	// #22
	[
		'input'            => '<div class="blockera-block-test" style="color: red;">With semicolon</div>',
		'expected_content' => '<div class="blockera-block-test">With semicolon</div>',
		'expected_style'   => '.blockera-block-test { color: red; }' . PHP_EOL,
	],

	// Priority precedence: blockera-block takes precedence over wp-block
	// #23
	[
		'input'            => '<div class="blockera-block-abc wp-block-button" style="color: green;">Content</div>',
		'expected_content' => '<div class="blockera-block-abc wp-block-button">Content</div>',
		'expected_style'   => '.blockera-block-abc { color: green; }' . PHP_EOL,
	],

	// Complex nested structure
	// #24
	[
		'input'            => '<div class="blockera-block-outer" style="padding: 10px;"><div class="blockera-block-inner" style="margin: 5px;"><span style="color: blue;">Deep nested</span></div></div>',
		'expected_content' => '<div class="blockera-block-outer"><div class="blockera-block-inner"><span class="blockera-block-inner-child-1">Deep nested</span></div></div>',
		'style_contains'   => [
			'.blockera-block-outer',
			'padding: 10px',
			'.blockera-block-inner',
			'margin: 5px',
			'.blockera-block-inner :where(.blockera-block-inner-child-1)',
			'color: blue',
		],
	],

	// Child with multiple classes, some with numbers
	// #25
	[
		'input'            => '<div class="blockera-block-parent"><span class="button-123 item-456 custom-class" style="padding: 10px;">Button</span></div>',
		'content_contains' => [
			'class="blockera-block-parent"',
			'blockera-block-parent-child-1', // Element gets unique class added (not blockera/wp)
		],
		'style_patterns'   => [
			'/\.blockera-block-parent :where\(\.blockera-block-parent-child-1\) \{ padding: 10px; \}/',
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
		'expected_style'   => '.blockera-block-test { ; }' . PHP_EOL,
	],

	// Multiple inline style elements in sequence
	// #28
	[
		'input'            => '<div class="blockera-block-1" style="margin: 10px;"></div><div class="blockera-block-2" style="padding: 20px;"></div>',
		'expected_content' => '<div class="blockera-block-1"></div><div class="blockera-block-2"></div>',
		'style_contains'   => [
			'.blockera-block-1',
			'margin: 10px',
			'.blockera-block-2',
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
		'skip_style_removal' => true,
		'content_contains' => [
			'class="wp-block-group blockera-block-main"',
			'class="blockera-block-text"',
			'style="padding: 10px;"', // wp-block-button style should remain (skipped)
			'style="background: yellow;"', // wp-block-column is parent of span, so span style should remain (skipped)
		],
		'style_contains'   => [
			'.blockera-block-text',
			'color: #333',
			'font-size: 16px',
		],
		'style_not_contains' => [
			':where(.blockera-block-main',
			'padding: 10px', // wp-block-button style should not be in CSS (skipped)
			'gap: 20px', // wp-block-columns style should not be in CSS (skipped)
			'background: yellow', // wp-block-column child span style should not be in CSS (skipped)
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
		'skip_style_removal' => true,
		'content_contains' => [
			'class="blockera-block-container"',
			'class="blockera-block-item1"',
			'class="blockera-block-span"',
			'class="blockera-block-container-child-1"', // Item 3 gets counter-based class
			'style="padding: 15px;"', // wp-block-group style should remain (skipped)
		],
		'style_contains'   => [
			'.blockera-block-item1',
			'margin: 10px',
			'.blockera-block-container :where(.blockera-block-container-child-1)',
			'color: blue',
			'.blockera-block-span',
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
		'skip_style_removal' => true,
		'content_contains' => [
			'class="blockera-block-level1"',
			'class="blockera-block-level2"',
			'style="flex: 1;"', // wp-block-group style should remain (skipped)
			'style="text-align: center;"', // wp-block-group is parent of p, so p style should remain (skipped)
			'class="blockera-block-level2-child-1"', // Second div gets counter-based class
		],
		'style_contains'   => [
			'.blockera-block-level1',
			'position: relative',
			'.blockera-block-level2',
			'display: flex',
			'.blockera-block-level2 :where(.blockera-block-level2-child-1)',
			'background: #f0f0f0',
			'flex: 1', // Second div's flex: 1 should be processed (parent has blockera-block-level2)
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
		'skip_style_removal' => true,
		'content_contains'  => [
			'style="color: red;"', // Should remain (skipped)
			'class="blockera-block-valid"',
			'class="blockera-block-valid-child-1"', // Generated class for processed span
		],
		'content_not_contains' => [
			'style="color: green;"', // Should be removed (processed)
		],
		'style_contains'    => [
			'.blockera-block-valid :where(.blockera-block-valid-child-1)',
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
	// Note: counters assigned in reverse processing order (order doesn't matter for functionality).
	// #34
	[
		'input'            => '<div class="blockera-block-wrapper">
			<img src="test.jpg" style="width: 100%; height: auto;" alt="Test">
			<br style="clear: both;">
			<hr style="border: 1px solid #ccc;">
		</div>',
		'content_contains' => [
			'class="blockera-block-wrapper"',
			'class="blockera-block-wrapper-child-1"',
			'class="blockera-block-wrapper-child-2"',
			'class="blockera-block-wrapper-child-3"',
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
		'style_contains'   => [
			'.blockera-block-wrapper :where(.blockera-block-wrapper-child-3)',
			'width: 100%',
			'height: auto',
			'.blockera-block-wrapper :where(.blockera-block-wrapper-child-2)',
			'clear: both',
			'.blockera-block-wrapper :where(.blockera-block-wrapper-child-1)',
			'border: 1px solid #ccc',
		],
	],

	// Complex: Inline styles with CSS functions and complex values
	// #35
	[
		'input'            => '<div class="blockera-block-gradient" style="background: linear-gradient(45deg, red, blue); transform: rotate(10deg);">Complex Styles</div>',
		'expected_content' => '<div class="blockera-block-gradient">Complex Styles</div>',
		'style_contains'   => [
			'.blockera-block-gradient',
			'background: linear-gradient(45deg, red, blue)',
			'transform: rotate(10deg)',
		],
	],

	// Complex: Multiple blockera-block classes in same element
	// #36
	[
		'input'            => '<div class="blockera-block-base blockera-block-variant blockera-block-modifier" style="color: purple;">Multiple Blockera Classes</div>',
		'expected_content' => '<div class="blockera-block-base blockera-block-variant blockera-block-modifier">Multiple Blockera Classes</div>',
		'expected_style'   => '.blockera-block-base { color: purple; }' . PHP_EOL,
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
		'expected_style'   => '.blockera-block-child { display: grid; }' . PHP_EOL,
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
			'.blockera-block-header',
			'background: #000',
			'color: #fff',
			'.blockera-block-main',
			'padding: 20px',
			'.blockera-block-footer',
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
			'.blockera-block-processed',
			'color: red',
			'.blockera-block-another',
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
		'expected_style'   => '.blockera-block-very-long-class-name-that-should-work { width: 100%; max-width: 1200px; }' . PHP_EOL,
	],

	// Complex: Mixed quote types in attributes
	// #42
	[
		'input'            => '<div class=\'blockera-block-test\' style="color: red;">Single Quotes Class</div>',
		'expected_content' => '<div class=\'blockera-block-test\'>Single Quotes Class</div>',
		'expected_style'   => '.blockera-block-test { color: red; }' . PHP_EOL,
	],

	// Complex: Style attribute with special characters
	// #43
	[
		'input'            => '<div class="blockera-block-special" style="content: &quot;Hello&quot;; font-family: \'Arial\', sans-serif;">Special Chars</div>',
		'expected_content' => '<div class="blockera-block-special">Special Chars</div>',
		'style_contains'   => [
			'.blockera-block-special',
			'content: "Hello";',
			"font-family: 'Arial', sans-serif",
		],
	],

	// Complex: CSS custom property with HTML-encoded quotes (breadcrumbs separator)
	// #43b
	[
		'input'            => '<div class="blockera-block-breadcrumbs" style="--separator: &quot;/&quot;">Breadcrumbs</div>',
		'expected_content' => '<div class="blockera-block-breadcrumbs">Breadcrumbs</div>',
		'expected_style'   => '.blockera-block-breadcrumbs { --separator: "/"; }' . PHP_EOL,
	],

	// Complex: Multiple style declarations with extra spaces
	// #44
	[
		'input'            => '<div class="blockera-block-spacing" style="  color  :  red  ;  margin  :  10px  ;  ">Extra Spaces</div>',
		'expected_content' => '<div class="blockera-block-spacing">Extra Spaces</div>',
		'expected_style'   => '.blockera-block-spacing { color: red; margin: 10px; }' . PHP_EOL,
	],

	// Complex: Empty elements with styles
	// #45
	[
		'input'            => '<div class="blockera-block-empty" style="min-height: 100px;"></div>',
		'expected_content' => '<div class="blockera-block-empty"></div>',
		'expected_style'   => '.blockera-block-empty { min-height: 100px; }' . PHP_EOL,
	],

	// Complex: Table structure with inline styles
	// Counter for each child. Counters assigned in reverse processing order (order doesn't matter for functionality).
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
			'class="blockera-block-table-child-1"',
			'class="blockera-block-table-child-2"',
			'class="blockera-block-table-child-3"',
			'class="blockera-block-table-child-4"',
			'class="blockera-block-table-child-5"',
		],
		'style_contains'   => [
			'.blockera-block-table :where(.blockera-block-table-child-3)',
			'background: #f0f0f0',
			'padding: 10px',
			'text-align: center',
		],
	],

	// Complex: List structure with nested styles
	// The nested ul and li elements are children of blockera-block-list parent.
	// Counters assigned in reverse processing order (order doesn't matter for functionality).
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
			'class="blockera-block-list-child-1"',
			'class="blockera-block-list-child-2"',
			'class="blockera-block-list-child-3"',
			'class="blockera-block-list-child-4"',
		],
		'style_contains'   => [
			'.blockera-block-list :where(.blockera-block-list-child-1)',
			'.blockera-block-list :where(.blockera-block-list-child-3)',
			'.blockera-block-list :where(.blockera-block-list-child-4)',
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
		'skip_style_removal' => true,
		'content_contains' => [
			'class="blockera-block-form"',
			'class="blockera-block-form-child-1"', // For input
			'style="background: blue; color: white;"', // wp-block-button style should remain (skipped)
		],
		'style_contains'   => [
			'.blockera-block-form :where(.blockera-block-form-child-1)',
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
			'.blockera-block--6x1dmu :where(.wp-block-button__link)',
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
			'.blockera-block-wrapper :where(.wp-block-element__child)',
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
			'.blockera-block-inner :where(.wp-block-element__child)',
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

	// Element with existing class (has-inline-color) gets unique class appended
	// #57
	[
		'input'            => '<p class="blockera-block blockera-block-1">test  <mark class="has-inline-color" style="background-color: #dfdfdf;">highlight</mark> elements.</p>',
		'expected_content' => '<p class="blockera-block blockera-block-1">test  <mark class="has-inline-color blockera-block-1-child-1">highlight</mark> elements.</p>',
		'expected_style'   => '.blockera-block-1 :where(.blockera-block-1-child-1) { background-color: #dfdfdf; }' . PHP_EOL,
	],

	// Element with has-inline-color AND blockera-block-* - has-inline-color should be preserved
	// #58
	[
		'input'            => '<div class="blockera-block blockera-block-2"><span class="has-inline-color blockera-block-2" style="color: red;">Text</span></div>',
		'expected_content' => '<div class="blockera-block blockera-block-2"><span class="has-inline-color blockera-block-2">Text</span></div>',
		'expected_style'   => '.blockera-block-2 { color: red; }' . PHP_EOL,
		'content_contains' => [
			'has-inline-color',
		],
	],

	// Multiple elements with has-inline-color - all should be preserved
	// #59
	[
		'input'            => '<div class="blockera-block blockera-block-3"><mark class="has-inline-color" style="background: yellow;">First</mark> <mark class="has-inline-color" style="background: orange;">Second</mark></div>',
		'content_contains' => [
			'has-inline-color',
			'blockera-block-3-child-1',
			'blockera-block-3-child-2',
		],
		'style_patterns'   => [
			'/\.blockera-block-3 :where\(\.blockera-block-3-child-[12]\) \{ background: (yellow|orange); \}/',
		],
	],

	// Element with has-inline-color AND removable has-* classes - only removable ones should be removed
	// Note: has-inline-color, has-text-color, and has-link-color are preserved (user-defined classes).
	// #60
	[
		'input'            => '<div class="blockera-block blockera-block-4"><span class="has-inline-color has-text-color has-background-color" style="color: blue;">Text</span></div>',
		'expected_content' => '<div class="blockera-block blockera-block-4"><span class="has-inline-color has-text-color blockera-block-4-child-1">Text</span></div>',
		'content_contains' => [
			'has-inline-color',
			'has-text-color',
		],
		'content_not_contains' => [
			'has-background-color',
		],
		'style_patterns'   => [
			'/\.blockera-block-4 :where\(\.blockera-block-4-child-1\) \{ color: blue; \}/',
		],
	],

	// Element without blockera-block-* but with has-inline-color - should be skipped entirely
	// #61
	[
		'input'             => '<div class="wp-block-group"><span class="has-inline-color" style="color: green;">Text</span></div>',
		'skip_style_removal' => true,
		'expected_content'   => '<div class="wp-block-group"><span class="has-inline-color" style="color: green;">Text</span></div>',
		'expected_style'     => '',
		'content_contains'   => [
			'has-inline-color',
			'style="color: green;"',
		],
	],

	// blockera-block element with has-text-color - should be preserved
	// #62
	[
		'input'            => '<p class="blockera-block blockera-block-5 has-text-color" style="color: red;">Text</p>',
		'expected_content' => '<p class="blockera-block blockera-block-5 has-text-color">Text</p>',
		'content_contains' => [
			'has-text-color',
		],
		'style_patterns'   => [
			'/\.blockera-block-5 \{ color: red; \}/',
		],
	],

	// blockera-block element with has-link-color - should be preserved
	// #63
	[
		'input'            => '<a class="blockera-block blockera-block-6 has-link-color" style="color: blue;" href="#">Link</a>',
		'expected_content' => '<a class="blockera-block blockera-block-6 has-link-color" href="#">Link</a>',
		'content_contains' => [
			'has-link-color',
		],
		'style_patterns'   => [
			'/\.blockera-block-6 \{ color: blue; \}/',
		],
	],

	// blockera-block element with has-border-color - should be preserved
	// #64
	[
		'input'            => '<div class="blockera-block blockera-block-7 has-border-color" style="border-color: #ccc;">Content</div>',
		'expected_content' => '<div class="blockera-block blockera-block-7 has-border-color">Content</div>',
		'content_contains' => [
			'has-border-color',
		],
		'style_patterns'   => [
			'/\.blockera-block-7 \{ border-color: #ccc; \}/',
		],
	],

	// blockera-block element with all preserved classes - all should be preserved
	// #65
	[
		'input'            => '<p class="blockera-block blockera-block-8 has-inline-color has-text-color has-link-color has-border-color" style="color: purple;">Text</p>',
		'expected_content' => '<p class="blockera-block blockera-block-8 has-inline-color has-text-color has-link-color has-border-color">Text</p>',
		'content_contains' => [
			'has-inline-color',
			'has-text-color',
			'has-link-color',
			'has-border-color',
		],
		'style_patterns'   => [
			'/\.blockera-block-8 \{ color: purple; \}/',
		],
	],

	// Child element with preserved classes - should be preserved even when unique class is added
	// #66
	[
		'input'            => '<div class="blockera-block blockera-block-9"><span class="has-text-color has-link-color" style="color: orange;">Child</span></div>',
		'expected_content' => '<div class="blockera-block blockera-block-9"><span class="has-text-color has-link-color blockera-block-9-child-1">Child</span></div>',
		'content_contains' => [
			'has-text-color',
			'has-link-color',
			'blockera-block-9-child-1',
		],
		'style_patterns'   => [
			'/\.blockera-block-9 :where\(\.blockera-block-9-child-1\) \{ color: orange; \}/',
		],
	],

	// blockera-block element with preserved classes AND removable classes - only removable ones should be removed
	// #67
	[
		'input'            => '<div class="blockera-block blockera-block-10 has-text-color has-background-color has-link-color has-custom-color">Content</div>',
		'expected_content' => '<div class="blockera-block blockera-block-10 has-text-color has-link-color">Content</div>',
		'content_contains' => [
			'has-text-color',
			'has-link-color',
		],
		'content_not_contains' => [
			'has-background-color',
			'has-custom-color',
		],
	],

	// Multiple elements with different preserved classes - all should be preserved
	// #68
	[
		'input'            => '<div class="blockera-block blockera-block-11"><p class="has-text-color" style="color: red;">Text</p> <a class="has-link-color" style="color: blue;">Link</a> <span class="has-border-color" style="border-color: green;">Border</span></div>',
		'content_contains' => [
			'has-text-color',
			'has-link-color',
			'has-border-color',
			'blockera-block-11-child-1',
			'blockera-block-11-child-2',
			'blockera-block-11-child-3',
		],
		'style_patterns'   => [
			'/\.blockera-block-11 :where\(\.blockera-block-11-child-[123]\) \{ (color: (red|blue)|border-color: green); \}/',
		],
	],
];

