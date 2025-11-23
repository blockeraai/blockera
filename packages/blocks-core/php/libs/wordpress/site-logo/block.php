<?php
/**
 * Configure block all arguments.
 *
 * @var array $args the block arguments!
 *
 * @package blockera/packages/blocks/js/wordpress/site-logo
 */

$sizeSelector = '.wp-block-site-logo :is(img)';

return array_merge(
	$args,
	[
		'selectors' => array_merge(
			$args['selectors'] ?? [],
			[
				'width'                     => $sizeSelector,
				'blockeraWidth'             => $sizeSelector,
				'blockeraMinWidth'          => $sizeSelector,
				'blockeraMaxWidth'          => $sizeSelector,
				'blockeraHeight'            => $sizeSelector,
				'blockeraMinHeight'         => $sizeSelector,
				'blockeraMaxHeight'         => $sizeSelector, 
				'blockeraFit'               => $sizeSelector,
				'blockeraRatio'             => $sizeSelector,
				'filter'                    => $sizeSelector,
			]
		),
	]
);
