<?php
/**
 * Configure block all arguments.
 *
 * @var array $args the block arguments!
 *
 * @package blockera-core/packages/blocks/js/wordpress/paragraph
 */

return array_merge(
	$args,
	[
		'selectors' => [
			'innerBlocks' => [
				'caption' => [
					'root' => 'figcaption',
				],
			],
		],
	]
);
