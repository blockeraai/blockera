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
					'default' => [
						'value' => 'flex',
					],
				],
			]
		),
		'selectors'  => array_merge(
			$args['selectors'] ?? [],
			[
				'blockera/elements/gallery-caption' => [
					'root' => '> figcaption',
				],
				'blockera/elements/image-caption'   => [
					// Double ".wp-block-image" to make sure it has more specificity than the gallery caption.
					'root' => 'figure.wp-block-image.wp-block-image figcaption.wp-element-caption',
				],
			]
		),
	]
);
