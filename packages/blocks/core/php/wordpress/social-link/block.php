<?php
/**
 * Configure block all arguments.
 *
 * @var array $args the block arguments!
 *
 * @package blockera/packages/blocks/js/wordpress/social-link
 */

return array_merge(
	$args,
	[
		'selectors' => [
			'innerBlocks' => [
				'elements/item-icon' => [
					'root' => 'svg',
				],
				'elements/item-name' => [
					'root' => '.wp-block-social-link-label',
				],
			],
		],
	]
);
