<?php
/**
 * Blockera panel config.
 *
 * @package Blockera
 */

// direct access is not allowed.
if (! defined('ABSPATH')) {
    exit;
}

ob_start();
include BLOCKERA_SB_PATH . 'experimental.config.json';
$json = ob_get_clean();

$std = [
    'disabledBlocks' => [],
    'general'        => [
        'disableProHints'                => false,
        'disableRestrictBlockVisibility' => false,
        'allowedUserRoles'               => blockera_normalized_user_roles(),
    ],
	'labAndExperimental' => json_decode($json, true)['labAndExperimental'] ?? [],
];

return compact('std');
