<?php

if (! function_exists('blockera_add_custom_css_class_to_admin_menu')) {

    /**
     * Adding css class into WordPress admin menu link.
     *
     * @param array $menu the menu item.
     *
     * @return array the menu item.
     */
    function blockera_add_custom_css_class_to_admin_menu(array $menu): array
    {
        // Check if the current menu item matches the specified slug.
        foreach ($menu as $key => $item) {

            if ('blockera-settings-dashboard' === $item[2]) {

                // Add the custom CSS class to the menu item.
                $menu[ $key ][4] .= ' ' . 'blockera-disable-first-item';

                continue;
            }
        }

        return $menu;
    }
}

function add_custom_classes_to_menu()
{
    global $submenu;

    // Add custom classes to the submenu items.
    if (isset($submenu['blockera-settings-dashboard'])) {
        
        foreach ($submenu['blockera-settings-dashboard'] as $key => $submenu_item) {
            if (!in_array($submenu['blockera-settings-dashboard'][$key][2], ['blockera-settings-activate-pro-license', 'blockera-settings-upgrade-to-pro'], true)) {
                continue;
            }
            $submenu['blockera-settings-dashboard'][$key][4] = 'blockera-pro-submenu';
        }
    }
}


add_filter('add_submenu_classes', 'blockera_add_custom_css_class_to_admin_submenu');

add_action('admin_menu', function () {

    add_action('admin_head', 'add_custom_classes_to_menu');

});
