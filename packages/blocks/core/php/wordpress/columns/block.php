<?php
/**
 * Configure block all arguments.
 *
 * @var array $args the block arguments!
 *
 * @package blockera/packages/blocks/js/wordpress/columns
 */

return array_merge(
	$args,
	[
		'attributes' => array_merge(
			$args['attributes'] ?? [],
			[
				'blockeraDisplay' => [
					'type'    => 'string',
					'default' => 'flex',
				],
			]
		),
		'selectors'  => array_merge(
			$args['selectors'] ?? [],
			[
				'innerBlocks' => array_merge(
					blockera_load( 'inners.link', dirname( __DIR__ ) ),
					blockera_load( 'inners.button', dirname( __DIR__ ) ),
					blockera_load( 'inners.headings', dirname( __DIR__ ) ),
					blockera_load( 'inners.paragraph', dirname( __DIR__ ) ),
				),
			]
		),
	]
);
