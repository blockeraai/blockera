<?php
/**
 * Configure block all arguments.
 *
 * @var array $args the block arguments!
 *
 * @package blockera/packages/blocks/js/wordpress/post-author
 */

return array_merge(
	$args,
	[
		'attributes' => array_merge(
			$args['attributes'] ?? [],
			[
				'blockeraDisplay' => [
					'type'    => 'string',
					'default' => 'flex',
				],
			]
		),
		'selectors'  => array_merge(
			$args['selectors'] ?? [],
			(array) array_merge(
				blockera_load( 'inners.link', dirname( __DIR__ ) ),
				[
					'blockera/core/avatar'     => [
						'root' => '.wp-block-post-author__avatar > img',
					],
					'blockera/elements/byline' => [
						'root' => '.wp-block-post-author__byline',
					],
					'blockera/elements/author' => [
						'root' => '.wp-block-post-author__name',
					],
				]
			)
		),
	]
);
