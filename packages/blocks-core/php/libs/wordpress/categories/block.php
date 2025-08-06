<?php
/**
 * Configure block all arguments.
 *
 * @var array $args the block arguments!
 *
 * @package blockera/packages/blocks/js/wordpress/categories
 */

return array_merge(
	$args,
	[
		'selectors' => array_merge(
			$args['selectors'] ?? [],
			[
				'blockera/elements/term-item' => [
					'root' => 'li.cat-item > a',
				],
				'blockera/elements/list-item' => [
					'root' => 'li.cat-item',
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
				'blockExtensions' => [
					'iconConfig' => [
						'blockeraIconPosition' => [
							'status' => false,
							'show' => false,
							'force' => false,
						],
					],
				],
			],
		),
	]
);
