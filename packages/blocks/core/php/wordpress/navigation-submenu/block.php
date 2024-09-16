<?php
/**
 * Configure block all arguments.
 *
 * @var array $args the block arguments!
 *
 * @package blockera/packages/blocks/js/wordpress/navigation-submenu
 */

return array_merge(
	$args,
	[
		'selectors' => array_merge(
			$args['selectors'] ?? [],
			(array) array_merge(
				[
					'blockera/elements/submenu-container' => [
						'root' => '.wp-block-navigation__submenu-container',
					],
					'blockera/elements/submenu-items'     => [
						'root' => '.wp-block-navigation-item',
					],
					'blockera/elements/submenu-icon'      => [
						'root' => '.wp-block-navigation__submenu-icon',
					],
				],
			)
		),
	]
);
