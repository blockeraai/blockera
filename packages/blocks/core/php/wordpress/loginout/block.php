<?php
/**
 * Configure block all arguments.
 *
 * @var array $args the block arguments!
 *
 * @package blockera/packages/blocks/js/wordpress/loginout
 */

return array_merge(
	$args,
	[
		'selectors' => [
			'innerBlocks' => [
				'elements/form' => [
					'root' => 'form',
				],
				...blockera_load( 'inners.inputs', dirname( __DIR__ ) ),
				...blockera_load( 'inners.button', dirname( __DIR__ ) ),
			],
		],
	]
);
