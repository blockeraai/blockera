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
					'root' => 'li',
				],
				'blockera/elements/icon' => [
					'root' => ' li::before',
				],
			],
		),
		'supports' => array_merge(
			$args['supports'] ?? [],
			[
				'iconConfig' => [
					'blockeraIconPosition' => [
						'status' => false,
						'show' => false,
						'force' => false,
					],
				],
			],
		),
	]
);
