// @flow

/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import { dispatch } from '@wordpress/data';
import domReady from '@wordpress/dom-ready';
import { createRoot } from '@wordpress/element';
import { addFilter, applyFilters } from '@wordpress/hooks';
import { store as coreDataStore } from '@wordpress/core-data';
import { registerCoreBlocks } from '@wordpress/block-library';

/**
 * Blockera dependencies
 */
import { noop } from '@blockera/utils';
import { initializer } from '@blockera/bootstrap';
import { LoadingComponent } from '@blockera/controls';
import { unstableBootstrapServerSideEntities } from '@blockera/data';

/**
 * Internal dependencies
 */
import { Dashboard } from './dashboard';

const root = createRoot(
	document.getElementById('blockera-admin-settings-container')
);

root.render(<LoadingComponent />);

const initializeBlockeraAdmin = (): void => {
	domReady(() => {
		applyFilters('blockera.admin.before.bootstrap', noop)();

		registerCoreBlocks();
		const { addEntities } = dispatch(coreDataStore);
		const { unstableBlockeraBootstrapServerSideEntities } = window;

		unstableBootstrapServerSideEntities(
			unstableBlockeraBootstrapServerSideEntities
		);

		// Adding entities into WordPress core data.
		addEntities([
			{
				label: __('Blockera Settings', 'blockera'),
				kind: 'blockera/v1',
				name: 'settings',
				baseURL: '/blockera/v1/settings',
			},
		]);

		root.render(<Dashboard />);
	});
};

/**
 * Initialize blockera react application.
 */
addFilter(
	'blockera.bootstrapper',
	'blockera.bootstrap',
	initializeBlockeraAdmin
);

initializer();
