<?php
/**
 * Configure block all arguments.
 *
 * @var array $args the block arguments!
 *
 * @package blockera/packages/blocks/js/wordpress/query-no-results
 */

return array_merge(
	$args,
	[
		'selectors' => [
			'innerBlocks' => [
				...blockera_load( 'inners.link', dirname( __DIR__ ) ),
			],
		],
	]
);
