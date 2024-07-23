<?php
/**
 * Configure block all arguments.
 *
 * @var array $args the block arguments!
 *
 * @package blockera/packages/blocks/js/wordpress/comments-pagination
 */

return array_merge(
	$args,
	[
		'attributes' => [
			...( $args['attributes'] ?? [] ),
			'blockeraDisplay' => [
				'type'    => 'string',
				'default' => 'flex',
			],
		],
		'selectors'  => [
			...( $args['selectors'] ?? [] ),
			'innerBlocks' => [
				...blockera_load( 'inners.link', dirname( __DIR__ ) ),
			],
		],
	]
);
