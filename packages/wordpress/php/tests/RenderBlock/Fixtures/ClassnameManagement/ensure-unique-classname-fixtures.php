<?php

/**
 * Fixtures for ClassnameManagement::computeFinalCSS() method tests.
 *
 * Each fixture contains:
 * - 'base_classname': The base classname to test
 * - 'computed_css': The CSS content (will be base64 encoded)
 * - 'expected_classname': Expected classname in result (optional, can use pattern)
 * - 'expected_updated': Expected updated flag
 * - 'expected_computed_css': Expected computed CSS in result
 * - 'description': Human-readable description of the test case
 * - 'scenario': The scenario type (simple, collision, reuse, complex, etc.)
 */

return [
	// #1 - Simple cases - no computed CSS
	[
		'scenario'             => 'no_computed_css',
		'description'         => 'Block without computed CSS should return base classname',
		'base_classname'       => 'blockera-block-1',
		'computed_css'        => null,
		'expected_classname'   => 'blockera-block-1',
		'expected_updated'     => false,
		'expected_computed_css' => '',
	],

	// #2 - Simple cases - first registration
	[
		'scenario'             => 'first_registration',
		'description'          => 'First block with CSS should register base classname',
		'base_classname'       => 'blockera-block blockera-block-1',
		'computed_css'         => 'p.blockera-block.blockera-block-1 { background-color: #ffbcbc; }',
		'expected_classname'   => 'blockera-block blockera-block-1',
		'expected_updated'     => false,
		'expected_computed_css' => 'p.blockera-block.blockera-block-1 { background-color: #ffbcbc; }',
	],

	// #3 - Reuse cases - same CSS, same base classname
	[
		'scenario'             => 'reuse_same_css_same_base',
		'description'          => 'Multiple blocks with same CSS and same base classname should reuse',
		'base_classname'       => 'blockera-block blockera-block-2',
		'computed_css'         => 'p.blockera-block.blockera-block-2 { background-color: #75a3ff; }',
		'expected_classname'   => 'blockera-block blockera-block-2',
		'expected_updated'     => false,
		'expected_computed_css' => 'p.blockera-block.blockera-block-2 { background-color: #75a3ff; }',
	],

	// #4 - Collision cases - same base classname, different CSS
	// This fixture requires setup: first register the same base classname with different CSS
	[
		'scenario'                    => 'collision_different_css',
		'description'                 => 'Same base classname with different CSS should create unique classname',
		'setup_base_classname'        => 'blockera-block blockera-block-2',
		'setup_computed_css'          => 'p.blockera-block.blockera-block-2 { background-color: #75a3ff; }',
		'base_classname'              => 'blockera-block blockera-block-2',
		'computed_css'                => 'p.blockera-block.blockera-block-2 { background-color: #ff0000; }',
		'expected_classname_pattern'  => '/^blockera-block blockera-block-2-[a-z0-9]+$/',
		'expected_updated'             => true,
		'expected_computed_css_pattern' => '/p\.blockera-block\.blockera-block-2-[a-z0-9]+ \{ background-color: #ff0000; \}/',
	],

	// #5 - Multiple blocks with same CSS
	[
		'scenario'             => 'multiple_blocks_same_css',
		'description'          => 'Multiple blocks with identical CSS should reuse the same classname',
		'base_classname'       => 'blockera-block blockera-block-2',
		'computed_css'         => 'p.blockera-block.blockera-block-2 { background-color: #75a3ff; }',
		'expected_classname'   => 'blockera-block blockera-block-2',
		'expected_updated'     => false,
		'expected_computed_css' => 'p.blockera-block.blockera-block-2 { background-color: #75a3ff; }',
	],

	// #6 - Complex CSS - multiple selectors
	[
		'scenario'             => 'complex_multiple_selectors',
		'description'          => 'CSS with multiple selectors should be handled correctly',
		'base_classname'       => 'blockera-block blockera-block-3',
		'computed_css'         => 'p.blockera-block.blockera-block-3 { background-color: #00ff00; }
.blockera-block.blockera-block-3:hover { background-color: #00aa00; }
.blockera-block.blockera-block-3 .child { color: #000000; }',
		'expected_classname'   => 'blockera-block blockera-block-3',
		'expected_updated'     => false,
		'expected_computed_css' => 'p.blockera-block.blockera-block-3 { background-color: #00ff00; }
.blockera-block.blockera-block-3:hover { background-color: #00aa00; }
.blockera-block.blockera-block-3 .child { color: #000000; }',
	],

	// #7 - Reuse unique classname when CSS matches
	[
		'scenario'             => 'reuse_unique_classname',
		'description'          => 'When CSS matches existing unique classname, should reuse it',
		'base_classname'       => 'blockera-block blockera-block-2',
		'computed_css'         => 'p.blockera-block.blockera-block-2 { background-color: #75a3ff; }',
		'expected_classname'   => 'blockera-block blockera-block-2',
		'expected_updated'     => false,
		'expected_computed_css' => 'p.blockera-block.blockera-block-2 { background-color: #75a3ff; }',
	],

	// #8 - Different CSS content but same base classname
	[
		'scenario'                    => 'different_css_same_base',
		'description'                 => 'Same base classname with different CSS content should create unique classnames',
		'base_classname'              => 'blockera-block blockera-block-4',
		'computed_css'                => 'p.blockera-block.blockera-block-4 { color: red; }',
		'expected_classname'          => 'blockera-block blockera-block-4',
		'expected_updated'            => false,
		'expected_computed_css'       => 'p.blockera-block.blockera-block-4 { color: red; }',
	],

	// #9 - Different CSS content but same base classname (second variant)
	// This fixture requires setup: first register the same base classname with different CSS
	[
		'scenario'                    => 'different_css_same_base_variant2',
		'description'                 => 'Same base classname with different CSS (blue) should create unique classname',
		'setup_base_classname'        => 'blockera-block blockera-block-4',
		'setup_computed_css'          => 'p.blockera-block.blockera-block-4 { color: red; }',
		'base_classname'              => 'blockera-block blockera-block-4',
		'computed_css'                => 'p.blockera-block.blockera-block-4 { color: blue; }',
		'expected_classname_pattern'  => '/^blockera-block blockera-block-4-[a-z0-9]+$/',
		'expected_updated'            => true,
		'expected_computed_css_pattern' => '/p\.blockera-block\.blockera-block-4-[a-z0-9]+ \{ color: blue; \}/',
	],

	// #10 - Different CSS content but same base classname (third variant)
	// This fixture requires setup: first register the same base classname with different CSS
	[
		'scenario'                    => 'different_css_same_base_variant3',
		'description'                 => 'Same base classname with different CSS (green) should create unique classname',
		'setup_base_classname'        => 'blockera-block blockera-block-4',
		'setup_computed_css'          => 'p.blockera-block.blockera-block-4 { color: red; }',
		'base_classname'              => 'blockera-block blockera-block-4',
		'computed_css'                => 'p.blockera-block.blockera-block-4 { color: green; }',
		'expected_classname_pattern'  => '/^blockera-block blockera-block-4-[a-z0-9]+$/',
		'expected_updated'            => true,
		'expected_computed_css_pattern' => '/p\.blockera-block\.blockera-block-4-[a-z0-9]+ \{ color: green; \}/',
	],

	// #11 - Edge case - empty CSS
	[
		'scenario'             => 'edge_empty_css',
		'description'          => 'Empty CSS should be handled correctly',
		'base_classname'       => 'blockera-block blockera-block-5',
		'computed_css'         => '',
		'expected_classname'   => 'blockera-block blockera-block-5',
		'expected_updated'     => false,
		'expected_computed_css' => '',
	],

	// #12 - CSS containing multiple classnames
	[
		'scenario'             => 'multiple_classnames_in_css',
		'description'          => 'CSS with multiple classname references should be handled correctly',
		'base_classname'       => 'blockera-block blockera-block-6',
		'computed_css'         => '.blockera-block.blockera-block-6 { margin: 10px; }
.blockera-block.blockera-block-6 p { padding: 5px; }
.blockera-block.blockera-block-6 .child { color: red; }',
		'expected_classname'   => 'blockera-block blockera-block-6',
		'expected_updated'     => false,
		'expected_computed_css' => '.blockera-block.blockera-block-6 { margin: 10px; }
.blockera-block.blockera-block-6 p { padding: 5px; }
.blockera-block.blockera-block-6 .child { color: red; }',
	],

	// #13 - Complex CSS - media queries
	[
		'scenario'             => 'complex_media_queries',
		'description'          => 'CSS with media queries should be handled correctly',
		'base_classname'       => 'blockera-block blockera-block-7',
		'computed_css'         => 'p.blockera-block.blockera-block-7 { background-color: #ff0000; }
@media (max-width: 768px) {
	p.blockera-block.blockera-block-7 { background-color: #00ff00; }
}',
		'expected_classname'   => 'blockera-block blockera-block-7',
		'expected_updated'     => false,
		'expected_computed_css' => 'p.blockera-block.blockera-block-7 { background-color: #ff0000; }
@media (max-width: 768px) {
	p.blockera-block.blockera-block-7 { background-color: #00ff00; }
}',
	],

	// #14 - Complex CSS - pseudo-classes
	[
		'scenario'             => 'complex_pseudo_classes',
		'description'          => 'CSS with pseudo-classes should be handled correctly',
		'base_classname'       => 'blockera-block blockera-block-8',
		'computed_css'         => 'p.blockera-block.blockera-block-8 { color: black; }
p.blockera-block.blockera-block-8:hover { color: blue; }
p.blockera-block.blockera-block-8:focus { color: green; }
p.blockera-block.blockera-block-8::before { content: ""; }',
		'expected_classname'   => 'blockera-block blockera-block-8',
		'expected_updated'     => false,
		'expected_computed_css' => 'p.blockera-block.blockera-block-8 { color: black; }
p.blockera-block.blockera-block-8:hover { color: blue; }
p.blockera-block.blockera-block-8:focus { color: green; }
p.blockera-block.blockera-block-8::before { content: ""; }',
	],

	// #15 - Edge case - very long CSS
	[
		'scenario'                    => 'edge_very_long_css',
		'description'                 => 'Very long CSS should be handled correctly',
		'base_classname'              => 'blockera-block blockera-block-9',
		'computed_css'                => 'p.blockera-block.blockera-block-9 { ' . str_repeat( 'padding: 10px; margin: 5px; ', 100 ) . ' }',
		'expected_classname'          => 'blockera-block blockera-block-9',
		'expected_updated'            => false,
		'expected_computed_css_pattern' => '/p\.blockera-block\.blockera-block-9 \{ .+ \}/',
	],

	// #16 - Registry consistency check
	[
		'scenario'             => 'registry_consistency',
		'description'          => 'Registry should maintain correct mappings between CSS hash and classname',
		'base_classname'       => 'blockera-block blockera-block-10',
		'computed_css'         => 'p.blockera-block.blockera-block-10 { background-color: #abcdef; }',
		'expected_classname'   => 'blockera-block blockera-block-10',
		'expected_updated'    => false,
		'expected_computed_css' => 'p.blockera-block.blockera-block-10 { background-color: #abcdef; }',
	],

	// #17 - Complex CSS - special characters
	[
		'scenario'             => 'complex_special_characters',
		'description'          => 'CSS with special characters should be handled correctly',
		'base_classname'       => 'blockera-block blockera-block-11',
		'computed_css'         => 'p.blockera-block.blockera-block-11 { content: "Hello \\"World\\""; background: url("image.jpg"); }',
		'expected_classname'   => 'blockera-block blockera-block-11',
		'expected_updated'     => false,
		'expected_computed_css' => 'p.blockera-block.blockera-block-11 { content: "Hello \\"World\\""; background: url("image.jpg"); }',
	],

	// #18 - Complex CSS - CSS variables
	[
		'scenario'             => 'complex_css_variables',
		'description'          => 'CSS with CSS variables should be handled correctly',
		'base_classname'       => 'blockera-block blockera-block-12',
		'computed_css'         => 'p.blockera-block.blockera-block-12 { --custom-color: #ff0000; color: var(--custom-color); }',
		'expected_classname'   => 'blockera-block blockera-block-12',
		'expected_updated'     => false,
		'expected_computed_css' => 'p.blockera-block.blockera-block-12 { --custom-color: #ff0000; color: var(--custom-color); }',
	],

	// #19 - Complex CSS - comments
	[
		'scenario'             => 'complex_css_comments',
		'description'          => 'CSS with comments should be handled correctly',
		'base_classname'       => 'blockera-block blockera-block-13',
		'computed_css'         => 'p.blockera-block.blockera-block-13 { /* This is a comment */ background-color: #ff0000; }',
		'expected_classname'   => 'blockera-block blockera-block-13',
		'expected_updated'     => false,
		'expected_computed_css' => 'p.blockera-block.blockera-block-13 { /* This is a comment */ background-color: #ff0000; }',
	],

	// #20 - Output structure validation
	[
		'scenario'             => 'output_structure',
		'description'          => 'Output should have correct structure with all required keys',
		'base_classname'       => 'blockera-block blockera-block-14',
		'computed_css'         => 'p.blockera-block.blockera-block-14 { background-color: #ff0000; }',
		'expected_classname'   => 'blockera-block blockera-block-14',
		'expected_updated'     => false,
		'expected_computed_css' => 'p.blockera-block.blockera-block-14 { background-color: #ff0000; }',
	],

	// #21 - Real-world scenario - multiple blocks with same styles
	[
		'scenario'             => 'realworld_multiple_blocks_same_styles',
		'description'          => 'Multiple blocks with identical styles should reuse classname',
		'base_classname'       => 'blockera-block blockera-block-11',
		'computed_css'         => 'p.blockera-block.blockera-block-11 { background-color: #75a3ff; }',
		'expected_classname'   => 'blockera-block blockera-block-11',
		'expected_updated'     => false,
		'expected_computed_css' => 'p.blockera-block.blockera-block-11 { background-color: #75a3ff; }',
	],

	// #22 - Real-world scenario - paragraph block with background
	[
		'scenario'             => 'realworld_paragraph_background',
		'description'          => 'Paragraph block with background color',
		'base_classname'       => 'blockera-block blockera-block-12',
		'computed_css'         => 'p.blockera-block.blockera-block-12 { background-color: #adc9ff; }',
		'expected_classname'   => 'blockera-block blockera-block-12',
		'expected_updated'     => false,
		'expected_computed_css' => 'p.blockera-block.blockera-block-12 { background-color: #adc9ff; }',
	],

	// #23 - Real-world scenario - complex block with multiple properties
	[
		'scenario'                    => 'realworld_complex_block',
		'description'                 => 'Complex block with multiple CSS properties',
		'base_classname'              => 'blockera-block blockera-block-13',
		'computed_css'                => 'p.blockera-block.blockera-block-13 {
	background-color: #75a3ff;
	padding: 20px;
	margin: 10px;
	border-radius: 5px;
	box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}
.blockera-block.blockera-block-13:hover {
	background-color: #5a8fef;
}
.blockera-block.blockera-block-13 .child-element {
	color: #ffffff;
}',
		'expected_classname'          => 'blockera-block blockera-block-13',
		'expected_updated'            => false,
		'expected_computed_css_pattern' => '/p\.blockera-block\.blockera-block-13 \{/',
	],
];
