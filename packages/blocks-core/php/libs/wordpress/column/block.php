<?php
/**
 * Configure block all arguments.
 *
 * @var array $args the block arguments!
 *
 * @package blockera/packages/blocks/js/wordpress/column
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
				'blockeraStyleEngineConfig' => [
					'blockeraWidth' => [
						'width' => 'flex-basis',
						'for' => 'master',
					],
				],
			]
		),
		'selectors' => array_merge(
			$args['selectors'] ?? [],
			(array) array_merge(
				blockera_load( 'inners.link', dirname( __DIR__ ) ),
				blockera_load( 'inners.button', dirname( __DIR__ ) ),
				blockera_load( 'inners.headings', dirname( __DIR__ ) ),
				blockera_load( 'inners.paragraph', dirname( __DIR__ ) ),
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
						'root' => 'span:not([data-rich-text-placeholder])',
					],
					'blockera/elements/mark' => [
						'root' => ':is(mark,mark[class])',
					],
				]
			)
		),
	]
);
