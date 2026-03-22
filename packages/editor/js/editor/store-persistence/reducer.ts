/**
 * Internal dependencies
 */
import type { PersistenceLayer } from './persistence';

/**
 * Type definition for store state.
 */
export type StoreState = {
	secondarySidebarVisible: boolean;
	/** Session UI only (not persisted): mirrors WP complementary area for primary/settings sidebar. */
	primarySidebarOpen: boolean;
	primarySidebarWidth: string;
	secondarySidebarWidth: string;
	listViewHeight: string;
};

/**
 * Get default values from PHP.
 * Defaults are injected by PHP via window.blockeraEditorPersistenceDefaults.
 */
export function getDefaults(): StoreState {
	const base: StoreState = {
		secondarySidebarVisible: true,
		primarySidebarOpen: false,
		primarySidebarWidth: '300px',
		secondarySidebarWidth: '320px',
		listViewHeight: '50%',
	};
	const fromPhp = (window as any).blockeraEditorPersistenceDefaults as
		| Partial<StoreState>
		| undefined;

	if (!fromPhp) {
		return base;
	}

	return {
		...base,
		...fromPhp,
		// Never restore from PHP/meta; session mirror only.
		primarySidebarOpen: false,
	};
}

/**
 * Get initial state from preloaded data if available, otherwise use PHP defaults.
 * This prevents flash of incorrect state before persistence loads.
 */
function getInitialState(): StoreState {
	const defaults = getDefaults();

	// Check for preloaded data synchronously
	const preloadedData = (window as any).blockeraEditorPersistenceData as
		| (StoreState & { _modified?: string })
		| undefined;

	// Also check localStorage as fallback (in case preloaded data is stale)
	// Use user-specific key to avoid conflicts when multiple users share the same browser
	const userId = (window as any).blockeraEditorPersistenceUserId as
		| number
		| undefined;
	const localStorageKey = userId
		? `BLOCKERA_EDITOR_PERSISTENCE_RESTORE_${userId}`
		: 'BLOCKERA_EDITOR_PERSISTENCE_RESTORE';
	let localData: (StoreState & { _modified?: string }) | null = null;
	try {
		const stored = localStorage.getItem(localStorageKey);
		if (stored) {
			localData = JSON.parse(stored);
		}
	} catch (e) {
		// Ignore localStorage errors
	}

	// Compare timestamps to determine which is more recent
	const preloadedTimestamp = preloadedData?._modified
		? Date.parse(preloadedData._modified)
		: 0;
	const localTimestamp = localData?._modified
		? Date.parse(localData._modified)
		: 0;

	// Prefer the most recent data source
	let selectedData: (StoreState & { _modified?: string }) | undefined;
	if (
		localTimestamp > preloadedTimestamp &&
		localData &&
		Object.keys(localData).length > 0
	) {
		selectedData = localData;
	} else if (preloadedData && Object.keys(preloadedData).length > 0) {
		selectedData = preloadedData;
	}

	if (selectedData) {
		// Extract clean state (without _modified timestamp) and merge with defaults
		// Persisted data takes precedence over defaults
		const { _modified, ...cleanState } = selectedData as any;
		return {
			...defaults,
			...cleanState,
			primarySidebarOpen: false,
		} as StoreState;
	}

	// Return PHP defaults (no persisted data found)
	return defaults;
}

/**
 * Initial state for the editor store.
 * Uses preloaded data if available to avoid flash of incorrect state.
 */
const initialState: StoreState = getInitialState();

/**
 * Type definition for store actions.
 */
type StoreAction =
	| { type: 'SET_SECONDARY_SIDEBAR_VISIBLE'; visible?: boolean }
	| { type: 'TOGGLE_SECONDARY_SIDEBAR' }
	| { type: 'SET_PRIMARY_SIDEBAR_OPEN'; open: boolean }
	| { type: 'SET_PRIMARY_SIDEBAR_WIDTH'; width: string }
	| { type: 'SET_SECONDARY_SIDEBAR_WIDTH'; width: string }
	| { type: 'SET_LIST_VIEW_HEIGHT'; height: string }
	| {
			type: 'SET_PERSISTENCE_LAYER';
			persistenceLayer: PersistenceLayer<StoreState>;
			persistedData: StoreState & { _modified?: string };
	  };

