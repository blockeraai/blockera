<?php
/**
 * Configure block all arguments.
 *
 * @var array $args the block arguments!
 *
 * @package blockera/packages/blocks/js/wordpress/comments-pagination-previous
 */

return array_merge(
	$args,
	[
		'selectors' => array_merge(
			$args['selectors'] ?? [],
			[
				'blockera/elements/arrow' => [
					'root' => '.wp-block-comments-pagination-previous-arrow',
				],
			]
		),
	]
);
