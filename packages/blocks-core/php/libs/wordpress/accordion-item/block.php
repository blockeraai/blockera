<?php
/**
 * Configure block all arguments.
 *
 * @var array $args the block arguments!
 *
 * @package blockera/packages/blocks/js/wordpress/accordion-item
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
					'root' => '.is-open',
				],
				'blockera/states/close'      => [
					'root' => ':not(.is-open)',
				],
				'blockera/elements/heading'      => [
					'root' => '.wp-block-accordion-heading',
				],
				'blockera/elements/icon' => [
					'root' => '.wp-block-accordion-heading__toggle-icon',
				],
				'blockera/elements/panel'      => [
					'root' => '.wp-block-accordion-panel',
				],
			],
		),
	]
);
