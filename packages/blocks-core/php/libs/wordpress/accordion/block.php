<?php
/**
 * Configure block all arguments.
 *
 * @var array $args the block arguments!
 *
 * @package blockera/packages/blocks/js/wordpress/accordion
 */

return array_merge(
	$args,
	[
		'supports'  => array_merge(
			$args['supports'] ?? [],
			[
				'blockeraStyleEngine' => [
					'gap-type' => 'gap-and-margin',
				],
			]
		),
		'selectors' => array_merge(
			$args['selectors'] ?? [],
			[
				'blockera/states/open'      => [
					'root' => ' :where(.wp-block-accordion-item.is-open)',
				], 
				'blockera/states/close'      => [
					'root' => ' :where(.wp-block-accordion-item:not(.is-open))',
				], 
				'blockera/elements/items'      => [
					'root' => ' :where(.wp-block-accordion-item)',
				],
				'blockera/elements/heading'      => [
					'root' => ' :where(.wp-block-accordion-heading)',
				],
				'blockera/elements/icon' => [
					'root' => ' :where(.wp-block-accordion-heading__toggle-icon)',
				],
				'blockera/elements/panel'      => [
					'root' => ' :where(.wp-block-accordion-panel)',
				],
			],
		),
	]
);
