<?php
/**
 * Configure block all arguments.
 *
 * @var array $args the block arguments!
 *
 * @package blockera/packages/blocks/js/wordpress/post-terms
 */

return array_merge(
	$args,
	[
		'selectors' => array_merge(
			$args['selectors'] ?? [],
			[
				'innerBlocks' => array_merge(
					[
						'elements/separator' => [
							'root' => '.wp-block-post-terms__separator',
						],
						'elements/prefix'    => [
							'root' => '.wp-block-post-terms__prefix',
						],
						'elements/suffix'    => [
							'root' => '.wp-block-post-terms__suffix',
						],
					],
					blockera_load( 'inners.link', dirname( __DIR__ ) ),
				),
			]
		),
	]
);
