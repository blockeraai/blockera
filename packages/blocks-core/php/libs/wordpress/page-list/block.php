<?php
/**
 * Configure block all arguments.
 *
 * @var array $args the block arguments!
 *
 * @package blockera/packages/blocks/js/wordpress/page-list
 */

return array_merge(
	$args,
	[
		'selectors' => array_merge(
			$args['selectors'] ?? [],
			[
				'blockera/elements/item' => [
					'root' => ':where(a)',
				],
				'blockera/elements/item-container' => [
					'root' => ':where(li)',
				],
				'blockera/states/marker'        => [
					'root' => ' :where(li)::marker',
				],
				'blockera/elements/icon' => [
					'root' => ' :where(li)::before',
				],
				'blockera/elements/current-page' => [
					'root' => ':where(li.current-menu-item a)',
				],
			],
		),
		'supports' => array_merge(
			$args['supports'] ?? [],
			[
				'blockFeatures' => [
					'icon' => [
						'status' => true,
						'htmlEditable' => [
							'status' => false,
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
