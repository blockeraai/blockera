<?php
/**
 * Configure block all arguments.
 *
 * @var array $args the block arguments!
 *
 * @package blockera/packages/blocks/js/wordpress/file
 */

return array_merge(
	$args,
	[
		'selectors' => [
			'innerBlocks' => [
				...blockera_load( 'inners.link', dirname( __DIR__ ) ),
				...blockera_load( 'inners.button', dirname( __DIR__ ) ),
			],
		],
	]
);
