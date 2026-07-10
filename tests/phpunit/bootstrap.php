<?php

define('BLOCKERA_SB_PATH', trailingslashit($root_dir));
define('BLOCKERA_SB_FILE', trailingslashit($root_dir) . 'blockera.php');
define('BLOCKERA_SB_VERSION', $_ENV['VERSION'] ?? getenv('VERSION'));
define('BLOCKERA_SB_URI', trailingslashit(
    plugins_url($_ENV['BLOCKERA_DIR'] ?? getenv('__BLOCKERA_DIR__'))
));
define('BLOCKERA_SB_TESTING', true);

switch_theme('twentytwentyfive');

blockera_add_icon_style_definitions();
blockera_register_core_icon_navigation_hooks();

global $blockera_block_supports;
$blockera_block_supports = blockera_get_available_block_supports();

require_once BLOCKERA_SB_PATH . 'bootstrap/hooks.php';
