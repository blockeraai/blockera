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
				'blockera/core/image'               => [
					'root' => '.wp-block-image img',
				],
				'blockera/elements/gallery-caption' => [
					'root' => '> figcaption',
				],
				'blockera/elements/image-caption'   => [
					'root' => '.wp-block-image figcaption',
				],
			]
		),
	]
);
