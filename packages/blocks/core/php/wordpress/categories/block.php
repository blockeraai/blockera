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
		'selectors' => array_merge(
			$args['selectors'] ?? [],
			[
				'blockera/elements/term-item' => [
					'root' => 'li.cat-item > a',
				],
				'blockera/elements/term-item-marker' => [
					'root' => 'li.cat-item::marker',
				],
				'blockera/elements/list-item' => [
					'root' => 'li.cat-item',
				],
			]
		),
	]
);
