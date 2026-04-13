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
import { useSelect } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';

/**
 * Internal dependencies
 */
import { TABS_STORAGE_KEY } from '../utils/storageKeys';
import { hasReachedLimit, resolveTabsConfig } from '../utils';
import type {
	Tab,
	AddTabOptions,
	UseTabsOptions,
	UseTabsReturn,
	WorkspaceTabs,
	TabsStorage,
	TabsLimitsConfig,
	TabsLimitExceededType,
} from '../types';

/**
 * Main workspace ID constant.
 * Exported for use in other hooks that need workspace-aware storage.
 */
export const MAIN_WORKSPACE_ID = 'main';

/**
 * Load tabs from localStorage
 *
 * @return WorkspaceTabs object with pinned and unpinned tabs
 */
function enforceWorkspaceLimits(
	workspaceTabs: WorkspaceTabs,
	limits: TabsLimitsConfig
): WorkspaceTabs {
	let pinnedTabs: Tab[];
	if (hasReachedLimit(0, limits.pinned)) {
		pinnedTabs = [];
	} else if (Number.isFinite(limits.pinned)) {
		pinnedTabs = workspaceTabs['pinned-tabs'].slice(0, limits.pinned);
	} else {
		pinnedTabs = workspaceTabs['pinned-tabs'];
	}

	let regularTabs: Tab[];
	if (hasReachedLimit(0, limits.regular)) {
		regularTabs = [];
	} else if (Number.isFinite(limits.regular)) {
		regularTabs = workspaceTabs.tabs.slice(0, limits.regular);
	} else {
		regularTabs = workspaceTabs.tabs;
	}

	return {
		'pinned-tabs': pinnedTabs,
		tabs: regularTabs,
	};
}

function loadTabsFromStorage(limits: TabsLimitsConfig): WorkspaceTabs {
	try {
		const stored = localStorage.getItem(TABS_STORAGE_KEY);
		if (stored) {
			const parsed = JSON.parse(stored);

			// Workspace structure: { "main": { "pinned-tabs": [], "tabs": [] } }
			if (
				parsed &&
				typeof parsed === 'object' &&
				!Array.isArray(parsed)
			) {
				if (parsed[MAIN_WORKSPACE_ID]) {
					const workspaceTabs = parsed[
						MAIN_WORKSPACE_ID
					] as WorkspaceTabs;
					// Ensure arrays exist
					return enforceWorkspaceLimits(
						{
							'pinned-tabs': Array.isArray(
								workspaceTabs['pinned-tabs']
							)
								? workspaceTabs['pinned-tabs']
								: [],
							tabs: Array.isArray(workspaceTabs.tabs)
								? workspaceTabs.tabs
								: [],
						},
						limits
					);
				}
			}
		}
	} catch {
		// Invalid data in localStorage, ignore
	}
	return {
		'pinned-tabs': [],
		tabs: [],
	};
}

/**
 * Save tabs to localStorage
 *
 * @param workspaceTabs - WorkspaceTabs object with pinned and unpinned tabs
 */
function saveTabsToStorage(workspaceTabs: WorkspaceTabs): void {
	try {
		const storage: TabsStorage = {
			[MAIN_WORKSPACE_ID]: workspaceTabs,
		};
		localStorage.setItem(TABS_STORAGE_KEY, JSON.stringify(storage));
	} catch {
		// localStorage might be full or disabled, ignore
	}
}

/**
 * Combine pinned and unpinned tabs into a single array
 * (for backward compatibility with existing code)
 *
 * @param workspaceTabs - WorkspaceTabs object
 * @return Combined array with pinned tabs first
 */
function combineTabs(workspaceTabs: WorkspaceTabs): Tab[] {
	return [...workspaceTabs['pinned-tabs'], ...workspaceTabs.tabs];
}

/**
 * Clear tabs from localStorage
 */
export function clearTabsFromStorage(): void {
	try {
		localStorage.removeItem(TABS_STORAGE_KEY);
	} catch {
		// localStorage might be disabled, ignore
	}
}

/**
 * Get workspace tabs structure (for internal use)
 * Exported for use in components that need direct access to separate arrays
 */
export function getWorkspaceTabs(workspaceTabs: WorkspaceTabs): WorkspaceTabs {
	return workspaceTabs;
}

