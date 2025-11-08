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
				'blockera/elements/icon'        => [
					'root' => '&:before',
				],
				'blockera/elements/link'        => [
					'root' => 'a:not(.wp-element-button)',
				],
				'blockera/states/marker'        => [
					'root' => '&::marker',
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
