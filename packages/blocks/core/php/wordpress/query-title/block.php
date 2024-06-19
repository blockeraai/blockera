<?php
/**
 * Configure block all arguments.
 *
 * @var array $args the block arguments!
 *
 * @package blockera-core/packages/blocks/js/wordpress/query-title
 */

return array_merge(
	$args,
	[
		'selectors' => [
			'innerBlocks' => [
				'link' => [
					'root' => 'a:not(.wp-element-button)',
				],
			],
		],
	]
);
