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
	'blockera/core/heading-1'              => [
		'root' => 'h1:is(h1.wp-block-heading)',
	],
	'blockera/core/heading-2'              => [
		'root' => 'h2:is(h2.wp-block-heading)',
	],
	'blockera/core/heading-3'              => [
		'root' => 'h3:is(h3.wp-block-heading)',
	],
	'blockera/core/heading-4'              => [
		'root' => 'h4:is(h4.wp-block-heading)',
	],
	'blockera/core/heading-5'              => [
		'root' => 'h5:is(h5.wp-block-heading)',
	],
	'blockera/core/heading-6'              => [
		'root' => 'h6:is(h6.wp-block-heading)',
	],
];
