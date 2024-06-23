<?php
/**
 * Configure block all arguments.
 *
 * @var array $args the block arguments!
 *
 * @package blockera/packages/blocks/js/wordpress/social-links
 */

return array_merge(
	$args,
	[
		'selectors' => [
			'innerBlocks' => [
				'item_containers' => [
					'root' => '.wp-block-social-link',
				],
				'item_icons'      => [
					'root' => '.wp-block-social-link svg',
				],
				'item_names'      => [
					'root' => '.wp-block-social-link .wp-block-social-link-label',
				],
			],
		],
	]
);
