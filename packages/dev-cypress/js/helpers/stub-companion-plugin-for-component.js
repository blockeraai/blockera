/**
 * Component-test helper: stub companion as installed for repeater Pro flows.
 *
 * CT does not load `packages/blockera/js/index.js`, so without this stub
 * `isRepeaterCompanionGateActive` opens the companion install modal instead of
 * the Pro UpgradePrompt / allowing multi-item add+clone.
 *
 * Use only in repeater-related component specs — do not register globally.
 */

/**
 * External dependencies
 */
import { addFilter, removeFilter } from '@wordpress/hooks';

export const COMPANION_PLUGIN_CT_FILTER_NAMESPACE =
	'blockera-ct/repeater.isCompanionPlugin';

/**
 * Register the companion-installed filter (idempotent for the CT namespace).
 */
export function stubCompanionPluginInstalledForComponentTests() {
	removeFilter(
		'blockera.products.isCompanionPlugin',
		COMPANION_PLUGIN_CT_FILTER_NAMESPACE
	);
	addFilter(
		'blockera.products.isCompanionPlugin',
		COMPANION_PLUGIN_CT_FILTER_NAMESPACE,
		() => true,
		10
	);
}

/**
 * Remove the CT companion stub filter.
 */
export function unstubCompanionPluginInstalledForComponentTests() {
	removeFilter(
		'blockera.products.isCompanionPlugin',
		COMPANION_PLUGIN_CT_FILTER_NAMESPACE
	);
}

/**
 * Mocha hooks: companion installed for the current describe scope.
 */
export function useCompanionPluginInstalledForComponentTests() {
	before(() => {
		stubCompanionPluginInstalledForComponentTests();
	});

	after(() => {
		unstubCompanionPluginInstalledForComponentTests();
	});
}
