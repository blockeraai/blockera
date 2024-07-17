<?php
/**
 * Configure block all arguments.
 *
 * @var array $args the block arguments!
 *
 * @package blockera/packages/blocks/js/wordpress/search
 */

$inputs = blockera_load( 'inners.inputs', dirname( __DIR__ ) );

// We not needs to "elements/input-label" and "elements/remember" inside search block!
unset( $inputs['elements/input-label'], $inputs['elements/remember'] );

return array_merge(
	$args,
	[
		'selectors' => [
			'innerBlocks' => [
				'elements/label' => [
					'root' => '.wp-block-search__label',
				],
				'elements/input' => $inputs['elements/input'],
				...blockera_load( 'inners.button', dirname( __DIR__ ) ),
			],
		],
	]
);
