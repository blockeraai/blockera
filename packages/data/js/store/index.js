// @flow

/**
 * External dependencies
 */
import { createReduxStore, register } from '@wordpress/data';

/**
 * Internal dependencies
 */
import reducer from './reducers';
import * as actions from './actions';
import { STORE_NAME } from './constants';
import * as selectors from './selectors';
import * as resolvers from './resolvers';

const storeConfig = () => ({
	reducer,
	actions,
	selectors,
	resolvers,
});

/**
 * Store definition for the code data namespace.
 *
 * @see https://github.com/WordPress/gutenberg/blob/HEAD/packages/data/README.md#createReduxStore
 */
export const store: Object = createReduxStore(STORE_NAME, storeConfig());

register(store);

export * from './actions';
export * from './constants';
export * from './selectors';
