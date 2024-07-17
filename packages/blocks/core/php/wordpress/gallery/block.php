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
		'selectors' => [
			'innerBlocks' => [
				'elements/gallery-caption' => [
					'root' => '> figcaption',
				],
				...blockera_load( 'inners.image', dirname( __DIR__ ) ),
				'elements/image-caption'   => [
					'root' => '.wp-block-image figcaption',
				],
			],
		],
	]
);
