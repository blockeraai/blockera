<?php

add_filter( 'cron_schedules', 'blockera_add_cron_interval' );

/**
 * Add the 6 days schedule on stack.
 *
 * @param array $schedules The schedules array.
 *
 * @return array the new schedules array.
 */
function blockera_add_cron_interval( array $schedules ): array {

    $schedules['blockera_6_days'] = array(
        'interval' => 60 * 60 * 24 * 6,
        'display'  => esc_html__('Every 6 Days', 'blockera'),
    );
    $schedules['blockera_7_days'] = array(
        'interval' => 60 * 60 * 24 * 7,
        'display'  => esc_html__('Every 7 Days', 'blockera'),
    );

    return $schedules;
}


add_action('admin_init', 'blockera_redirect_to_dashboard_page');


/**
 * Redirecting your WordPress admin to your plugin dashboard page after activation it.
 *
 * @return void
 */
function blockera_redirect_to_dashboard_page(): void {

    if (blockera_telemetry_opt_in_is_off('blockera')) {

        return;
    }

    $option = blockera_core_config('telemetryRestParams.slug') . '_do_activation_redirect';

    // Check if the redirect flag is set and the user has sufficient permissions.
    if (get_option($option, false)) {

        delete_option($option);

        if (is_admin() && current_user_can('activate_plugins')) {

            // Redirect to plugin dashboard or settings page.
            wp_redirect(admin_url('admin.php?page=' . blockera_core_config('app.dashboard_page')));
            exit;
        }
    }
}

register_activation_hook(BLOCKERA_SB_FILE, 'blockera_activation_hook');

/**
 * Activation plugin hook.
 *
 * @return void
 */
function blockera_activation_hook(): void {

    if (! wp_next_scheduled('blockera_each_six_days')) {

        wp_schedule_event(time(), 'blockera_6_days', 'blockera_each_six_days');
    }
    if (! wp_next_scheduled('blockera_each_seven_days')) {

        wp_schedule_event(time(), 'blockera_7_days', 'blockera_each_seven_days');
    }

    add_option(blockera_core_config('telemetryRestParams.slug') . '_do_activation_redirect', true);
}

register_deactivation_hook(BLOCKERA_SB_FILE, 'blockera_deactivation_hook');

/**
 * Deactivation plugin hook.
 *
 * @return void
 */
function blockera_deactivation_hook(): void {

    wp_clear_scheduled_hook('blockera_each_six_days');
    wp_clear_scheduled_hook('blockera_each_seven_days');
}
