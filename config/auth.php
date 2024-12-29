<?php

return [

	/*
    |--------------------------------------------------------------------------
    | Prefix Transient Key
    |--------------------------------------------------------------------------
    |
    | This value represents the prefix for the transient key for subscription temporary data.
    |
    */
	'prefixTransientKey' => 'blockera-subscription__',

	/*
    |--------------------------------------------------------------------------
    | WordPress Option Key
    |--------------------------------------------------------------------------
    |
    | This option key is used to store client information in the WordPress
    | options table. The client information includes access tokens, subscription
    | details, and other account data needed for the Blockera integration.
    |
    */
	'optionKey' => blockera_core_env('OPTION_KEY', 'blockera-client-info'),

	/*
    |--------------------------------------------------------------------------
    | Plugin URL
    |--------------------------------------------------------------------------
    |
    | This value represents the URL of the Blockera Pro plugin.
    |
    */
	'pluginUrl' => blockera_core_env('PLUGIN_URL', 'https://blockera.ai/products/site-builder'),

	/*
    |--------------------------------------------------------------------------
    | Product ID
    |--------------------------------------------------------------------------
    |
    | This value represents the unique identifier for the Blockera Pro plugin
    | (blockera-pro). It is used when making API requests and managing subscriptions
    | to properly identify the Pro plugin for updates and license verification.
    |
    */
	'productId' => blockera_core_env('PRODUCT_ID', 'blockera-pro'),

	/*
    |--------------------------------------------------------------------------
    | API Base URL & Endpoints
    |--------------------------------------------------------------------------
    |
    | These configuration values define the base URL and various endpoints used
    | for communicating with the Blockera API. The endpoints handle tasks like
    | authentication, account management, license verification, and file downloads.
    | Default values are provided but can be overridden via environment variables.
    |
    */
	'apiBaseUrl' => blockera_core_env('API_BASE_URL', 'https://api.blockera.ai'),

	/*
    |--------------------------------------------------------------------------
    | Authorize
    |--------------------------------------------------------------------------
    |
    | The authorize endpoint is used to initiate the OAuth2 authorization flow.
    | When users connect their Blockera account, they are redirected to this URL
    | to authenticate and grant access permissions to the application.
    |
    */
	'authorizeUrl' => blockera_core_env('CONNECT_ACCOUNT_URL', 'https://api.blockera.ai/authorize'),

	/*
    |--------------------------------------------------------------------------
    | Create Account
    |--------------------------------------------------------------------------
    |
    | The create account endpoint is used to create a new account for the user.
    |
    */
	'createAccount' => blockera_core_env('CREATE_ACCOUNT_URL', 'https://blockera.ai/my-account'),

	/*
    |--------------------------------------------------------------------------
    | Get Account Info
    |--------------------------------------------------------------------------
    |
    | The get account info endpoint is used to retrieve detailed information
    | about the user's account, including subscription status and other relevant data.
    |
    */
	'getAccountInfoLink' => blockera_core_env('ACCOUNT_INFO_URL', 'https://blockera.ai/wp-json/auth/v1/licenses'),


	/*
    |--------------------------------------------------------------------------
    | Get Allowed Plans
    |--------------------------------------------------------------------------
    |
    | The get allowed plans endpoint is used to retrieve the allowed plans for the user.
    |
    */
	'getAllowedPlansLink' => blockera_core_env('ALLOWED_PLANS_URL', 'https://blockera.ai/wp-json/auth/v1/products/allowed-plans'),

	/*
    |--------------------------------------------------------------------------
    | Get Access Token
    |--------------------------------------------------------------------------
    |
    | The get access token endpoint is used to retrieve the access token for the user.
    |
    */
	'getAccessToken' => blockera_core_env('ACCESS_TOKEN_URL', 'https://api.blockera.ai/auth/v1/access-token'),

	/*
    |--------------------------------------------------------------------------
    | Unsubscribe
    |--------------------------------------------------------------------------
    |
    | The unsubscribe endpoint is used to unsubscribe the user from the subscription.
    |
    */
	'unsubscribeUrl' => blockera_core_env('UNSUBSCRIBE_URL', 'https://api.blockera.ai/license-manager/v1/domains'),

	/*
    |--------------------------------------------------------------------------
    | Resource Owner Details
    |--------------------------------------------------------------------------
    |
    | The resource owner details endpoint is used to retrieve detailed information
    | about the user's account, including subscription status and other relevant data.
    |
    */
	'resourceOwnerDetailsUrl' => blockera_core_env('RESOURCE_OWNER_DETAILS_URL', 'https://api.blockera.ai/downloads-manager/v1/download'),
];