/**
 * Hook to manage tabs state
 *
 * @param options - Options object
 * @return Tabs state and management functions
 */
export function useTabs({
	persistenceEnabled = true,
}: UseTabsOptions = {}): UseTabsReturn {
	const tabsConfig = useMemo(() => resolveTabsConfig(), []);
	const tabsLimits = tabsConfig.limits;

	// Initialize from localStorage on mount - use new structure internally
	const [workspaceTabs, setWorkspaceTabs] = useState<WorkspaceTabs>(() => {
		return loadTabsFromStorage(tabsLimits);
	});
	const [limitExceededType, setLimitExceededType] =
		useState<TabsLimitExceededType>(null);

	const workspaceTabsRef = useRef(workspaceTabs);
	workspaceTabsRef.current = workspaceTabs;

	// Track persistence state in a ref for use in callbacks
	const persistenceEnabledRef = useRef(persistenceEnabled);
	persistenceEnabledRef.current = persistenceEnabled;

	// Save to localStorage whenever workspaceTabs change
	useEffect(() => {
		if (persistenceEnabledRef.current) {
			saveTabsToStorage(workspaceTabs);
		}
	}, [workspaceTabs]);

	/*
	 * Combine tabs for backward compatibility (exposed as tabs property)
	 *
	 * CRITICAL: Memoize the combined array to prevent infinite re-renders.
	 * Without useMemo, combineTabs creates a new array reference on every render,
	 * even when workspaceTabs hasn't changed, causing all callbacks/effects that
	 * depend on 'tabs' to re-run and trigger infinite re-render loops.
	 */
	const tabs = useMemo(() => combineTabs(workspaceTabs), [workspaceTabs]);

	const getEntityRecord = useSelect(
		(select) =>
			(
				select(coreStore) as {
					getEntityRecord: (
						kind: string,
						name: string,
						id: string | number
					) =>
						| {
								slug?: string;
								status?: string;
								title?: string | { rendered?: string };
						  }
						| undefined;
				}
			).getEntityRecord,
		[]
	);

	/**
	 * Get tab slug from entity record
	 */
	const getTabSlug = useCallback(
		(postType: string, postId: string | number): string | null => {
			try {
				const record = getEntityRecord('postType', postType, postId);
				if (record?.slug) {
					return record.slug;
				}
			} catch {
				// Entity not loaded yet
			}
			return null;
		},
		[getEntityRecord]
	);

	/**
	 * Get tab status from entity record
	 */
	const getTabStatus = useCallback(
		(postType: string, postId: string | number): string | null => {
			try {
				const record = getEntityRecord('postType', postType, postId);
				if (record?.status) {
					return record.status;
				}
			} catch {
				// Entity not loaded yet
			}
			return null;
		},
		[getEntityRecord]
	);

	/**
	 * Get tab title from entity record
	 */
	const getTabTitleFromRecord = useCallback(
		(postType: string, postId: string | number): string | null => {
			try {
				const record = getEntityRecord('postType', postType, postId);
				if (record?.title) {
					const title = record.title;
					return typeof title === 'string'
						? title
						: title.rendered || null;
				}
			} catch {
				// Entity not loaded yet
			}
			return null;
		},
		[getEntityRecord]
	);

	/**
	 * Add a new tab
	 */
	const addTab = useCallback(
		async (
			postType: string,
			postId: string | number,
			title: string | null = null,
			slug: string | null = null,
			status: string | null = null,
			options?: AddTabOptions
		): Promise<boolean> => {
			const key = `${postType}-${postId}`;

			// Fetch title if not provided - try to get from entity record
			let resolvedTitle = title;
			if (!resolvedTitle) {
				resolvedTitle = getTabTitleFromRecord(postType, postId);
			}

			// Fetch slug if not provided
			let resolvedSlug = slug;
			if (!resolvedSlug) {
				resolvedSlug = getTabSlug(postType, postId);
			}

			// Fetch status if not provided
			let resolvedStatus = status;
			if (!resolvedStatus) {
				resolvedStatus = getTabStatus(postType, postId);
			}

			const newTab: Tab = {
				id: postId,
				type: postType,
				title: resolvedTitle ?? `${postType} #${postId}`,
				slug: resolvedSlug,
				status: resolvedStatus,
				key,
				isPinned: false, // New tabs are unpinned by default
			};

			let outcome: 'existed' | 'added' | 'blocked' = 'existed';
			let evictedUnpinnedTab: Tab | undefined;
			const current = workspaceTabsRef.current;
			let next = current;

			if (
				current['pinned-tabs'].find((tab) => tab.key === key) ||
				current.tabs.find((tab) => tab.key === key)
			) {
				outcome = 'existed';
			} else if (
				hasReachedLimit(current.tabs.length, tabsLimits.regular)
			) {
				if (
					options?.evictLastUnpinnedIfAtLimit &&
					current.tabs.length > 0
				) {
					evictedUnpinnedTab = current.tabs[current.tabs.length - 1];
					const updatedTabs = [...current.tabs.slice(0, -1), newTab];
					outcome = 'added';
					next = {
						'pinned-tabs': current['pinned-tabs'],
						tabs: updatedTabs,
					};
				} else {
					outcome = 'blocked';
				}
			} else {
				outcome = 'added';
				next = {
					'pinned-tabs': current['pinned-tabs'],
					tabs: [...current.tabs, newTab],
				};
			}

			if (next !== current) {
				workspaceTabsRef.current = next;
				setWorkspaceTabs(next);
				if (persistenceEnabledRef.current) {
					saveTabsToStorage(next);
				}
			}

			if (evictedUnpinnedTab && options?.onEvictedUnpinned) {
				options.onEvictedUnpinned(evictedUnpinnedTab);
			}

			if (outcome === 'blocked') {
				setLimitExceededType('regular');
				return false;
			}

			if (outcome === 'added') {
				setLimitExceededType(null);
			}

			return true;
		},
		[getTabTitleFromRecord, getTabSlug, getTabStatus, tabsLimits.regular]
	);

	/**
	 * Remove a tab
	 */
	const removeTab = useCallback((key: string): void => {
		setWorkspaceTabs((prev) => ({
			'pinned-tabs': prev['pinned-tabs'].filter((tab) => tab.key !== key),
			tabs: prev.tabs.filter((tab) => tab.key !== key),
		}));
	}, []);

	/**
	 * Update tab title
	 */
	const updateTabTitle = useCallback((key: string, title: string): void => {
		setWorkspaceTabs((prev) => ({
			'pinned-tabs': prev['pinned-tabs'].map((tab) =>
				tab.key === key ? { ...tab, title } : tab
			),
			tabs: prev.tabs.map((tab) =>
				tab.key === key ? { ...tab, title } : tab
			),
		}));
	}, []);

	/**
	 * Refresh tab titles
	 */
	const refreshTabTitles = useCallback(async (): Promise<void> => {
		// Titles will be updated when entities are loaded
		// This is a placeholder for future enhancement
	}, []);

	/**
	 * Pin a tab
	 * Moves the tab from unpinned to pinned array (at the end)
	 */
	const pinTab = useCallback(
		(key: string): void => {
			setWorkspaceTabs((prev) => {
				// Find tab in unpinned array
				const tabToPin = prev.tabs.find((tab) => tab.key === key);
				if (!tabToPin) {
					return prev; // Tab not found or already pinned
				}

				if (
					hasReachedLimit(
						prev['pinned-tabs'].length,
						tabsLimits.pinned
					)
				) {
					setLimitExceededType('pinned');
					return prev;
				}

				setLimitExceededType(null);

				return {
					'pinned-tabs': [
						...prev['pinned-tabs'],
						{ ...tabToPin, isPinned: true },
					],
					tabs: prev.tabs.filter((tab) => tab.key !== key),
				};
			});
		},
		[tabsLimits.pinned]
	);

	/**
	 * Unpin a tab
	 * Moves the tab from pinned to unpinned array (at the beginning)
	 */
	const unpinTab = useCallback((key: string): void => {
		setWorkspaceTabs((prev) => {
			// Find tab in pinned array
			const tabToUnpin = prev['pinned-tabs'].find(
				(tab) => tab.key === key
			);
			if (!tabToUnpin) {
				return prev; // Tab not found or already unpinned
			}

			return {
				'pinned-tabs': prev['pinned-tabs'].filter(
					(tab) => tab.key !== key
				),
				tabs: [{ ...tabToUnpin, isPinned: false }, ...prev.tabs],
			};
		});
	}, []);

	/**
	 * Toggle pin state of a tab
	 */
	const togglePinTab = useCallback(
		(key: string): void => {
			setWorkspaceTabs((prev) => {
				// Check if tab is in pinned array
				const pinnedTab = prev['pinned-tabs'].find(
					(tab) => tab.key === key
				);
				if (pinnedTab) {
					// Unpin: move from pinned to unpinned (at the beginning)
					return {
						'pinned-tabs': prev['pinned-tabs'].filter(
							(tab) => tab.key !== key
						),
						tabs: [{ ...pinnedTab, isPinned: false }, ...prev.tabs],
					};
				}

				// Check if tab is in unpinned array
				const unpinnedTab = prev.tabs.find((tab) => tab.key === key);
				if (unpinnedTab) {
					if (
						hasReachedLimit(
							prev['pinned-tabs'].length,
							tabsLimits.pinned
						)
					) {
						setLimitExceededType('pinned');
						return prev;
					}

					setLimitExceededType(null);

					// Pin: move from unpinned to pinned
					return {
						'pinned-tabs': [
							...prev['pinned-tabs'],
							{ ...unpinnedTab, isPinned: true },
						],
						tabs: prev.tabs.filter((tab) => tab.key !== key),
					};
				}

				return prev; // Tab not found
			});
		},
		[tabsLimits.pinned]
	);

	/**
	 * Set tabs directly (for bulk operations)
	 * Accepts combined tabs array and splits into pinned/unpinned
	 *
	 * @param newTabs - New tabs array or function that receives current tabs and returns new tabs
	 */
	const setTabsDirect = useCallback(
		(newTabs: Tab[] | ((prev: Tab[]) => Tab[])): void => {
			setWorkspaceTabs((prev) => {
				const currentCombined = combineTabs(prev);
				const updatedCombined =
					typeof newTabs === 'function'
						? newTabs(currentCombined)
						: newTabs;

				// Split into pinned and unpinned
				const pinned: Tab[] = [];
				const unpinned: Tab[] = [];

				for (const tab of updatedCombined) {
					if (tab.isPinned) {
						pinned.push(tab);
					} else {
						unpinned.push(tab);
					}
				}

				return enforceWorkspaceLimits(
					{
						'pinned-tabs': pinned,
						tabs: unpinned,
					},
					tabsLimits
				);
			});
		},
		[tabsLimits]
	);

	/**
	 * Set custom title for a tab
	 * If customTitle is empty string or null, it clears the custom title
	 *
	 * @param key - Tab key
	 * @param customTitle - Custom title to set, or null/empty string to clear
	 */
	const setTabCustomTitle = useCallback(
		(key: string, customTitle: string | null): void => {
			setWorkspaceTabs((prev) => {
				const updatedCustomTitle =
					customTitle && customTitle.trim() !== ''
						? customTitle.trim()
						: null;

				return {
					'pinned-tabs': prev['pinned-tabs'].map((tab) =>
						tab.key === key
							? { ...tab, customTitle: updatedCustomTitle }
							: tab
					),
					tabs: prev.tabs.map((tab) =>
						tab.key === key
							? { ...tab, customTitle: updatedCustomTitle }
							: tab
					),
				};
			});
		},
		[]
	);

	/**
	 * Reorder tabs within a group (pinned or unpinned)
	 * Used for drag-and-drop sorting
	 *
	 * @param pinnedTabs - New order for pinned tabs
	 * @param unpinnedTabs - New order for unpinned tabs
	 */
	const reorderTabs = useCallback(
		(pinnedTabs: Tab[], unpinnedTabs: Tab[]): void => {
			setWorkspaceTabs(
				enforceWorkspaceLimits(
					{
						'pinned-tabs': pinnedTabs,
						tabs: unpinnedTabs,
					},
					tabsLimits
				)
			);
		},
		[tabsLimits]
	);

	const clearLimitExceeded = useCallback((): void => {
		setLimitExceededType(null);
	}, []);

	return {
		tabs, // Combined array for backward compatibility
		pinnedTabs: workspaceTabs['pinned-tabs'],
		unpinnedTabs: workspaceTabs.tabs,
		addTab,
		removeTab,
		updateTabTitle,
		refreshTabTitles,
		pinTab,
		unpinTab,
		togglePinTab,
		setTabs: setTabsDirect,
		setTabCustomTitle,
		reorderTabs,
		limitExceededType,
		clearLimitExceeded,
	};
}
