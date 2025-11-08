<?php
/**
 * Configure block all arguments.
 *
 * @var array $args the block arguments!
 *
 * @package blockera/packages/blocks/js/wordpress/post-template
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
			blockera_load( 'inners.link', dirname( __DIR__ ) ),
			[
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
					'root' => 'span',
				],
				'blockera/elements/mark' => [
					'root' => 'mark',
				],
			]
		),
	]
);
