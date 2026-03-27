/**
 * WordPress dependencies
 */
import {
	useState,
	useCallback,
	useEffect,
	useRef,
	useMemo,
} from '@wordpress/element';

/**
 * Internal dependencies
 */
import { RECENTLY_CLOSED_STORAGE_KEY } from '../utils/storageKeys';
import { resolveTabsConfig } from '../utils';
import { MAIN_WORKSPACE_ID } from './useTabs';
import type {
	Tab,
	RecentlyClosedTab,
	RecentlyClosedTabsStorage,
} from '../types';

/**
 * Load recently closed tabs from localStorage
 *
 * @return Array of recently closed tabs for the main workspace or empty array
 */
function loadFromStorage(maxRecentlyClosedTabs: number): RecentlyClosedTab[] {
	try {
		const stored = localStorage.getItem(RECENTLY_CLOSED_STORAGE_KEY);
		if (stored) {
			const parsed = JSON.parse(stored);

			// Workspace structure: { "main": [...] }
			if (
				parsed &&
				typeof parsed === 'object' &&
				!Array.isArray(parsed)
			) {
				if (parsed[MAIN_WORKSPACE_ID]) {
					const workspaceTabs = parsed[
						MAIN_WORKSPACE_ID
					] as RecentlyClosedTab[];
					// Ensure it's an array and limit to max tabs
					return Array.isArray(workspaceTabs)
						? workspaceTabs.slice(0, maxRecentlyClosedTabs)
						: [];
				}
			}
		}
	} catch {
		// Invalid data in localStorage, ignore
	}
	return [];
}

/**
 * Save recently closed tabs to localStorage in workspace structure
 *
 * @param tabs - Array of tabs to save for the main workspace
 */
function saveToStorage(
	tabs: RecentlyClosedTab[],
	maxRecentlyClosedTabs: number
): void;
/**
 * Save recently closed tabs to localStorage in workspace structure
 *
 * @param storage - Storage object with workspace structure
 */
function saveToStorage(
	storage: RecentlyClosedTabsStorage,
	maxRecentlyClosedTabs: number
): void;
function saveToStorage(
	tabsOrStorage: RecentlyClosedTab[] | RecentlyClosedTabsStorage,
	maxRecentlyClosedTabs: number
): void {
	try {
		let storage: RecentlyClosedTabsStorage;

		// Handle both function overloads
		if (Array.isArray(tabsOrStorage)) {
			// Array of tabs: create workspace structure
			const limitedTabs = tabsOrStorage.slice(0, maxRecentlyClosedTabs);
			storage = {
				[MAIN_WORKSPACE_ID]: limitedTabs,
			};
		} else {
			// Already a storage object: limit tabs in main workspace
			storage = {
				...tabsOrStorage,
				[MAIN_WORKSPACE_ID]: (
					tabsOrStorage[MAIN_WORKSPACE_ID] || []
				).slice(0, maxRecentlyClosedTabs),
			};
		}

		localStorage.setItem(
			RECENTLY_CLOSED_STORAGE_KEY,
			JSON.stringify(storage)
		);
	} catch {
		// localStorage might be full or disabled, ignore
	}
}

/**
 * Clear recently closed tabs from localStorage
 */
export function clearRecentlyClosedFromStorage(): void {
	try {
		localStorage.removeItem(RECENTLY_CLOSED_STORAGE_KEY);
	} catch {
		// localStorage might be disabled, ignore
	}
}

/**
 * Options for useRecentlyClosedTabs hook.
 */
export interface UseRecentlyClosedTabsOptions {
	/** Whether to save to localStorage (default: true). */
	persistenceEnabled?: boolean;
}

/**
 * Return type for useRecentlyClosedTabs hook.
 */
export interface UseRecentlyClosedTabsReturn {
	/** Array of recently closed tabs. */
	recentlyClosedTabs: RecentlyClosedTab[];
	/** Add a closed tab to the list. */
	addClosedTab: (tab: Tab) => void;
	/** Reopen a tab from the recently closed list. */
	reopenTab: (tabKey: string) => RecentlyClosedTab | null;
	/** Remove a tab from the recently closed list. */
	removeClosedTab: (tabKey: string) => void;
	/** Clear all recently closed tabs. */
	clearRecentlyClosedTabs: () => void;
	/** Update a closed tab's data (title, status, slug) when entity changes. */
	updateClosedTab: (
		tabKey: string,
		updates: Partial<Pick<Tab, 'title' | 'status' | 'slug'>>
	) => void;
}

/**
 * Hook to manage recently closed tabs
 *
 * Stores closed tabs in memory, and optionally persists to localStorage.
 * Tabs are stored in most-recently-closed order (newest first).
 * Limited using tabs config limits.
 *
 * @param options - Options object
 * @return Recently closed tabs state and management functions
 */
