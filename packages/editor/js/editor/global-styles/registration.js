// @flow

/**
 * External dependencies
 */
import { dispatch, select, subscribe } from '@wordpress/data';

/**
 * Internal dependencies
 */
import { registerBlockStylesFromMetaData } from './block-styles-registry';
import { mergeBaseAndUserConfigs } from '@blockera/global-styles-ui';

/**
 * Initializes global styles once the data is available.
 * Subscribes to store changes and sets global styles when ready.
 */
const initializeGlobalStyles = (): void => {
	// Core store select function.
	const coreStore = select('core');
	// Blockera editor store dispatch function.
	const { setGlobalStyles } = dispatch('blockera/editor');

	// Track if we've already initialized
	let initialized = false;

	const tryInitialize = () => {
		if (initialized) {
			return true;
		}

		// Get global styles ID first
		const globalStylesId =
			coreStore.__experimentalGetCurrentGlobalStylesId();

		// If no ID yet, data isn't ready
		if (!globalStylesId) {
			return false;
		}

		// Get user global styles from core store.
		const userConfig = coreStore.getEditedEntityRecord(
			'root',
			'globalStyles',
			globalStylesId
		);

		// Check if userConfig is valid (not false/empty)
		if (!userConfig || !userConfig.styles) {
			return false;
		}

		// Get base global styles from core store.
		const baseConfig =
			coreStore.__experimentalGetCurrentThemeBaseGlobalStyles();

		// Merging base and user configurations.
		const globalStyles = mergeBaseAndUserConfigs(
			'object' === typeof baseConfig ? baseConfig : {},
			'object' === typeof userConfig ? userConfig : {}
		);

		// Setting global styles to the store.
		setGlobalStyles(globalStyles);

		initialized = true;
		return true;
	};

	// Try to initialize immediately
	if (tryInitialize()) {
		return;
	}

	// Subscribe to store changes and wait for data to be ready
	const unsubscribe: () => void = subscribe(() => {
		if (tryInitialize()) {
			unsubscribe();
		}
	});
};

/**
 * Main registration function for global styles system.
 * Orchestrates block style registration and plugin initialization.
 *
 * @param {Object} config - Configuration object
 * @param {string} config.screen - CSS selector for the screen element
 * @param {string} config.blocksButton - CSS selector for blocks button
 * @param {string} config.blockScreenListItem - CSS selector for block screen list item
 * @param {string} config.globalStylesScreen - CSS selector for global styles screen
 */
export const registration = (): void => {
	// Register block styles from metadata (handles reregistration, registration, and deregistration)
	registerBlockStylesFromMetaData();

	// Initialize global styles (handles async data loading)
	initializeGlobalStyles();
};
