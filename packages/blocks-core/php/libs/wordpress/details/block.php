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
	]
);
