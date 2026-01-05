/**
 * WordPress dependencies
 */
import apiFetch from '@wordpress/api-fetch';

/**
 * Type definition for the persistence layer.
 */
export interface PersistenceLayer<T> {
	get: () => Promise<T>;
	set: (value: T) => void;
}

/**
 * Debounces async functions to prevent rapid successive calls.
 * Similar to WordPress preferences persistence debounce logic.
 *
 * @param func    A function that returns a promise.
 * @param delayMS A delay in milliseconds.
 * @return A debounced function.
 */
function debounceAsync<T extends (...args: any[]) => Promise<any>>(
	func: T,
	delayMS: number
): T {
	let timeoutId: ReturnType<typeof setTimeout> | null = null;
	let activePromise: Promise<any> | null = null;

	return async function debounced(...args: Parameters<T>) {
		// Leading edge: if no promise or timeout in progress, call immediately
		if (!activePromise && !timeoutId) {
			return new Promise((resolve, reject) => {
				activePromise = func(...args)
					.then((...thenArgs) => {
						resolve(...thenArgs);
					})
					.catch((error) => {
						reject(error);
					})
					.finally(() => {
						activePromise = null;
					});
			});
		}

		if (activePromise) {
			// Wait for active promise to finish before queuing next request
			await activePromise;
		}

		// Clear any active timeouts, abandoning queued requests
		if (timeoutId) {
			clearTimeout(timeoutId);
			timeoutId = null;
		}

		// Schedule trailing edge call with delay
		return new Promise((resolve, reject) => {
			timeoutId = setTimeout(() => {
				activePromise = func(...args)
					.then((...thenArgs) => {
						resolve(...thenArgs);
					})
					.catch((error) => {
						reject(error);
					})
					.finally(() => {
						activePromise = null;
						timeoutId = null;
					});
			}, delayMS);
		});
	} as T;
}

/**
 * Creates a persistence layer that stores data in WordPress user meta via REST API.
 * Based on WordPress core preferences persistence implementation.
 *
 * @param options Configuration options.
 * @param options.preloadedData          Any persisted data that should be preloaded.
 * @param options.localStorageRestoreKey The key to use for localStorage backup.
 * @param options.metaKey                The user meta key to use (default: 'blockera_editor_persistence').
 * @param options.requestDebounceMS      Debounce time in milliseconds (default: 2500ms).
 * @return A persistence layer for WordPress user meta.
 */
export function createPersistenceLayer<T extends Record<string, any>>({
	preloadedData,
	localStorageRestoreKey = 'BLOCKERA_EDITOR_PERSISTENCE_RESTORE',
	metaKey = 'blockera_editor_persistence',
	requestDebounceMS = 2500,
}: {
	preloadedData?: T;
	localStorageRestoreKey?: string;
	metaKey?: string;
	requestDebounceMS?: number;
} = {}): PersistenceLayer<T> {
	let cache: T | undefined;
	const debouncedApiFetch = debounceAsync(apiFetch, requestDebounceMS);
	const localStorage = window.localStorage;

	// Get user ID from window (injected by PHP) to make localStorage user-specific
	const userId = (window as any).blockeraEditorPersistenceUserId as
		| number
		| undefined;
	const userSpecificKey = userId
		? `${localStorageRestoreKey}_${userId}`
		: localStorageRestoreKey;

	/**
	 * Gets persisted data from cache, server, or localStorage.
	 * Always tries to fetch from server to get the latest data, even if preloaded data exists.
	 */
	async function get(): Promise<T> {
		if (cache) {
			return cache;
		}

		try {
			// Fetch persistence data from custom REST API endpoint
			const serverData = (await apiFetch({
				path: '/blockera/v1/editor-persistence',
			})) as T | null;
			const localData = JSON.parse(
				localStorage.getItem(userSpecificKey) || 'null'
			);

			// Compare timestamps to determine which data is more recent
			// Compare server data, preloaded data, and localStorage data
			const serverTimestamp = Date.parse(serverData?._modified) || 0;
			const preloadedTimestamp =
				Date.parse(preloadedData?._modified) || 0;
			const localTimestamp = Date.parse(localData?._modified) || 0;

			// Find the most recent data source
			const maxTimestamp = Math.max(
				serverTimestamp,
				preloadedTimestamp,
				localTimestamp
			);

			// Prefer server data if it exists and is most recent
			// Otherwise prefer preloaded data if it's most recent
			// Otherwise fallback to localStorage data
			// Otherwise use empty object
			if (serverData && serverTimestamp === maxTimestamp) {
				cache = serverData as T;
			} else if (preloadedData && preloadedTimestamp === maxTimestamp) {
				cache = preloadedData as T;
			} else if (localData && localTimestamp === maxTimestamp) {
				cache = localData as T;
			} else if (preloadedData) {
				// Fallback to preloaded data if no timestamps match
				cache = preloadedData as T;
			} else if (localData) {
				// Fallback to localStorage if no preloaded data
				cache = localData as T;
			} else {
				cache = {} as T;
			}

			return cache;
		} catch (error) {
			// If API fails, try localStorage
			const localData = JSON.parse(
				localStorage.getItem(userSpecificKey) || 'null'
			);
			cache = localData || ({} as T);
			return cache;
		}
	}

	/**
	 * Saves data to both localStorage (backup) and database (via REST API).
	 */
	function set(newData: T): void {
		const dataWithTimestamp = {
			...newData,
			_modified: new Date().toISOString(),
		};
		cache = dataWithTimestamp;

		// Store in localStorage as fallback (user-specific key)
		// If API request fails, this data can restore preferences
		try {
			localStorage.setItem(
				userSpecificKey,
				JSON.stringify(dataWithTimestamp)
			);
		} catch (error) {
			// Ignore localStorage errors
		}

		// Save to database via custom REST API endpoint
		// Debounced to prevent rapid successive requests
		// keepalive ensures request completes even during page unload
		const requestData = {
			data: dataWithTimestamp,
		};

		debouncedApiFetch({
			path: '/blockera/v1/editor-persistence',
			method: 'POST',
			keepalive: true,
			data: requestData,
		}).catch(() => {
			// Silently fail - localStorage backup is available
		});
	}

	return {
		get,
		set,
	};
}
