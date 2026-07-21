// @flow
/* eslint-disable no-restricted-globals -- This module is the only allowed localStorage/sessionStorage access. */

/**
 * Site-scoped browser storage for Blockera.
 *
 * Prefer these APIs over native `localStorage` / `sessionStorage`.
 * Keys are logical (unscoped); site + user scoping is applied internally.
 *
 * Format (must match PHP `blockera_get_scoped_storage_key`):
 * `{baseKey}__{siteKey}_u{userId}`
 */

type StorageBackend = {
	getItem(key: string): ?string,
	setItem(key: string, value: string): void,
	removeItem(key: string): void,
	key(index: number): ?string,
	length: number,
};

/**
 * Resolve site + user scoped browser storage key.
 *
 * @param {string} baseKey Logical (unscoped) storage key.
 * @return {string} Scoped storage key.
 */
export const getStorageKey = (baseKey: string): string => {
	const win: any = typeof window !== 'undefined' ? window : {};
	const siteKey = win.blockeraStorageSiteKey
		? String(win.blockeraStorageSiteKey)
		: '0';
	const userId =
		win.blockeraStorageUserId !== undefined &&
		win.blockeraStorageUserId !== null
			? Number(win.blockeraStorageUserId)
			: 0;

	return `${baseKey}__${siteKey}_u${userId}`;
};

/**
 * Current site/user suffix used for matching versioned cache keys.
 *
 * @return {string} Suffix including leading `__`.
 */
const getStorageKeySuffix = (): string => {
	const win: any = typeof window !== 'undefined' ? window : {};
	const siteKey = win.blockeraStorageSiteKey
		? String(win.blockeraStorageSiteKey)
		: '0';
	const userId =
		win.blockeraStorageUserId !== undefined &&
		win.blockeraStorageUserId !== null
			? Number(win.blockeraStorageUserId)
			: 0;

	return `__${siteKey}_u${userId}`;
};

/**
 * Safely read the native storage backend.
 *
 * @param {'localStorage' | 'sessionStorage'} name Backend name.
 * @return {?StorageBackend} Native storage backend, or null if unavailable.
 */
const getBackend = (
	name: 'localStorage' | 'sessionStorage'
): ?StorageBackend => {
	try {
		if (typeof window === 'undefined') {
			return null;
		}
		return window[name] || null;
	} catch {
		return null;
	}
};

/**
 * Create a Storage-like API that auto-scopes keys for a backend.
 *
 * @param {'localStorage' | 'sessionStorage'} backendName
 * @return {Object} Scoped storage API.
 */
const createScopedStorage = (
	backendName: 'localStorage' | 'sessionStorage'
) => {
	/**
	 * Read a string value (mirrors Storage.getItem).
	 *
	 * @param {string} key Logical key.
	 * @return {?string} Stored string, or null when missing.
	 */
	const getItem = (key: string): ?string => {
		try {
			const backend = getBackend(backendName);
			if (!backend) {
				return null;
			}
			return backend.getItem(getStorageKey(key));
		} catch (error) {
			/* @debug-ignore */
			console.error(`Failed to get from ${backendName}`, error);
			return null;
		}
	};

	/**
	 * Write a string value (mirrors Storage.setItem).
	 *
	 * @param {string} key Logical key.
	 * @param {string} value String value.
	 * @return {void}
	 */
	const setItem = (key: string, value: string): void => {
		try {
			const backend = getBackend(backendName);
			if (!backend) {
				return;
			}
			backend.setItem(getStorageKey(key), String(value));
		} catch (error) {
			/* @debug-ignore */
			console.error(`Failed to save in ${backendName}`, error);
		}
	};

	/**
	 * Remove a key (mirrors Storage.removeItem).
	 *
	 * @param {string} key Logical key.
	 * @return {void}
	 */
	const removeItem = (key: string): void => {
		try {
			const backend = getBackend(backendName);
			if (!backend) {
				return;
			}
			backend.removeItem(getStorageKey(key));
		} catch (error) {
			/* @debug-ignore */
			console.error(`Failed to delete from ${backendName}`, error);
		}
	};

	/**
	 * Read and JSON-parse a value. Returns null when missing or invalid.
	 *
	 * @param {string} key Logical key.
	 * @return {any} Parsed value, or null when missing/invalid.
	 */
	const getJSON = (key: string): any => {
		try {
			const value = getItem(key);
			return value ? JSON.parse(value) : null;
		} catch (error) {
			/* @debug-ignore */
			console.error(`Failed to get JSON from ${backendName}`, error);
			return null;
		}
	};

	/**
	 * JSON-stringify and write a value.
	 *
	 * @param {string} key Logical key.
	 * @param {any} value Serializable value.
	 * @return {void}
	 */
	const setJSON = (key: string, value: any): void => {
		try {
			setItem(key, JSON.stringify(value));
		} catch (error) {
			/* @debug-ignore */
			console.error(`Failed to save JSON in ${backendName}`, error);
		}
	};

	/**
	 * Shallow-merge an object into an existing JSON value.
	 *
	 * @param {string} key Logical key.
	 * @param {any} updatedValue Partial object to merge.
	 * @return {any} New value, or null if nothing was stored.
	 */
	const updateJSON = (key: string, updatedValue: any): any => {
		try {
			const currentValue = getJSON(key);
			if (currentValue !== null && typeof currentValue === 'object') {
				const newValue = { ...currentValue, ...updatedValue };
				setJSON(key, newValue);
				return newValue;
			}
			return null;
		} catch (error) {
			/* @debug-ignore */
			console.error(`Failed to update JSON in ${backendName}`, error);
			return null;
		}
	};

	/**
	 * Remove previous versioned cache keys for the current site/user.
	 *
	 * @param {string} cacheKey Logical base key for the current cache version.
	 * @param {string} startsWith Logical prefix shared by versioned keys.
	 * @return {void}
	 */
	const freshItem = (cacheKey: string, startsWith: string): void => {
		const backend = getBackend(backendName);
		if (!backend) {
			return;
		}

		const scopedCacheKey = getStorageKey(cacheKey);
		const suffix = getStorageKeySuffix();
		const keysToRemove = [];

		for (let i = 0, n = backend.length; i < n; i++) {
			const key = backend.key(i);
			if (
				key &&
				key.startsWith(startsWith) &&
				key.endsWith(suffix) &&
				key !== scopedCacheKey
			) {
				keysToRemove.push(key);
			}
		}

		keysToRemove.forEach((key) => {
			try {
				backend.removeItem(key);
			} catch (error) {
				/* @debug-ignore */
				console.error(`Failed to delete from ${backendName}`, error);
			}
		});
	};

	return {
		getItem,
		setItem,
		removeItem,
		getJSON,
		setJSON,
		updateJSON,
		freshItem,
	};
};

/**
 * Site-scoped localStorage API (mirrors Storage for common methods + JSON helpers).
 */
export const localStorage = createScopedStorage('localStorage');

/**
 * Site-scoped sessionStorage API (mirrors Storage for common methods).
 */
export const sessionStorage = createScopedStorage('sessionStorage');
