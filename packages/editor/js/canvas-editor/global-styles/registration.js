// @flow

/**
 * External dependencies
 */
import { dispatch } from '@wordpress/data';

/**
 * Internal dependencies
 */
import { registerBlockStylesFromMetaData } from './block-styles-registry';
import {
	registerNavigationPlugin,
	registerPanelActivatorObserverPlugin,
	registerAdditionalCssContextmenuObserverPlugin,
	registerSidebarListenersPlugin,
	registerStyleBookListenersPlugin,
	registerPanelScreenPlugin,
	registerGlobalStylesOutputPlugin,
} from './plugins';

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
export const registration = ({
	screen,
	blocksButton,
	blockScreenListItem,
	globalStylesScreen,
}: {
	screen: string,
	blocksButton: string,
	blockScreenListItem: string,
	globalStylesScreen: string,
}): void => {
	// Get dispatch function for updating style variation blocks in store
	const { setStyleVariationBlocks } = dispatch('blockera/editor');

	// Register block styles from metadata (handles reregistration, registration, and unregistration)
	registerBlockStylesFromMetaData(setStyleVariationBlocks);

	// Register all plugins
	registerNavigationPlugin();
	registerPanelActivatorObserverPlugin(screen);
	registerAdditionalCssContextmenuObserverPlugin(screen);
	registerSidebarListenersPlugin();
	registerStyleBookListenersPlugin();
	registerPanelScreenPlugin(
		screen,
		blocksButton,
		globalStylesScreen,
		blockScreenListItem
	);
	registerGlobalStylesOutputPlugin();
};
