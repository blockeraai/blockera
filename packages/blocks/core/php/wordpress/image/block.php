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
		'selectors' => [
			'innerBlocks' => [
				'elements/caption' => [
					'root' => 'figcaption',
				],
			],
		],
	]
);
