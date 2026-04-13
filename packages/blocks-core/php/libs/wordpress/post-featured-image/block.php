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
				'border'                    => $sizeSelector,
				'shadow'                    => $sizeSelector,
				'filter'                    => $sizeSelector,
				'radius'                    => $sizeSelector,
			]
		),
	]
);
