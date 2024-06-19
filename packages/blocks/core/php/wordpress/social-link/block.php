<?php
/**
 * Configure block all arguments.
 *
 * @var array $args the block arguments!
 *
 * @package blockera-core/packages/blocks/js/wordpress/social-link
 */

return array_merge(
	$args,
	[
		'selectors' => [
			'innerBlocks' => [
				'item_icon' => [
					'root' => 'svg',
				],
				'item_name' => [
					'root' => '.wp-block-social-link-label',
				],
			],
		],
	]
);
