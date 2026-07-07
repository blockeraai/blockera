<?php
/**
 * Configure block all arguments.
 *
 * @var array $args the block arguments!
 *
 * @package blockera/packages/blocks/js/wordpress/navigation
 */

// Top-level menu items only: direct children of the navigation list (not nested submenu items).
// See wp-includes/blocks/navigation/style.css — submenu items live inside .wp-block-navigation__submenu-container.
$top_level_nav_items = ':is(.wp-block-navigation__container, .wp-block-page-list) > .wp-block-navigation-item';

return array_merge(
	$args,
	[
		'attributes' => array_merge(
			$args['attributes'] ?? [],
			[
				'blockeraDisplay' => [
					'type'    => 'string',
					'default' => [
						'value' => 'flex',
					],
				],
			]
		),
		'supports'  => array_merge(
			$args['supports'] ?? [],
			[
				'blockeraStyleEngine' => [
					'gap-type' => 'flex-or-empty',
				],
			]
		),
		'selectors' => array_merge(
			$args['selectors'] ?? [],
			[
				'blockera/elements/link-items' => [
					'root' => $top_level_nav_items,
				],
				'blockera/states/current-menu-item' => [
					'root' => ':is(.wp-block-navigation__container, .wp-block-page-list) > .wp-block-navigation-item.current-menu-item',
				],
				'blockera/states/current-menu-parent' => [
					'root' => ':is(.wp-block-navigation__container, .wp-block-page-list) > .wp-block-navigation-item.current-menu-parent',
				],
				'blockera/states/current-menu-ancestor' => [
					'root' => ':is(.wp-block-navigation__container, .wp-block-page-list) > .wp-block-navigation-item.current-menu-ancestor',
				],
			]
		),
	]
);
