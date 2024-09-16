<?php
/**
 * Configure block all arguments.
 *
 * @var array $args the block arguments!
 *
 * @package blockera/packages/blocks/js/wordpress/archives
 */

return array_merge(
	$args,
	[
		'selectors' => array_merge(
			$args['selectors'] ?? [],
			(array) array_merge(
				[
					'blockera/elements/item'        => [
						'root'            => 'a',
						'blockeraSpacing' => 'li',
					],
					'blockera/elements/item-marker' => [
						'root' => 'li::marker',
					],
				],
			)
		),
	]
);
