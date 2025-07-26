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
		'attributes' => array_merge(
			$args['attributes'] ?? [],
			[
				'blockeraDisplay' => [
					'type'    => 'string',
					'default' => [
						'value' => 'flex',
					],
				],
			]
		),
		'selectors'  => array_merge(
			$args['selectors'] ?? [],
			[
				'blockera/elements/item-containers' => [
					'root' => '.wp-block-social-link',
				],
				'blockera/elements/item-icons'      => [
					'root' => '.wp-block-social-link svg',
				],
				'blockera/elements/item-names'      => [
					'root' => '.wp-block-social-link .wp-block-social-link-label',
				],
			]
		),
	]
);
