/**
 * WordPress dependencies
 */
import { useState, useCallback } from '@wordpress/element';

/**
 * Blockera dependencies
 */
import { localStorage } from '@blockera/storage';

/**
 * Internal dependencies
 */
import {
	PERSISTENCE_STORAGE_KEY,
	RECENTLY_CLOSED_PERSISTENCE_KEY,
	TABS_STORAGE_KEY,
	RECENTLY_CLOSED_STORAGE_KEY,
	TAB_ICONS_ENABLED_KEY,
	ICON_ONLY_PINNED_TABS_KEY,
} from '../utils/storageKeys';

/**
 * Load persistence setting from localStorage
 *
 * @param key - Logical (unscoped) storage key
 * @param defaultValue - Default value if not stored (default: true)
 * @return Stored value or default
 */
function loadPersistenceFromStorage(
	key: string,
	defaultValue: boolean = true
): boolean {
	try {
		const stored = localStorage.getJSON(key);
		if (stored !== null) {
			return stored as boolean;
		}
	} catch {
		// Invalid data in localStorage, use default
	}
	return defaultValue;
}

/**
 * Save persistence setting to localStorage
 *
 * @param key - Logical (unscoped) storage key
 * @param enabled - Whether persistence is enabled
 */
function savePersistenceToStorage(key: string, enabled: boolean): void {
	try {
		localStorage.setJSON(key, enabled);
	} catch {
		// localStorage might be full or disabled, ignore
	}
}

/**
 * Clear data from localStorage
 *
 * @param key - Logical (unscoped) storage key
 */
function clearFromStorage(key: string): void {
	try {
		localStorage.removeItem(key);
	} catch {
		// localStorage might be disabled, ignore
	}
}

/**
 * Return type for useTabsPersistence hook.
 */
export interface UseTabsPersistenceReturn {
	/** Whether tab persistence is enabled. */
	isPersistenceEnabled: boolean;
	/** Toggle tabs persistence setting. */
	togglePersistence: () => void;
	/** Whether recently closed persistence is enabled. */
	isRecentlyClosedPersistenceEnabled: boolean;
	/** Toggle recently closed tabs persistence setting. */
	toggleRecentlyClosedPersistence: () => void;
	/** Whether tab icons are enabled. */
	isTabIconsEnabled: boolean;
	/** Toggle tab icons visibility setting. */
	toggleTabIcons: () => void;
	/** Whether icon-only mode for pinned tabs is enabled. */
	isIconOnlyPinnedTabsEnabled: boolean;
	/** Toggle icon-only mode for pinned tabs. */
	toggleIconOnlyPinnedTabs: () => void;
}

/**
 * Hook to manage tabs persistence settings
 *
 * Controls whether tabs and recently closed tabs are saved to localStorage
 * and persist across page refreshes.
 * Default: both enabled
 *
 * @return Persistence state and management functions
 */
export function useTabsPersistence(): UseTabsPersistenceReturn {
	const [isPersistenceEnabled, setIsPersistenceEnabled] = useState(() => {
		return loadPersistenceFromStorage(PERSISTENCE_STORAGE_KEY);
	});

	const [
		isRecentlyClosedPersistenceEnabled,
		setIsRecentlyClosedPersistenceEnabled,
	] = useState(() => {
		return loadPersistenceFromStorage(RECENTLY_CLOSED_PERSISTENCE_KEY);
	});

	const [isTabIconsEnabled, setIsTabIconsEnabled] = useState(() => {
		return loadPersistenceFromStorage(TAB_ICONS_ENABLED_KEY);
	});

	// Icon-only pinned tabs: disabled by default
	const [isIconOnlyPinnedTabsEnabled, setIsIconOnlyPinnedTabsEnabled] =
		useState(() => {
			return loadPersistenceFromStorage(ICON_ONLY_PINNED_TABS_KEY, false);
		});

	/**
	 * Toggle tabs persistence setting
	 * When disabled: clears all tabs from localStorage immediately
	 */
	const togglePersistence = useCallback((): void => {
		setIsPersistenceEnabled((prev) => {
			const newValue = !prev;
			savePersistenceToStorage(PERSISTENCE_STORAGE_KEY, newValue);

			// When disabling persistence, clear tabs from storage immediately
			if (!newValue) {
				clearFromStorage(TABS_STORAGE_KEY);
			}

			return newValue;
		});
	}, []);

	/**
	 * Toggle recently closed tabs persistence setting
	 * When disabled: clears recently closed tabs from localStorage immediately
	 */
	const toggleRecentlyClosedPersistence = useCallback((): void => {
		setIsRecentlyClosedPersistenceEnabled((prev) => {
			const newValue = !prev;
			savePersistenceToStorage(RECENTLY_CLOSED_PERSISTENCE_KEY, newValue);

			// When disabling persistence, clear recently closed tabs from storage immediately
			if (!newValue) {
				clearFromStorage(RECENTLY_CLOSED_STORAGE_KEY);
			}

			return newValue;
		});
	}, []);

	/**
	 * Toggle tab icons visibility setting
	 */
	const toggleTabIcons = useCallback((): void => {
		setIsTabIconsEnabled((prev) => {
			const newValue = !prev;
			savePersistenceToStorage(TAB_ICONS_ENABLED_KEY, newValue);
			return newValue;
		});
	}, []);

	/**
	 * Toggle icon-only mode for pinned tabs
	 * When enabled: pinned tabs show only their icon (hides title)
	 */
	const toggleIconOnlyPinnedTabs = useCallback((): void => {
		setIsIconOnlyPinnedTabsEnabled((prev) => {
			const newValue = !prev;
			savePersistenceToStorage(ICON_ONLY_PINNED_TABS_KEY, newValue);
			return newValue;
		});
	}, []);

	return {
		isPersistenceEnabled,
		togglePersistence,
		isRecentlyClosedPersistenceEnabled,
		toggleRecentlyClosedPersistence,
		isTabIconsEnabled,
		toggleTabIcons,
		isIconOnlyPinnedTabsEnabled,
		toggleIconOnlyPinnedTabs,
	};
}
