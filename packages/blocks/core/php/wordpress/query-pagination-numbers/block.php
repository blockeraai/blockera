<?php
/**
 * Configure block all arguments.
 *
 * @var array $args the block arguments!
 *
 * @package blockera/packages/blocks/js/wordpress/query-pagination-numbers
 */

return array_merge(
	$args,
	[
		'selectors' => [
			'innerBlocks' => [
				...blockera_load( 'inners.pagination-numbers', dirname( __DIR__ ) ),
			],
		],
	]
);
