/**
 * WordPress dependencies
 */
import { createReduxStore, register, dispatch } from '@wordpress/data';

/**
 * Internal dependencies
 */
import reducer, { getDefaults } from './reducer';
import * as selectors from './selectors';
import * as actions from './actions';
import { STORE_NAME } from './constants';
import { createPersistenceLayer } from './persistence';
import type { StoreState } from './reducer';

/**
 * Store definition for the editor persistence state.
 *
 * @see https://github.com/WordPress/gutenberg/blob/HEAD/packages/data/README.md#createReduxStore
 */
export const store = createReduxStore(STORE_NAME, {
	reducer,
	selectors,
	actions,
});

register(store);

// Note: The reducer now uses preloaded data for initial state automatically,
// so no synchronous dispatch is needed here. The store will start with the correct state.

/**
 * Initialize persistence layer for the store.
 * This loads persisted data from the database and sets up automatic saving.
 * Similar to WordPress preferences store initialization pattern.
 */
async function initializePersistence() {
	// Get defaults from PHP (always available)
	const defaults = getDefaults();

	// Get preloaded data from PHP (if available)
	// WordPress passes this via wp_add_inline_script
	const preloadedData = (window as any).blockeraEditorPersistenceData as
		StoreState | undefined;

	// Create persistence layer
	const persistenceLayer = createPersistenceLayer<StoreState>({
		preloadedData,
		metaKey: 'blockera_editor_persistence',
		requestDebounceMS: 2500,
	});

	// Load persisted data (will use preloaded data if available, otherwise fetch from API)
	const persistedData = await persistenceLayer.get();

	// Extract persisted state (without _modified timestamp)
	const { _modified, ...persistedStateData } = persistedData as any;

	const reducerModule = await import('./reducer');

	// Merge defaults with persisted data
	// Persisted data takes precedence over defaults
	// This ensures all fields exist (from defaults) but persisted values override them
	const mergedState: StoreState = {
		...defaults,
		...persistedStateData,
		primarySidebarOpen: false,
	};

	// Set the initial state FIRST (before enabling persistence)
	// This way, the initial state setting won't trigger a save
	// Always update state with merged values (persisted values override defaults)
	if (typeof mergedState.secondarySidebarOpen === 'boolean') {
		(dispatch(STORE_NAME) as typeof actions).setSecondarySidebarOpen(
			mergedState.secondarySidebarOpen
		);
	}
	if (typeof mergedState.primarySidebarWidth === 'string') {
		(dispatch(STORE_NAME) as typeof actions).setPrimarySidebarWidth(
			mergedState.primarySidebarWidth
		);
	}
	if (typeof mergedState.secondarySidebarWidth === 'string') {
		(dispatch(STORE_NAME) as typeof actions).setSecondarySidebarWidth(
			mergedState.secondarySidebarWidth
		);
	}
	if (typeof mergedState.listViewHeight === 'string') {
		(dispatch(STORE_NAME) as typeof actions).setListViewHeight(
			mergedState.listViewHeight
		);
	}

	// NOW enable persistence - all subsequent actions will be saved
	reducerModule.setPersistenceLayerReference(persistenceLayer);
}

// Initialize persistence asynchronously after store registration
// Use requestIdleCallback if available, otherwise setTimeout
if (typeof requestIdleCallback !== 'undefined') {
	requestIdleCallback(() => {
		initializePersistence().catch(() => {
			// Silently fail - store will use default state
		});
	});
} else {
	setTimeout(() => {
		initializePersistence().catch(() => {
			// Silently fail - store will use default state
		});
	}, 0);
}
