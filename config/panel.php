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
		'allowedPostTypes' => blockera_get_post_types(),
		'disableRestrictBlockVisibilityByPostType' => false,
    ],
	'earlyAccessLab' => json_decode($json, true)['earlyAccessLab'] ?? [],
];

return compact('std');
