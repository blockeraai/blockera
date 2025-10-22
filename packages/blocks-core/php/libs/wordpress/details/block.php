<?php
/**
 * Configure block all arguments.
 *
 * @var array $args the block arguments!
 *
 * @package blockera/packages/blocks/js/wordpress/details
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
					'root' => '&.wp-block-details[open]',
				], 
				'blockera/elements/title'      => [
					'root' => 'summary',
				],
				'blockera/elements/title-icon' => [
					'root' => 'summary::marker',
				],
				'blockera/elements/link'       => [
					'root' => 'a:not(.wp-element-button)',
				],
				'blockera/core/paragraph'      => [
					'root' => 'p',
				],
			],
		),
	]
);
