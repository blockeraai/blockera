// @flow

/**
 * External dependencies
 */
import { applyFilters } from '@wordpress/hooks';

export type CompanionPluginConfig = {
	slug: string,
	plugin: string,
	name: string,
	status: 'not-installed' | 'inactive' | 'active',
	canInstall: boolean,
	canActivate: boolean,
};

const DEFAULT_COMPANION_PLUGIN_CONFIG: CompanionPluginConfig = {
	slug: 'blockera',
	plugin: 'blockera/blockera.php',
	name: 'Blockera Site Builder',
	status: 'not-installed',
	canInstall: false,
	canActivate: false,
};

/**
 * Resolve companion plugin configuration from PHP + filters.
 */
export function getCompanionPluginConfig(): CompanionPluginConfig {
	const fromWindow =
		typeof window !== 'undefined' &&
		window.blockeraCompanionPlugin &&
		typeof window.blockeraCompanionPlugin === 'object'
			? window.blockeraCompanionPlugin
			: {};

	return applyFilters(
		'blockera.companionPlugin.config',
		{
			...DEFAULT_COMPANION_PLUGIN_CONFIG,
			...fromWindow,
		},
		'blockera/controls/feature-wrapper'
	);
}
