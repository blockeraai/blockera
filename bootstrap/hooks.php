<?php

use Blockera\WordPress\RenderBlock\Setup;
use Blockera\Setup\Compatibility\BlockSupports\BlockeraDuotone;

blockera_load('callbacks', __DIR__);

add_filter( 'cron_schedules', 'blockera_add_cron_interval' );
add_action('admin_init', 'blockera_redirect_to_dashboard_page');
register_activation_hook(BLOCKERA_SB_FILE, 'blockera_activation_hook');
register_deactivation_hook(BLOCKERA_SB_FILE, 'blockera_deactivation_hook');

// Blockera should be loaded hooks only on frontend and editor requests.
if (! blockera_is_frontend_request() && ! blockera_is_editor_request()) {
    return;
}

$blockera_setup_render_block = Setup::getInstance();
$blockera_setup_render_block->setPluginPath(blockera_core_config('app.vendor_path'));
$blockera_setup_render_block->setAvailableBlocks(blockera_get_available_blocks());
add_filter(
    'register_block_type_args',
    function ( array $args, string $block_type ) use ( $blockera_setup_render_block ): array {
        return $blockera_setup_render_block->registerBlock($args, $block_type);
    },
    9e2,
    2
);

// Filter to register the global styles post type arguments.
add_filter('register_wp_global_styles_post_type_args', 'blockera_register_wp_global_styles_post_type_args');

add_action( 'after_setup_theme', 'blockera_after_setup_theme', 0 );

function blockera_after_setup_theme() {
	// Core hooks (see wp-includes/default-filters.php).
	remove_action( 'wp_enqueue_scripts', 'wp_enqueue_global_styles' );
	remove_action( 'wp_footer', 'wp_enqueue_global_styles', 1 );
	remove_filter( 'render_block', array( 'WP_Duotone', 'render_duotone_support' ), 10, 3 );
	remove_action( 'init', 'register_block_core_template_part' );
	remove_filter( 'render_block_data', 'wp_render_block_style_variation_support_styles', 10, 2 );
	remove_filter( 'render_block', 'wp_render_layout_support_flag', 10, 2 );

	// Replace with your own implementation.
	add_action( 'wp_enqueue_scripts', 'blockera_enqueue_global_styles' );
	add_action( 'wp_footer', 'blockera_enqueue_global_styles', 1 );
	add_filter( 'render_block', array( BlockeraDuotone::class, 'render_duotone_support' ), 10, 3 );
	add_action( 'init', 'blockera_register_block_core_template_part' );
	add_filter( 'render_block_data', 'blockera_render_block_style_variation_support_styles', 10, 2 );
	add_filter( 'render_block', 'blockera_render_layout_support_flag', 10, 2 );
	add_filter('_get_block_templates_files', 'blockera_get_block_templates', PHP_INT_MAX, 3);
}
