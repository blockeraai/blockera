<?php

return [
	'connectAccount' => blockera_core_env('CONNECT_ACCOUNT_URL', 'https://blockera.ai/authorize'),
	'createAccount' => blockera_core_env('CREATE_ACCOUNT_URL', 'https://blockera.ai/wp-login.php'),
	'getAccessToken' => blockera_core_env('ACCESS_TOKEN_URL', 'https://blockera.ai/wp-json/auth/v1/token'),
	'getSubscription' => blockera_core_env('SUBSCRIPTION_URL', 'https://blockera.ai/auth/v1/subscription'),
];