export function useRecentlyClosedTabs({
	persistenceEnabled = true,
}: UseRecentlyClosedTabsOptions = {}): UseRecentlyClosedTabsReturn {
	const recentlyClosedLimit = useMemo(
		() => resolveTabsConfig().limits.recentlyClosed,
		[]
	);

	// Initialize from localStorage if persistence is enabled
	const [recentlyClosedTabs, setRecentlyClosedTabs] = useState<
		RecentlyClosedTab[]
	>(() => {
		if (persistenceEnabled) {
			return loadFromStorage(recentlyClosedLimit);
		}
		return [];
	});

	// Track persistence state in a ref for use in callbacks
	const persistenceEnabledRef = useRef(persistenceEnabled);
	persistenceEnabledRef.current = persistenceEnabled;

	// Track current tabs in a ref for synchronous access
	const recentlyClosedTabsRef = useRef(recentlyClosedTabs);
	recentlyClosedTabsRef.current = recentlyClosedTabs;

	// Save to localStorage whenever tabs change (only if persistence is enabled)
	useEffect(() => {
		if (persistenceEnabled) {
			saveToStorage(recentlyClosedTabs, recentlyClosedLimit);
		}
	}, [recentlyClosedTabs, persistenceEnabled, recentlyClosedLimit]);

	/**
	 * Add a closed tab to the list
	 * Prepends to the beginning (most recent first)
	 * Adds a closedAt timestamp for displaying "time ago"
	 * Limits to the configured recently closed tabs cap.
	 *
	 * The tab.title property already contains the correct cached title.
	 *
	 * @param tab - Tab object to add
	 */
	const addClosedTab = useCallback(
		(tab: Tab): void => {
			if (!tab?.key) {
				return;
			}

			// Add timestamp when the tab was closed
			// tab.title already has the correct cached title from the Tab object
			const tabWithTimestamp: RecentlyClosedTab = {
				...tab,
				closedAt: Date.now(),
			};

			setRecentlyClosedTabs((prev) => {
				// Remove if already exists (prevent duplicates)
				const filtered = prev.filter((t) => t.key !== tab.key);
				// Add to beginning (most recent first) and limit to max
				const updated = [tabWithTimestamp, ...filtered].slice(
					0,
					recentlyClosedLimit
				);

				// Save to localStorage immediately if persistence is enabled
				// saveToStorage accepts array and converts to workspace structure
				if (persistenceEnabledRef.current) {
					saveToStorage(updated, recentlyClosedLimit);
				}

				return updated;
			});
		},
		[recentlyClosedLimit]
	);

	/**
	 * Reopen a tab from the recently closed list
	 * Returns the tab and removes it from the list
	 *
	 * Uses a ref to access current state synchronously, then updates state.
	 *
	 * @param tabKey - Key of the tab to reopen
	 * @return The tab object, or null if not found
	 */
	const reopenTab = useCallback(
		(tabKey: string): RecentlyClosedTab | null => {
			// Find the tab synchronously using the ref
			const foundTab =
				recentlyClosedTabsRef.current.find((t) => t.key === tabKey) ??
				null;

			if (foundTab) {
				// Remove the tab from state
				setRecentlyClosedTabs((prev) =>
					prev.filter((t) => t.key !== tabKey)
				);
			}

			return foundTab;
		},
		[]
	);

	/**
	 * Remove a tab from the recently closed list by key
	 * Used when a tab is opened (to avoid showing it in recently closed)
	 *
	 * @param tabKey - Key of the tab to remove
	 */
	const removeClosedTab = useCallback((tabKey: string): void => {
		setRecentlyClosedTabs((prev) => {
			const hasTab = prev.some((t) => t.key === tabKey);
			if (hasTab) {
				return prev.filter((t) => t.key !== tabKey);
			}
			return prev;
		});
	}, []);

	/**
	 * Clear all recently closed tabs
	 */
	const clearRecentlyClosedTabs = useCallback((): void => {
		setRecentlyClosedTabs([]);
		if (persistenceEnabledRef.current) {
			clearRecentlyClosedFromStorage();
		}
	}, []);

	/**
	 * Update a closed tab's data when entity changes are detected.
	 * This keeps the storage up-to-date for future sessions.
	 *
	 * @param tabKey - Key of the tab to update
	 * @param updates - Partial updates (title, status, slug)
	 */
	const updateClosedTab = useCallback(
		(
			tabKey: string,
			updates: Partial<Pick<Tab, 'title' | 'status' | 'slug'>>
		): void => {
			setRecentlyClosedTabs((prev) => {
				const tabIndex = prev.findIndex((t) => t.key === tabKey);
				if (tabIndex === -1) {
					return prev;
				}

				const tab = prev[tabIndex];
				// Only update if there are actual changes
				const hasChanges =
					(updates.title !== undefined &&
						updates.title !== tab.title) ||
					(updates.status !== undefined &&
						updates.status !== tab.status) ||
					(updates.slug !== undefined && updates.slug !== tab.slug);

				if (!hasChanges) {
					return prev;
				}

				const updatedTab = { ...tab, ...updates };
				const updatedTabs = [...prev];
				updatedTabs[tabIndex] = updatedTab;

				// Save to localStorage if persistence is enabled
				// saveToStorage accepts array and converts to workspace structure
				if (persistenceEnabledRef.current) {
					saveToStorage(updatedTabs, recentlyClosedLimit);
				}

				return updatedTabs;
			});
		},
		[recentlyClosedLimit]
	);

	return {
		recentlyClosedTabs,
		addClosedTab,
		reopenTab,
		removeClosedTab,
		clearRecentlyClosedTabs,
		updateClosedTab,
	};
}
