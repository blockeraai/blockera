// @flow

/**
 * External dependencies
 */
import { addFilter } from '@wordpress/hooks';

/**
 * Blockera dependencies
 */
import { applyHooks, defineGlobalProps } from '@blockera/editor-extensions';
import { initializer } from '@blockera/bootstrap';

/**
 * Initialize blockera react application.
 */
addFilter('blockera.bootstrapper', 'blockera.bootstrap', () => {
	defineGlobalProps();

	applyHooks();
});

initializer();
