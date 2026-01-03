/**
 * WordPress dependencies
 */
import { useEffect, useRef, useCallback } from '@wordpress/element';

/**
 * Internal dependencies
 */
import type { Tab, LockUser } from '../types';
import type { LockInfo } from './useTabsLockState';

/**
 * Polling interval in milliseconds (30 seconds)
 *
 * WordPress post locks expire after ~150 seconds by default.
 * 30 seconds gives us a comfortable margin to refresh before expiration.
 * This matches WordPress's Heartbeat behavior.
 */
const POLL_INTERVAL = 30000;

/**
 * Lock settings from PHP.
 */
interface BlockeraTabsLock {
	ajaxUrl: string;
	checkNonce: string;
	takeoverNonce: string;
}

/**
 * Extended window interface for lock globals.
 */
declare global {
	interface Window {
		blockeraTabsLock?: BlockeraTabsLock;
	}
}

/**
 * Server response for lock refresh.
 * Keys can be numeric post IDs or string template identifiers (e.g., "theme//slug").
 */
interface LockRefreshResponse {
	success: boolean;
	data?: {
		locks?: Record<string | number, LockInfo>;
	};
}

/**
 * Parameters for useTabsLockPolling hook.
 */
export interface UseTabsLockPollingParams {
	/** Array of open tab objects. */
	tabs: Tab[];
	/** Currently active tab key (e.g., "post-123"). */
	activeTabKey: string | null;
	/** Callback to update lock states in parent. */
	updateBulkLockStates: (
		locks: Record<string | number, LockInfo>,
		tabs: Tab[]
	) => void;
	/** Callback when active tab is taken over. */
	onActiveTabLocked: (tabKey: string, lockInfo: LockInfo) => void;
}

/**
 * Return type for useTabsLockPolling hook.
 */
export interface UseTabsLockPollingReturn {
	/** Take over a post lock. */
	takeoverLock: (postId: string | number) => Promise<boolean>;
	/** Check lock state for a single post. */
	checkSingleLock: (postId: string | number) => Promise<LockInfo | null>;
}

/**
 * Post Lock Polling Hook
 *
 * This hook manages the periodic polling of post lock states for all open tabs.
 *
 * ## Key Responsibilities:
 * 1. Refresh locks every 30 seconds to keep them alive (prevents expiration)
 * 2. Detect when another user takes over a post we had locked
 * 3. Provide functions to acquire/takeover locks and check single post locks
 *
 * ## WordPress Post Lock Lifecycle:
 * - Lock created: wp_set_post_lock() stores timestamp:user_id in _edit_lock meta
 * - Lock checked: wp_check_post_lock() returns user_id if lock is valid (< 150s old)
 * - Lock expires: After ~150 seconds without refresh, wp_check_post_lock returns false
 * - Lock refresh: Calling wp_set_post_lock() updates the timestamp
 *
 * ## Performance Optimizations:
 * - Uses refs for mutable values to avoid recreating callbacks
 * - Pauses polling when browser tab is hidden (Page Visibility API)
 * - Single bulk request for all tabs instead of individual requests
 * - Debounces concurrent requests with isPollingRef
 *
 * @param params - Hook parameters
 * @returns Lock management functions
 */