/**
 * Base reducer for the editor store.
 *
 * @param {StoreState} state  Current state.
 * @param {StoreAction} action Action object.
 * @return {StoreState} Updated state.
 */
function baseReducer(
	state: StoreState = initialState,
	action: StoreAction
): StoreState {
	switch (action.type) {
		case 'SET_SECONDARY_SIDEBAR_VISIBLE':
			return {
				...state,
				secondarySidebarVisible:
					action.visible !== undefined ? action.visible : true,
			};
		case 'TOGGLE_SECONDARY_SIDEBAR':
			return {
				...state,
				secondarySidebarVisible: !state.secondarySidebarVisible,
			};
		case 'SET_PRIMARY_SIDEBAR_OPEN':
			return {
				...state,
				primarySidebarOpen: action.open,
			};
		case 'SET_PRIMARY_SIDEBAR_WIDTH':
			return {
				...state,
				primarySidebarWidth: action.width,
			};
		case 'SET_SECONDARY_SIDEBAR_WIDTH':
			return {
				...state,
				secondarySidebarWidth: action.width,
			};
		case 'SET_LIST_VIEW_HEIGHT':
			return {
				...state,
				listViewHeight: action.height,
			};
		case 'SET_PERSISTENCE_LAYER':
			// Merge persisted data with defaults to ensure all fields exist
			// Exclude _modified field from state (it's only for persistence layer)
			const { _modified, ...persistedStateData } = action.persistedData;
			const defaults = getDefaults();
			const mergedState = {
				...defaults,
				...persistedStateData,
			};
			return mergedState;
		default:
			return state;
	}
}

/**
 * Module-level persistence layer reference.
 * This ensures the persistence layer is accessible across all reducer calls.
 */
let persistenceLayer: PersistenceLayer<StoreState> | null = null;

/**
 * Sets the persistence layer (called during initialization).
 */
export function setPersistenceLayerReference(
	layer: PersistenceLayer<StoreState> | null
): void {
	persistenceLayer = layer;
}

/**
 * Higher-order reducer that adds persistence layer support.
 * Similar to WordPress preferences store persistence pattern.
 *
 * @param reducer The base reducer.
 * @return Enhanced reducer with persistence.
 */
function withPersistenceLayer(
	reducer: typeof baseReducer
): (state: StoreState | undefined, action: StoreAction) => StoreState {
	return (state: StoreState | undefined, action: StoreAction): StoreState => {
		// Always read from module-level variable (not closure variable)
		// Read fresh value each time (don't cache in closure)
		const currentPersistenceLayer = persistenceLayer;

		// Set up the persistence layer and return persisted data as state
		if (action.type === 'SET_PERSISTENCE_LAYER') {
			persistenceLayer = action.persistenceLayer;
			return reducer(state, action);
		}

		const nextState = reducer(state, action);

		// Save to persistence layer when state changes (except for persistence layer setup)
		// Use module-level variable, not closure variable
		// No need to check initialization flag - persistence is enabled AFTER initial state is set
		// primarySidebarOpen is session-only and must not be written to user meta.
		if (
			currentPersistenceLayer &&
			(action.type === 'SET_SECONDARY_SIDEBAR_VISIBLE' ||
				action.type === 'TOGGLE_SECONDARY_SIDEBAR' ||
				action.type === 'SET_PRIMARY_SIDEBAR_WIDTH' ||
				action.type === 'SET_SECONDARY_SIDEBAR_WIDTH' ||
				action.type === 'SET_LIST_VIEW_HEIGHT')
		) {
			const { primarySidebarOpen: _omit, ...persistable } = nextState;
			currentPersistenceLayer.set(persistable as StoreState);
		}

		return nextState;
	};
}

/**
 * Reducer with persistence layer support.
 */
const reducer = withPersistenceLayer(baseReducer);

export default reducer;
