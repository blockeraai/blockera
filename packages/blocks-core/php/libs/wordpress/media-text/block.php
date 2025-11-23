<?php
/**
 * Configure block all arguments.
 *
 * @var array $args the block arguments!
 *
 * @package blockera/packages/blocks/js/wordpress/media-text
 */

$sizeSelector = '.wp-block-media-text__media img';

return array_merge(
	$args,
	[
		'selectors' => array_merge(
			$args['selectors'] ?? [],
			(array) array_merge(
				[
					'blockera/core/image' => [
						'root' => '.wp-block-media-text__media',
						'width' => $sizeSelector,
						'blockeraWidth' => $sizeSelector,
						'blockeraMinWidth' => $sizeSelector,
						'blockeraMaxWidth' => $sizeSelector,
						'blockeraHeight' => $sizeSelector,
						'blockeraMinHeight' => $sizeSelector,
						'blockeraMaxHeight' => $sizeSelector, 
						'blockeraFit' => $sizeSelector,
						'blockeraRatio' => $sizeSelector,
						'blockeraBorder' => $sizeSelector,
						'blockeraBorderRadius' => $sizeSelector,
						'border' => $sizeSelector,
						'shadow' => $sizeSelector,
						'filter' => $sizeSelector,
						'radius' => $sizeSelector,
					],
				],
				blockera_load( 'inners.link', dirname( __DIR__ ) ),
				blockera_load( 'inners.button', dirname( __DIR__ ) ),
				blockera_load( 'inners.headings', dirname( __DIR__ ) ),
				blockera_load( 'inners.paragraph', dirname( __DIR__ ) ),
			)
		),
	]
);
