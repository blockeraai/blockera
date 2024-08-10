<?php
/**
 * Configure block all arguments.
 *
 * @var array $args the block arguments!
 *
 * @package blockera/packages/blocks/js/wordpress/latest-comments
 */

return array_merge(
	$args,
	[
		'selectors' => array_merge(
			$args['selectors'] ?? [],
			[
				'innerBlocks' => [
					'elements/container'    => [
						'root' => '.wp-block-latest-comments__comment',
					],
					'elements/avatar'       => [
						'root' => '.wp-block-latest-comments__comment-avatar',
					],
					'elements/author'       => [
						'root' => '.wp-block-latest-comments__comment-author',
					],
					'elements/post-title'   => [
						'root' => '.wp-block-latest-comments__comment-link',
					],
					'elements/date'         => [
						'root' => '.wp-block-latest-comments__comment-date',
					],
					'elements/comment-text' => [
						'root' => '.wp-block-latest-comments__comment-excerpt',
					],
				],
			]
		),
	]
);
