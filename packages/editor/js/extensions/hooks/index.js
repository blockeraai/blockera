// @flow
/**
 * External dependencies
 */
import apiFetch from '@wordpress/api-fetch';
import { addFilter, applyFilters } from '@wordpress/hooks';

/**
 * Internal dependencies
 */
import withBlockSettings from './block-settings';
import {
	initHideCoreLayoutToolbar,
	initHideCoreLayoutToolbarDom,
} from '../libs/layout/hide-core-layout-toolbar';

export default function applyHooks(beforeApplyHooks: () => void) {
	addFilter(
		'blocks.registerBlockType',
		'blockera.editor.extensions.withAdvancedControlsAttributes',
		(settings: Object, name: Object): Object =>
			withBlockSettings(settings, name, {
				currentUser: applyFilters(
					'blockera.editor.extensions.currentUser',
					{
						roles: ['administrator'],
					}
				),
				allowedUsers: applyFilters(
					'blockera.editor.extensions.hooks.withBlockSettings.allowedUsers',
					[]
				),
				unsupportedBlocks: applyFilters(
					'blockera.editor.extensions.hooks.withBlockSettings.disabledBlocks',
					[]
				),
				allowedPostTypes: applyFilters(
					'blockera.editor.extensions.hooks.withBlockSettings.allowedPostTypes',
					[]
				),
			}),
		9e2
	);

	initHideCoreLayoutToolbar();

	if ('function' === typeof beforeApplyHooks) {
		beforeApplyHooks();
	}

	initHideCoreLayoutToolbarDom();

	// Filter out blockera attributes from block renderer requests.
	apiFetch.use((options, next) => {
		if (options.path && options.path.includes('/wp/v2/block-renderer/')) {
			// Parse and filter attributes
			const url = new URL(options.path, window.location.origin);

			// Get all search params that start with 'attributes[blockera'
			const paramsToDelete = [];
			url.searchParams.forEach((value, key) => {
				if (key.startsWith('attributes[blockera')) {
					paramsToDelete.push(key);
				}
			});

			// Remove blockera attributes
			if (paramsToDelete.length > 0) {
				paramsToDelete.forEach((key) => {
					url.searchParams.delete(key);
				});

				return next({
					...options,
					path: url.pathname + url.search,
				});
			}
		}

		return next(options);
	});
}
export { default as withBlockSettings } from './block-settings';
