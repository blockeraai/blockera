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
				'elements/item-containers' => [
					'root' => '.wp-block-social-link',
				],
				'elements/item-icons'      => [
					'root' => '.wp-block-social-link svg',
				],
				'elements/item-names'      => [
					'root' => '.wp-block-social-link .wp-block-social-link-label',
				],
			],
		],
	]
);
