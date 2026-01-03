/**
 * WordPress dependencies
 */
import { useState, useCallback, useRef } from '@wordpress/element';

/**
 * Internal dependencies
 */
import type { Tab, LockUser, TabLockState } from '../types';

/**
 * Lock info from server response.
 */
export interface LockInfo {
	isLocked: boolean;
	user?: LockUser | null;
}

/**
 * Lock states map type.
 */
export type LockStatesMap = Record<string, TabLockState>;

/**
 * Return type for useTabsLockState hook.
 */
export interface UseTabsLockStateReturn {
	/** Check if a tab is locked by another user. */
	isTabLocked: (tabKey: string) => boolean;
	/** Get the user who has locked a tab. */
	getLockUser: (tabKey: string) => LockUser | null;
	/** Set lock state for a specific tab. */
	setLockState: (tabKey: string, lockInfo: LockInfo) => void;
	/** Clear lock state for a specific tab. */
	clearLockState: (tabKey: string) => void;
	/** Bulk update lock states from polling response. */
	updateBulkLockStates: (
		locks: Record<string | number, LockInfo>,
		tabs: Tab[]
	) => void;
}

/**
 * Post Lock State Management Hook
 *
 * This hook manages the in-memory state of post locks for all open tabs.
 * It provides functions to check, set, and clear lock states.
 *
 * ## How WordPress Post Locking Works:
 * - WordPress stores locks as post meta (_edit_lock) with format "timestamp:user_id"
 * - Locks automatically expire after ~150 seconds (configurable via wp_check_post_lock_window filter)
 * - The block editor's Heartbeat API refreshes locks every 15-60 seconds
 * - We maintain our own lock state in memory to show appropriate UI (lock icons, modals)
 *
 * ## State Structure:
 * ```
 * {
 *   "post-123": { isLocked: true, user: { id: 1, name: "John", avatar: "url" } },
 *   "page-456": { isLocked: false, user: null }
 * }
 * ```
 *
 * @returns Lock state management functions and current states
 */
export function useTabsLockState(): UseTabsLockStateReturn {
	// Map of tabKey -> { isLocked: boolean, user: { id, name, avatar } | null }
	const [lockStates, setLockStates] = useState<LockStatesMap>({});

	// Use ref to access latest lockStates without causing function recreation
	// This prevents isTabLocked and getLockUser from being recreated on every lock state update,
	// which would cause unnecessary re-renders in components that depend on these functions
	const lockStatesRef = useRef(lockStates);
	lockStatesRef.current = lockStates;

	/**
	 * Check if a tab is locked by another user
	 *
	 * Performance: Uses useCallback with ref to maintain stable function reference.
	 * The function reference never changes, preventing unnecessary re-renders when lockStates updates.
	 *
	 * @param tabKey - Tab key (e.g., "post-123")
	 * @returns True if locked by another user
	 */
	const isTabLocked = useCallback((tabKey: string): boolean => {
		const state = lockStatesRef.current[tabKey];
		return state?.isLocked === true;
	}, []); // Empty deps - accesses lockStates via ref

	/**
	 * Get the user who has locked a tab
	 *
	 * Performance: Uses useCallback with ref to maintain stable function reference.
	 * The function reference never changes, preventing unnecessary re-renders when lockStates updates.
	 *
	 * @param tabKey - Tab key
	 * @returns User object { id, name, avatar } or null if not locked
	 */
	const getLockUser = useCallback((tabKey: string): LockUser | null => {
		const state = lockStatesRef.current[tabKey];
		return state?.lockUser ?? null;
	}, []); // Empty deps - accesses lockStates via ref

	/**
	 * Set lock state for a specific tab
	 *
	 * Called when:
	 * - Polling detects a post is locked by another user
	 * - A new tab is opened and the post is locked
	 *
	 * @param tabKey - Tab key (e.g., "post-123")
	 * @param lockInfo - Lock info { isLocked: boolean, user: Object|null }
	 */
	const setLockState = useCallback((tabKey: string, lockInfo: LockInfo): void => {
		setLockStates((prev) => ({
			...prev,
			[tabKey]: {
				isLocked: lockInfo.isLocked,
				lockUser: lockInfo.user ?? null,
			},
		}));
	}, []);

	/**
	 * Clear lock state for a specific tab
	 *
	 * Called when:
	 * - A tab is closed (cleanup)
	 * - User takes over a lock (no longer locked by someone else)
	 *
	 * Uses functional update to avoid stale closure issues.
	 * Only triggers re-render if the key actually existed.
	 *
	 * @param tabKey - Tab key to clear
	 */
	const clearLockState = useCallback((tabKey: string): void => {
		setLockStates((prev) => {
			// Optimization: Don't trigger re-render if key doesn't exist
			if (!prev[tabKey]) {
				return prev;
			}
			const newState = { ...prev };
			delete newState[tabKey];
			return newState;
		});
	}, []);

	/**
	 * Bulk update lock states from polling response
	 *
	 * Called every 30 seconds when the polling mechanism refreshes lock states.
	 * Maps post IDs from the server response to tab keys.
	 *
	 * @param locks - Server response mapping postId -> { isLocked, user }
	 * @param tabs - Array of tab objects to map postId to tabKey
	 */
	const updateBulkLockStates = useCallback(
		(locks: Record<string | number, LockInfo>, tabs: Tab[]): void => {
			setLockStates((prev) => {
				const newState = { ...prev };

				// Update states for all tabs in the response
				tabs.forEach((tab) => {
					const postId = tab.id;
					const tabKey = tab.key;
					const lockInfo = locks[postId];

					if (lockInfo) {
						newState[tabKey] = {
							isLocked: lockInfo.isLocked,
							lockUser: lockInfo.user ?? null,
						};
					} else {
						// If no lock info returned, assume not locked
						// This handles edge cases like deleted posts
						newState[tabKey] = { isLocked: false, lockUser: null };
					}
				});

				return newState;
			});
		},
		[]
	);

	return {
		// Read functions (stable references via useCallback with refs)
		isTabLocked,
		getLockUser,

		// Write functions (stable references via useCallback with empty deps)
		setLockState,
		clearLockState,
		updateBulkLockStates,
	};
}

