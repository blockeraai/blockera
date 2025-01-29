<?php

define('BLOCKERA_SB_PATH', trailingslashit($root_dir));
define('BLOCKERA_SB_FILE', trailingslashit($root_dir) . 'blockera.php');
define('BLOCKERA_SB_VERSION', $_ENV['VERSION'] ?? getenv('VERSION'));
define('BLOCKERA_SB_URI', trailingslashit(
    plugins_url($_ENV['BLOCKERA_DIR'] ?? getenv('__BLOCKERA_DIR__'))
));
