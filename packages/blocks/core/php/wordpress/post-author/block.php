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
		'selectors' => [
			'innerBlocks' => [
				'core/avatar'     => [
					'root' => '.wp-block-post-author__avatar > img',
				],
				'elements/byline' => [
					'root' => '.wp-block-post-author__byline',
				],
				'elements/author' => [
					'root' => '.wp-block-post-author__name',
				],
				...blockera_load( 'inners.link', dirname( __DIR__ ) ),
			],
		],
	]
);
