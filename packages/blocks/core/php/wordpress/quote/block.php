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
			[
				'innerBlocks' => array_merge(
					[
						[
							'citation' => [
								'root' => 'cite',
							],
						],
					],
					blockera_load( 'inners.link', dirname( __DIR__ ) ),
					blockera_load( 'inners.button', dirname( __DIR__ ) ),
					blockera_load( 'inners.headings', dirname( __DIR__ ) ),
					blockera_load( 'inners.paragraph', dirname( __DIR__ ) ),
				),
			]
		),
	]
);
