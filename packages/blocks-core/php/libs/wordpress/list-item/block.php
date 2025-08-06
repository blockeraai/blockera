<?php
/**
 * Configure block all arguments.
 *
 * @var array $args the block arguments!
 *
 * @package blockera/packages/blocks/js/wordpress/list-item
 */

return array_merge(
	$args,
	[
		'selectors' => array_merge(
			$args['selectors'] ?? [],
			[
				'blockera/elements/link'        => [
					'root' => 'a:not(.wp-element-button)',
				],
				'blockera/states/marker'        => [
					'root' => '&::marker',
				],
			],
		),
		'supports' => array_merge(
			$args['supports'] ?? [],
			[
				'blockExtensions' => [
					'iconConfig' => [
						'blockeraIconPosition' => [
							'status' => false,
							'show' => false,
							'force' => false,
						],
					],
				],
				'blockFeatures' => [
					'icon' => [
						'status' => true,
						'htmlEditable' => [
							'status' => false,
						],
					],
				],
			],
		),
	]
);
