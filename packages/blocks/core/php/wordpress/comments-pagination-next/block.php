<?php
/**
 * Configure block all arguments.
 *
 * @var array $args the block arguments!
 *
 * @package blockera/packages/blocks/js/wordpress/comments-pagination-next
 */

return array_merge(
	$args,
	[
		'selectors' => [
			'innerBlocks' => [
				'arrow' => [
					'root' => '.wp-block-query-pagination-next-arrow',
				],
			],
		],
	]
);
