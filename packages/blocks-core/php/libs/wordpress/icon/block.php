<?php
/**
 * Configure block all arguments.
 *
 * @var array $args the block arguments!
 *
 * @package blockera/packages/blocks/js/wordpress/icon
 */

$icon_svg_selector = '&.wp-block-icon svg';

return array_merge(
	$args,
	[
		'attributes' => array_merge(
			$args['attributes'] ?? [],
			[
				'href'       => [
					'type' => 'string',
				],
				'linkTarget' => [
					'type' => 'string',
				],
				'rel'        => [
					'type' => 'string',
				],
			]
		),
		'selectors'  => array_merge(
			$args['selectors'] ?? [],
			[
				'color' => [
					'root' => $icon_svg_selector,
				],
				'border' => [
					'root' => $icon_svg_selector,
				],
				'border-radius' => [
					'root' => $icon_svg_selector,
				],
				'width' => [
					'root' => $icon_svg_selector,
				],
				'blockera/elements/icon' => [
					'root' => $icon_svg_selector,
				],
				'htmlEditable' => [
					'root' => $icon_svg_selector,
				],
			]
		),
		'supports' => array_merge(
			$args['supports'] ?? [],
			[
				'blockExtensions' => [
					'iconConfig' => [
						'blockeraIconPosition' => [
							'status' => false,
							'show'   => false,
							'force'  => false,
						],
						'blockeraIconGap' => [
							'status' => false,
							'show'   => false,
							'force'  => false,
						],
						'blockeraIconLink' => [
							'status' => false,
							'show'   => false,
							'force'  => false,
						],
						'blockeraIconSize' => [
							'config' => [
								'attribute' => 'blockeraWidth',
							],
						],
					],
				],
				'blockFeatures' => [
					'icon' => [
						'status'       => true,
						'htmlEditable' => [
							'status' => false,
						],
					],
				],
			],
		),
	]
);
