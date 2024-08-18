<?php
/**
 * Configure block all arguments.
 *
 * @var array $args the block arguments!
 *
 * @package blockera/packages/blocks/js/wordpress/image
 */

return array_merge(
	$args,
	[
		'selectors' => array_merge(
			$args['selectors'] ?? [],
			[
				'blockeraWidth'             => '.wp-block-image img',
				'blockera/elements/caption' => [
					'root' => 'figcaption',
				],
			]
		),
	]
);
