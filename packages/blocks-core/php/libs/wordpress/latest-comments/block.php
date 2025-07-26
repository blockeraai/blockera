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
				'blockera/elements/container'    => [
					'root' => '.wp-block-latest-comments__comment',
				],
				'blockera/elements/avatar'       => [
					'root' => '.wp-block-latest-comments__comment-avatar',
				],
				'blockera/elements/author'       => [
					'root' => '.wp-block-latest-comments__comment-author',
				],
				'blockera/elements/post-title'   => [
					'root' => '.wp-block-latest-comments__comment-link',
				],
				'blockera/elements/date'         => [
					'root' => '.wp-block-latest-comments__comment-date',
				],
				'blockera/elements/comment-text' => [
					'root' => '.wp-block-latest-comments__comment-excerpt',
				],
			]
		),
	]
);
