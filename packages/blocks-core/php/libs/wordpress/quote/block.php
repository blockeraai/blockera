<?php
/**
 * Configure block all arguments.
 *
 * @var array $args the block arguments!
 *
 * @package blockera/packages/blocks/js/wordpress/quote
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
			(array) array_merge(
				[
					'blockera/elements/citation' => [
						'root' => 'cite',
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
						'root' => 'span',
					],
					'blockera/elements/mark' => [
						'root' => 'mark',
					],
				],
				blockera_load( 'inners.link', dirname( __DIR__ ) ),
				blockera_load( 'inners.button', dirname( __DIR__ ) ),
				blockera_load( 'inners.headings', dirname( __DIR__ ) ),
				blockera_load( 'inners.paragraph', dirname( __DIR__ ) ),
			)
		),
	]
);
