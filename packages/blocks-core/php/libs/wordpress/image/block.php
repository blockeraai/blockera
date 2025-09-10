<?php
/**
 * Configure block all arguments.
 *
 * @var array $args the block arguments!
 *
 * @package blockera/packages/blocks/js/wordpress/image
 */

$sizeSelector = '.wp-block-image img, .wp-block-image svg';

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
				'blockeraRatio'             => $sizeSelector,
				'blockera/elements/caption' => [
					'root' => 'figcaption',
				],
				'blockera/elements/link'    => [
					'root' => 'a',
				],
			]
		),
	]
);
