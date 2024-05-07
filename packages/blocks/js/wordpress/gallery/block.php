<?php
/**
 * Configure block all arguments.
 *
 * @var array $args the block arguments!
 *
 * @package blockera-core/packages/blocks/js/wordpress/gallery
 */

return array_merge(
	$args,
	[
		'selectors' => [
			'innerBlocks' => [
				'gallery_caption' => [
					'root' => '> figcaption',
				],
				'image' => [
					'root' => '.wp-block-image img',
				],
				'image_caption' => [
					'root' => '.wp-block-image figcaption',
				],
			],
		],
	]
);
