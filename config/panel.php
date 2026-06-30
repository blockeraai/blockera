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

$blockera_experimental_config_file = BLOCKERA_SB_PATH . 'experimental.config.json';

### BEGIN DEV-ONLY LOCAL EXPERIMENTAL CONFIG
if ( defined( 'BLOCKERA_SB_MODE' ) && 'development' === BLOCKERA_SB_MODE ) {
	$blockera_local_experimental_config_file = BLOCKERA_SB_PATH . 'local.experimental.config.json';

	if ( is_readable( $blockera_local_experimental_config_file ) ) {
		$blockera_experimental_config_file = $blockera_local_experimental_config_file;
	}
}
### END DEV-ONLY LOCAL EXPERIMENTAL CONFIG

ob_start();
include $blockera_experimental_config_file;

return [
	'std' => [
		'disabledBlocks' => [],
		'general'        => [
			'disableProHints'                => false,
			'disableRestrictBlockVisibility' => false,
			'allowedUserRoles'               => blockera_normalized_user_roles(),
			'allowedPostTypes' => blockera_get_post_types(),
			'disableRestrictBlockVisibilityByPostType' => false,
		],
		'earlyAccessLab' => json_decode(ob_get_clean(), true)['earlyAccessLab'] ?? [],
	],
];
