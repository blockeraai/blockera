/**
 * WordPress dependencies
 */
import { createReduxStore, register } from '@wordpress/data';

/**
 * Internal dependencies
 */
import reducer from './reducers';
import * as actions from './actions';
// import * as selectors from './selectors';
import { STORE_NAME } from './constants';

/**
 * Store definition for the repeater control namespace.
 *
 * @see https://github.com/WordPress/gutenberg/blob/HEAD/packages/data/README.md#createReduxStore
 *
 * @type {Object}
 */
export const store = createReduxStore(STORE_NAME, {
	reducer,
	// selectors,
	actions,
});

register(store);

export { reducer, actions };
