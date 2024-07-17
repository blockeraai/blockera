<?php
/**
 * Configure block all arguments.
 *
 * @var array $args the block arguments!
 *
 * @package blockeraages/blocks/js/wordpress/comments
 */

return array_merge(
	$args,
	[
		'selectors' => [
			'innerBlocks' => [
				...blockera_load( 'inners.link', dirname( __DIR__ ) ),
				...blockera_load( 'inners.headings', dirname( __DIR__ ) ),
			],
		],
	]
);
