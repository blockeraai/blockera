<?php

define('BLOCKERA_CORE_PATH', trailingslashit($root_dir));
define('BLOCKERA_CORE_FILE', trailingslashit($root_dir) . 'blockera.php');
define('BLOCKERA_CORE_VERSION', $_ENV['VERSION'] ?? getenv('VERSION'));
define('BLOCKERA_CORE_URI', trailingslashit(
    plugins_url($_ENV['BLOCKERA_DIR'] ?? getenv('__BLOCKERA_DIR__'))
));
