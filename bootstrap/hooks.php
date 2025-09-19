<?php

use Blockera\WordPress\RenderBlock\Setup;

blockera_load('callbacks', __DIR__);

add_filter( 'cron_schedules', 'blockera_add_cron_interval' );
add_action('admin_init', 'blockera_redirect_to_dashboard_page');
register_activation_hook(BLOCKERA_SB_FILE, 'blockera_activation_hook');
register_deactivation_hook(BLOCKERA_SB_FILE, 'blockera_deactivation_hook');

$setup = Setup::getInstance();
$setup->setPluginPath(blockera_core_config('app.vendor_path'));
$setup->setAvailableBlocks(blockera_get_available_blocks());
add_filter(
    'register_block_type_args',
    function ( array $args, string $block_type ) use ( $setup ): array {
        return $setup->registerBlock($args, $block_type);
    },
    9e2,
    2
);

// Filter to register the global styles post type arguments.
add_filter('register_wp_global_styles_post_type_args', 'blockera_register_wp_global_styles_post_type_args');

// Global styles can be enqueued in both the header and the footer. See https://core.trac.wordpress.org/ticket/53494.
add_action('wp_enqueue_scripts', 'blockera_enqueue_global_styles');
add_action('enqueue_block_editor_assets', 'blockera_enqueue_global_styles', 1);
// add_action('wp_footer', 'blockera_enqueue_global_styles', 1);.
