<?php
/**
 * Configure numbers elements inner block type selectors.
 *
 * @package blockera/packages/blocks/js/wordpress/inners/numbers.php
 */

return [
	'blockera/elements/numbers' => [
		'root' => '.page-numbers:not(.dots)',
	],
	'blockera/elements/current' => [
		'root' => '.page-numbers.current.current',
	],
	'blockera/elements/dots'    => [
		'root' => '.page-numbers.dots',
	],
];
