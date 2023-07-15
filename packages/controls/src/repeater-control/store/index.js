/**
 * WordPress dependencies
 */
import { createReduxStore, register } from '@wordpress/data';

/**
 * Internal dependencies
 */
import reducer from './reducers';
import * as actions from './actions';
import { STORE_NAME } from './constants';
import * as selectors from './selectors';

/**
 * Store definition for the repeater control namespace.
 *
 * @see https://github.com/WordPress/gutenberg/blob/HEAD/packages/data/README.md#createReduxStore
 *
 * @type {Object}
 */
export const store = createReduxStore(STORE_NAME, {
	reducer,
	selectors,
	actions,
});

register(store);

export { reducer, selectors, actions, STORE_NAME };
