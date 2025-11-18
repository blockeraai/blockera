<?php
/**
 * Configure block all arguments.
 *
 * @var array $args the block arguments!
 *
 * @package blockera/packages/blocks/js/wordpress/post-featured-image
 */

$sizeSelector = '.wp-block-post-featured-image img';

return array_merge(
	$args,
	[
		'selectors' => array_merge(
			$args['selectors'] ?? [],
			[
				'blockeraWidth'             => $sizeSelector,
				'blockeraMinWidth'          => $sizeSelector,
				'blockeraMaxWidth'          => $sizeSelector,
				'blockeraHeight'            => $sizeSelector,
				'blockeraMinHeight'         => $sizeSelector,
				'blockeraMaxHeight'         => $sizeSelector, 
				'blockeraFit'               => $sizeSelector,
				'blockeraRatio'             => $sizeSelector,
				'blockeraBorder'            => $sizeSelector,
				'blockeraBorderRadius'      => $sizeSelector,
				'border'                    => $sizeSelector,
				'shadow'                    => $sizeSelector,
				'filter'                    => $sizeSelector,
				'radius'                    => $sizeSelector,
			]
		),
	]
);
