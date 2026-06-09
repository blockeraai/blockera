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
				// Feature selectors.
				'width' => $sizeSelector,
				'object-fit' => $sizeSelector,
				'box-sizing' => $sizeSelector,
				'blockeraRatio' => [
					'root' => $sizeSelector,
				],
				'border' => $sizeSelector,
				'shadow' => $sizeSelector,
				'filter' => $sizeSelector,
				'border-radius' => $sizeSelector,
				// Inner blocks selectors.
				'blockera/elements/caption' => [
					'root' => '&:is(.has-custom-border, :not(.has-custom-border)):is(figure) figcaption.wp-element-caption',
				],
				'blockera/elements/link' => [
					'root' => 'a',
				],
				'blockera/elements/img-tag' => [
					'root' => '&.wp-block-image :is(img, svg)',
				],
			]
		),
	]
);
