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
			(array) array_merge(
				[
					'blockera/elements/separator' => [
						'root' => '.wp-block-post-terms__separator',
					],
					'blockera/elements/prefix'    => [
						'root' => '.wp-block-post-terms__prefix',
					],
					'blockera/elements/suffix'    => [
						'root' => '.wp-block-post-terms__suffix',
					],
				],
				blockera_load( 'inners.link', dirname( __DIR__ ) ),
			)
		),
	]
);
