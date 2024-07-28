<?php
/**
 * Configure block all arguments.
 *
 * @var array $args the block arguments!
 *
 * @package blockera/packages/blocks/js/wordpress/pullquote
 */

return array_merge(
	$args,
	[
		'selectors' => array_merge(
			$args['selectors'] ?? [],
			[
				'innerBlocks' => array_merge(
					[
						'citation' => [
							'root' => 'cite',
						],
					],
					blockera_load( 'inners.link', dirname( __DIR__ ) ),
					blockera_load( 'inners.paragraph', dirname( __DIR__ ) ),
				),
			]
		),
	]
);
