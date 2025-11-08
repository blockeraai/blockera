<?php
/**
 * FIXME:
 *
 * Configure "core/headings" inner block type selectors.
 *
 * @package blockera/packages/blocks/js/wordpress/inners/headings.php
 */

return [
	'blockera/core/heading' => [
		'root' => ':is(h1,h2,h3,h4,h5,h6).wp-block-heading',
	],
	'heading1'              => [
		'root' => 'h1.wp-block-heading',
	],
	'heading2'              => [
		'root' => 'h2.wp-block-heading',
	],
	'heading3'              => [
		'root' => 'h3.wp-block-heading',
	],
	'heading4'              => [
		'root' => 'h4.wp-block-heading',
	],
	'heading5'              => [
		'root' => 'h5.wp-block-heading',
	],
	'heading6'              => [
		'root' => 'h6.wp-block-heading',
	],
];
