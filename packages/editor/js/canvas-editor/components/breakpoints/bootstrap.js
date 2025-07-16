// @flow

/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import domReady from '@wordpress/dom-ready';
import { dispatch } from '@wordpress/data';
import { store as coreDataStore } from '@wordpress/core-data';

export const bootstrapBreakpoints = (): void | Object => {
	domReady(() => {
		const { addEntities } = dispatch(coreDataStore);

		// Adding entities into WordPress core data.
		addEntities([
			{
				label: __('Blockera Users Settings', 'blockera'),
				kind: 'blockera/v1',
				name: 'users',
				baseURL: '/blockera/v1/users',
			},
		]);
	});
};
