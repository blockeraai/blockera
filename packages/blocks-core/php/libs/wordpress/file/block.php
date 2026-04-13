<?php
/**
 * Configure block all arguments.
 *
 * @var array $args the block arguments!
 *
 * @package blockera/packages/blocks/js/wordpress/file
 */

return array_merge(
	$args,
	[
		'selectors' => array_merge(
			$args['selectors'] ?? [],
			(array) array_merge(
				blockera_load( 'inners.link', dirname( __DIR__ ) ),
			),
			[
				'blockera/core/button' => [
					'root' => '.wp-element-button',
				],
			]
		),
	]
);
