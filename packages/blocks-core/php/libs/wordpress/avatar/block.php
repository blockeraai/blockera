<?php
/**
 * Configure block all arguments.
 *
 * @var array $args the block arguments!
 *
 * @package blockera/packages/blocks/js/wordpress/avatar
 */

$sizeSelector = '.wp-block-avatar img';

return array_merge(
	$args,
	[
		'selectors' => array_merge(
			$args['selectors'] ?? [],
			[
				'blockeraWidth'     => $sizeSelector,
				'blockeraMinWidth'  => $sizeSelector,
				'blockeraMaxWidth'  => $sizeSelector,
				'blockeraHeight'    => $sizeSelector,
				'blockeraMinHeight' => $sizeSelector,
				'blockeraMaxHeight' => $sizeSelector,
			]
		),
	]
);
