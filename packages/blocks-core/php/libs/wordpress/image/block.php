<?php
/**
 * Configure block all arguments.
 *
 * @var array $args the block arguments!
 *
 * @package blockera/packages/blocks/js/wordpress/image
 */

$sizeSelector = '.wp-block-image :is(img, svg)';

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
				'blockeraBorder'            => $sizeSelector,
				'blockeraBorderRadius'      => $sizeSelector,
				'blockera/elements/caption' => [
					'root' => 'figcaption',
				],
				'blockera/elements/link'    => [
					'root' => 'a',
				],
				'blockera/elements/img-tag' => [
					'root' => '&.wp-block-image :is(img, svg)',
				],
			]
		),
	]
);
