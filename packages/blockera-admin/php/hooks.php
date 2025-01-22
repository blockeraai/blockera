<?php

if (! function_exists('blockera_pro_add_custom_classes_to_menu')) {

    /**
     * Adding custom css classes into specific admin menu items.
     *
     * @return void
     */
    function blockera_pro_add_custom_classes_to_menu(): void {
        global $submenu;

        // Add custom classes to the submenu items.
        if (isset($submenu['blockera-settings-dashboard'])) {

            foreach ($submenu['blockera-settings-dashboard'] as $key => $submenu_item) {

                if ( in_array($submenu_item[3], [ 'Upgrade to Pro', 'Activate Pro License' ], true) || 'blockera-settings-account' === $submenu['blockera-settings-dashboard'][ $key ][2]) {
                    $submenu['blockera-settings-dashboard'][ $key ][4] = 'blockera-pro-submenu';
                }
            }
        }
    }
}

add_action(
    'admin_menu',
    function () {
        add_action('admin_head', 'blockera_pro_add_custom_classes_to_menu');
    }
);
