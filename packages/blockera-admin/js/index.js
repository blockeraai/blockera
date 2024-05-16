// @flow

/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import { dispatch } from '@wordpress/data';
import domReady from '@wordpress/dom-ready';
import { createRoot } from '@wordpress/element';
import { store as coreDataStore } from '@wordpress/core-data';
import { registerCoreBlocks } from '@wordpress/block-library';

/**
 * Internal dependencies
 */
import { Dashboard } from './dashboard';

domReady(() => {
	registerCoreBlocks();
	const { addEntities } = dispatch(coreDataStore);

	// Adding entities into WordPress core data.
	addEntities([
		{
			label: __('Blockera Settings', 'blockera'),
			kind: 'blockera/v1',
			name: 'settings',
			baseURL: '/blockera/v1/settings',
		},
	]);

	const root = createRoot(
		document.getElementById('blockera-admin-settings-container')
	);

	root.render(<Dashboard />);
});
