<?php

use Blockera\WordPress\RenderBlock\Setup;

blockera_load('callbacks', __DIR__);

add_filter( 'cron_schedules', 'blockera_add_cron_interval' );
add_action('admin_init', 'blockera_redirect_to_dashboard_page');
register_activation_hook(BLOCKERA_SB_FILE, 'blockera_activation_hook');
register_deactivation_hook(BLOCKERA_SB_FILE, 'blockera_deactivation_hook');

$setup = Setup::getInstance();
$setup->setAvailableBlocks(blockera_get_available_blocks());
add_filter(
    'register_block_type_args',
    function ( array $args, string $block_type ) use ( $setup ): array {
        return $setup->registerBlock($args, $block_type);
    },
    9e2,
    2
);
