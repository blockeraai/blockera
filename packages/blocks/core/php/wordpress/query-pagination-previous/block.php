<?php
/**
 * Configure block all arguments.
 *
 * @var array $args the block arguments!
 *
 * @package blockera-core/packages/blocks/js/wordpress/query-pagination-previous
 */

return array_merge(
	$args,
	[
		'selectors' => [
			'innerBlocks' => [
				'arrow' => [
					'root' => '.wp-block-query-pagination-previous-arrow',
				],
			],
		],
	]
);
