<?php

// direct access is not allowed.
if ( ! defined( 'ABSPATH' ) ) exit;

return [
	'std' => [
		'disabledBlocks' => [],
		'general'        => [
			'disableProHints'                => false,
			'disableRestrictBlockVisibility' => false,
			'allowedUserRoles'               => blockera_normalized_user_roles(),
		],
	],
];
