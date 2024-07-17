<?php
/**
 * Configure block all arguments.
 *
 * @var array $args the block arguments!
 *
 * @package blockera/packages/blocks/js/wordpress/categories
 */

return array_merge(
	$args,
	[
		'selectors' => [
			'innerBlocks' => [
				'elements/term-item' => [
					'root' => 'li.cat-item > a',
				],
				'elements/list-item' => [
					'root' => 'li.cat-item',
				],
			],
		],
	]
);
