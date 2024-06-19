<?php
/**
 * Configure block all arguments.
 *
 * @var array $args the block arguments!
 *
 * @package blockera-core/packages/blocks/js/wordpress/post-author
 */

return array_merge(
	$args,
	[
		'selectors' => [
			'innerBlocks' => [
				'avatar' => [
					'root' => '.wp-block-post-author__avatar > img',
				],
				'byline' => [
					'root' => '.wp-block-post-author__byline',
				],
				'author' => [
					'root' => '.wp-block-post-author__name',
				],
				'link' => [
					'root' => 'a:not(.wp-element-button)',
				],
			],
		],
	]
);