export function useTabsLockPolling({
	tabs,
	activeTabKey,
	updateBulkLockStates,
	onActiveTabLocked,
}: UseTabsLockPollingParams): UseTabsLockPollingReturn {
	// Refs for values that shouldn't trigger callback recreation
	const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
	const isPollingRef = useRef(false);
	const isVisibleRef = useRef(!document.hidden);

	// Store latest values in refs to access in callbacks without recreating them
	const tabsRef = useRef(tabs);
	const activeTabKeyRef = useRef(activeTabKey);
	const updateBulkLockStatesRef = useRef(updateBulkLockStates);
	const onActiveTabLockedRef = useRef(onActiveTabLocked);

	// Keep refs updated
	useEffect(() => {
		tabsRef.current = tabs;
	}, [tabs]);

	useEffect(() => {
		activeTabKeyRef.current = activeTabKey;
	}, [activeTabKey]);

	useEffect(() => {
		updateBulkLockStatesRef.current = updateBulkLockStates;
	}, [updateBulkLockStates]);

	useEffect(() => {
		onActiveTabLockedRef.current = onActiveTabLocked;
	}, [onActiveTabLocked]);

	/**
	 * Refresh lock states for all tabs
	 *
	 * This is the core polling function that:
	 * 1. Sends a bulk request to refresh locks for all open tabs
	 * 2. Updates the lock state store with responses
	 * 3. Triggers modal if active tab was taken over
	 *
	 * Uses refs to access latest values without requiring dependency updates.
	 */
	const refreshLockStates = useCallback(async (): Promise<void> => {
		// Prevent concurrent requests
		if (isPollingRef.current) {
			return;
		}

		const currentTabs = tabsRef.current;

		// Skip if no tabs to refresh
		if (!currentTabs || currentTabs.length === 0) {
			return;
		}

		// Check if localized script data is available
		if (typeof window.blockeraTabsLock === 'undefined') {
			return;
		}

		const { ajaxUrl, checkNonce } = window.blockeraTabsLock;
		const postIds = currentTabs.map((tab) => tab.id);

		isPollingRef.current = true;

		try {
			const formData = new FormData();
			formData.append('action', 'blockera_tabs_refresh_post_locks');
			formData.append('nonce', checkNonce);
			postIds.forEach((id) => formData.append('postIds[]', String(id)));

			const response = await fetch(ajaxUrl, {
				method: 'POST',
				credentials: 'same-origin',
				body: formData,
			});

			const result = (await response.json()) as LockRefreshResponse;

			if (result.success && result.data?.locks) {
				// Update lock states in the state store
				updateBulkLockStatesRef.current?.(result.data.locks, currentTabs);

				// Check if the currently active tab was taken over
				const currentActiveKey = activeTabKeyRef.current;
				if (currentActiveKey && onActiveTabLockedRef.current) {
					const activeTab = currentTabs.find(
						(tab) => tab.key === currentActiveKey
					);
					if (activeTab) {
						// Use the post ID as-is (can be string or number)
						const lockInfo = result.data.locks[activeTab.id];
						if (lockInfo?.isLocked) {
							// Active tab was taken over - trigger modal
							onActiveTabLockedRef.current(currentActiveKey, lockInfo);
						}
					}
				}
			}
		} catch (error) {
			// Silently fail - will retry on next poll interval
			// Log in development for debugging
			if (process.env.NODE_ENV === 'development') {
				// eslint-disable-next-line no-console
				console.error('Blockera Tabs: Failed to refresh post locks', error);
			}
		} finally {
			isPollingRef.current = false;
		}
	}, []); // Empty deps - uses refs for all values

	/**
	 * Start the polling interval
	 *
	 * Called when tabs exist. Performs initial refresh then sets up interval.
	 */
	const startPolling = useCallback((): void => {
		// Clear any existing interval to prevent duplicates
		if (intervalRef.current) {
			clearInterval(intervalRef.current);
		}

		// Only poll if there are tabs
		if (tabsRef.current.length === 0) {
			return;
		}

		// Immediate refresh on start (e.g., page load)
		void refreshLockStates();

		// Set up recurring interval
		intervalRef.current = setInterval(() => {
			// Only poll if page is visible (performance optimization)
			if (isVisibleRef.current) {
				void refreshLockStates();
			}
		}, POLL_INTERVAL);
	}, [refreshLockStates]);

	/**
	 * Stop the polling interval
	 *
	 * Called when all tabs are closed or on unmount.
	 */
	const stopPolling = useCallback((): void => {
		if (intervalRef.current) {
			clearInterval(intervalRef.current);
			intervalRef.current = null;
		}
	}, []);

	/**
	 * Handle page visibility changes
	 *
	 * Pauses polling when tab is hidden (saves resources).
	 * Immediately refreshes when tab becomes visible (catch up on changes).
	 */
	useEffect(() => {
		const handleVisibilityChange = (): void => {
			isVisibleRef.current = !document.hidden;

			// Refresh immediately when becoming visible
			if (isVisibleRef.current && tabsRef.current.length >= 1) {
				void refreshLockStates();
			}
		};

		document.addEventListener('visibilitychange', handleVisibilityChange);

		return () => {
			document.removeEventListener('visibilitychange', handleVisibilityChange);
		};
	}, [refreshLockStates]);

	/**
	 * Start/stop polling based on tab count
	 *
	 * Starts polling when first tab is added.
	 * Stops polling when all tabs are closed.
	 */
	useEffect(() => {
		if (tabs.length >= 1) {
			startPolling();
		} else {
			stopPolling();
		}

		// Cleanup on unmount
		return () => {
			stopPolling();
		};
	}, [tabs.length, startPolling, stopPolling]);

	/**
	 * Acquire or take over a post lock
	 *
	 * Used when:
	 * 1. Opening a new tab (acquire lock for current user)
	 * 2. Clicking "Take Over" in the lock modal
	 *
	 * @param postId - Post ID to acquire lock for
	 * @returns True if lock was successfully acquired
	 */
	const takeoverLock = useCallback(
		async (postId: string | number): Promise<boolean> => {
			if (typeof window.blockeraTabsLock === 'undefined') {
				return false;
			}

			const { ajaxUrl, takeoverNonce } = window.blockeraTabsLock;

			try {
				const formData = new FormData();
				formData.append('action', 'blockera_tabs_takeover_post_lock');
				formData.append('nonce', takeoverNonce);
				formData.append('postId', String(postId));

				const response = await fetch(ajaxUrl, {
					method: 'POST',
					credentials: 'same-origin',
					body: formData,
				});

				const result = (await response.json()) as { success: boolean };
				return result.success === true;
			} catch (error) {
				if (process.env.NODE_ENV === 'development') {
					// eslint-disable-next-line no-console
					console.error('Blockera Tabs: Failed to take over post lock', error);
				}
				return false;
			}
		},
		[]
	);

	/**
	 * Check lock state for a single post
	 *
	 * Used when opening a new tab to check if the post is locked
	 * before the next polling cycle.
	 *
	 * @param postId - Post ID to check
	 * @returns Lock info { isLocked, user } or null on error
	 */
	const checkSingleLock = useCallback(
		async (postId: string | number): Promise<LockInfo | null> => {
			if (typeof window.blockeraTabsLock === 'undefined') {
				return null;
			}

			const { ajaxUrl, checkNonce } = window.blockeraTabsLock;

			try {
				const formData = new FormData();
				formData.append('action', 'blockera_tabs_check_post_locks');
				formData.append('nonce', checkNonce);
				formData.append('postIds[]', String(postId));

				const response = await fetch(ajaxUrl, {
					method: 'POST',
					credentials: 'same-origin',
					body: formData,
				});

				const result = (await response.json()) as LockRefreshResponse;

				if (result.success && result.data?.locks) {
					// Use the postId as-is (can be string or number)
					const lockInfo = result.data.locks[postId];
					if (lockInfo) {
						return lockInfo;
					}
				}

				return null;
			} catch (error) {
				if (process.env.NODE_ENV === 'development') {
					// eslint-disable-next-line no-console
					console.error('Blockera Tabs: Failed to check single post lock', error);
				}
				return null;
			}
		},
		[]
	);

	return {
		// Lock acquisition functions (used externally)
		takeoverLock,
		checkSingleLock,
	};
}

