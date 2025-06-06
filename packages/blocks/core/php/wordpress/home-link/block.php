<?php
/**
 * Configure block all arguments.
 *
 * @var array $args the block arguments!
 *
 * @package blockera/packages/blocks/js/wordpress/home-link
 */

return array_merge(
	$args,
	[
		'selectors' => array_merge(
			$args['selectors'] ?? [],
			[
				'blockera/states/current-menu-item' => [
					'root' => '&.current-menu-item',
				], 
				'blockera/elements/link' => [
					'root' => '.wp-block-navigation-item__content',
				],
			]
		),
	]
);
