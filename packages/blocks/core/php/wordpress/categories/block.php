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
				'term'      => [
					'root' => 'li.cat-item > a',
				],
				'list_item' => [
					'root' => 'li.cat-item',
				],
			],
		],
	]
);
