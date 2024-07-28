<?php
/**
 * Configure "elements/pagination-numbers" inner block type selectors.
 *
 * @package blockera/packages/blocks/js/wordpress/inners/pagination-numbers.php
 */

return [
	'elements/numbers' => [
		'root' => '.page-numbers:not(.dots)',
	],
	'elements/current' => [
		'root' => '.page-numbers.current',
	],
	'elements/dots'    => [
		'root' => '.page-numbers.dots',
	],
];
