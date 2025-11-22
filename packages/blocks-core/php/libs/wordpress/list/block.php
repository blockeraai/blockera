<?php
/**
 * Configure block all arguments.
 *
 * @var array $args the block arguments!
 *
 * @package blockera/packages/blocks/js/wordpress/list
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
				'blockera/elements/item'        => [
					'root' => ':where(li)',
				],
				'blockera/elements/icon' => [
					'root' => ' li::before',
				],
				'blockera/elements/bold' => [
					'root' => ':is(strong,b)',
				],
				'blockera/elements/italic' => [
					'root' => ':is(em,i)',
				],
				'blockera/elements/kbd' => [
					'root' => 'kbd',
				],
				'blockera/elements/code' => [
					'root' => 'code',
				],
				'blockera/elements/span' => [
					'root' => 'span:not([data-rich-text-placeholder])',
				],
				'blockera/elements/mark' => [
					'root' => ':is(mark,mark[class])',
				],
				'border' => 'ul',
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
