<?php
/**
 * Configure block all arguments.
 *
 * @var array $args the block arguments!
 *
 * @package blockera/packages/blocks/js/wordpress/gallery
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
			[
				'innerBlocks' => [
					'gallery_caption' => [
						'root' => '> figcaption',
					],
					'image'           => [
						'root' => '.wp-block-image img',
					],
					'image_caption'   => [
						'root' => '.wp-block-image figcaption',
					],
				],
			]
		),
	]
);
