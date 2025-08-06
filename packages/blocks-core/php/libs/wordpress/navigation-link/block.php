<?php
/**
 * Configure block all arguments.
 *
 * @var array $args the block arguments!
 *
 * @package blockera/packages/blocks/js/wordpress/navigation-link
 */

return array_merge(
	$args,
	[
		'attributes' => array_merge(
			$args['attributes'] ?? [],
			[
				'blockeraIconGap' => [
					'type'    => 'string',
					'default' => [
						'value' => '5px',
					],
				],
			]
		),
		'selectors' => array_merge(
			$args['selectors'] ?? [],
			[
				'blockera/states/current-menu-item' => [
					'root' => '&.current-menu-item',
				],
				'blockera/states/current-menu-parent' => [
					'root' => '&.current-menu-parent',
				],
				'blockera/states/current-menu-ancestor' => [
					'root' => '&.current-menu-ancestor',
				],
				'blockera/elements/link' => [
					'root' => '.wp-block-navigation-item__content',
				],
				'blockera/elements/icon' => [
					'root' => ' .wp-block-navigation-item__content .blockera-icon',
				],
				'htmlEditable' => [
					'root' => ' .wp-block-navigation-item__content .wp-block-navigation-item__label',
				],
			]
		),
		'supports' => array_merge(
			$args['supports'] ?? [],
			[
				'blockFeatures' => [
					'icon' => [
						'status' => true,
						'htmlEditable' => [
							'status' => true,
						],
					],
				],
			],
		),
	]
);
