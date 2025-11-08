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
					'root' => ' .wp-block-navigation-item__content .wp-block-navigation-item__label svg',
				],
				'htmlEditable' => [
					'root' => ' .wp-block-navigation-item__content .wp-block-navigation-item__label',
				],
				'blockera/elements/bold' => [
					'root' => 'strong, b',
				],
				'blockera/elements/italic' => [
					'root' => 'em, i',
				],
				'blockera/elements/kbd' => [
					'root' => 'kbd',
				],
				'blockera/elements/code' => [
					'root' => 'code',
				],
				'blockera/elements/span' => [
					'root' => 'span',
				],
				'blockera/elements/mark' => [
					'root' => 'mark',
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
