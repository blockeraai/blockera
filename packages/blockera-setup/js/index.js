// @flow

/**
 * External dependencies
 */
import { addFilter } from '@wordpress/hooks';

/**
 * Blockera dependencies
 */
import { applyHooks } from '@blockera/editor-extensions';
import { initializer } from '@blockera/bootstrap';

/**
 * Initialize blockera react application.
 */
addFilter('blockera.core.bootstrap', 'blockera.bootstrap', () => applyHooks);

initializer();
