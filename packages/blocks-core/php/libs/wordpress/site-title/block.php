<?php
/**
 * Configure block all arguments.
 *
 * @var array $args the block arguments!
 *
 * @package blockera/packages/blocks/js/wordpress/site-title
 */

$custom_selectors = array_merge(
	blockera_load( 'inners.link', dirname( __DIR__ ) ),
	[
		'htmlEditable' => [
			'root' => '.wp-block-site-title a',
		],
	]
);

return array_merge(
	$args,
	[
		'selectors' => array_merge( $args['selectors'] ?? [], $custom_selectors	),
	]
);
