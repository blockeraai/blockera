<?php

if ( ! function_exists( 'blockera_add_custom_css_class_to_admin_menu' ) ) {

	/**
	 * Adding css class into WordPress admin menu link.
	 *
	 * @param array $menu the menu item.
	 *
	 * @return array the menu item.
	 */
	function blockera_add_custom_css_class_to_admin_menu( array $menu ): array {

		// Specify the slug of the menu item you want to target.
		$menu_slug = 'blockera-settings';

		// Specify the CSS class you want to add.
		$custom_class = 'blockera-disable-first-item';

		// Check if the current menu item matches the specified slug.
		foreach ( $menu as $key => $item ) {

			if ( $item[2] === $menu_slug ) {

				// Add the custom CSS class to the menu item.
				$menu[ $key ][4] .= ' ' . $custom_class;
			}
		}

		return $menu;
	}
}

add_filter( 'add_menu_classes', 'blockera_add_custom_css_class_to_admin_menu' );
