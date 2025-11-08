<?php
/**
 * Configure block all arguments.
 *
 * @var array $args the block arguments!
 *
 * @package blockera/packages/blocks/js/wordpress/image
 */

$sizeSelector = '.wp-block-image :is(img:not([src=""]),svg:not(:empty))';

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
				'blockeraRatio'             => $sizeSelector,
				'blockeraBorder'            => $sizeSelector,
				'blockeraBorderRadius'      => $sizeSelector,
				'border'                    => $sizeSelector,
				'shadow'                    => $sizeSelector,
				'filter'                    => $sizeSelector,
				'radius'                    => $sizeSelector,
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
