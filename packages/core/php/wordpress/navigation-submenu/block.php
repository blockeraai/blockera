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
					'blockera/states/current-menu-item' => [
						'root' => '&.current-menu-item',
					],
					'blockera/states/current-menu-parent' => [
						'root' => '&.current-menu-parent',
					],
					'blockera/states/current-menu-ancestor' => [
						'root' => '&.current-menu-ancestor',
					],
					'blockera/elements/link'              => [
						'root' => '> .wp-block-navigation-item__content',
					],
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
