/**
 * Pure utility functions for tab operations
 * These functions return new arrays (immutable) and don't modify the input
 */

import type { Tab } from '../types';

/**
 * Type for dirty state check function.
 */
export type GetIsDirtyFn = (
	postType: string,
	postId: string | number
) => boolean;

/**
 * Sort tabs with pinned tabs first, then unpinned tabs
 * Preserves relative order within each group (stable sort behavior)
 * Respects custom order field if available, otherwise maintains array order
 *
 * @param tabs - Array of tab objects
 * @return New sorted array of tabs
 */
export function sortTabsByPinned(tabs: Tab[]): Tab[] {
	return [...tabs].sort((a, b) => {
		const aPinned = a.isPinned ?? false;
		const bPinned = b.isPinned ?? false;

		// If different groups (one pinned, one unpinned), pinned comes first
		if (aPinned !== bPinned) {
			return aPinned ? -1 : 1;
		}

		// Both in same group - sort by order if available
		// If order is undefined, maintain original array order (stable sort)
		if (aPinned === bPinned) {
			const aOrder = a.order;
			const bOrder = b.order;

			// If both have order, sort by order
			if (aOrder !== undefined && bOrder !== undefined) {
				return aOrder - bOrder;
			}

			// If only one has order, prioritize it
			if (aOrder !== undefined) {
				return -1;
			}
			if (bOrder !== undefined) {
				return 1;
			}

			// Neither has order - maintain original order (return 0 for stable sort)
			return 0;
		}

		return 0;
	});
}

/**
 * Close a tab if it's not pinned
 *
 * @param tabs - Array of tab objects
 * @param key - Tab key to close
 * @return New array of tabs with the specified tab removed (if not pinned)
 */
export function closeTab(tabs: Tab[], key: string): Tab[] {
	const tab = tabs.find((t) => t.key === key);
	// Don't close pinned tabs
	if (tab?.isPinned) {
		return tabs;
	}
	return tabs.filter((t) => t.key !== key);
}

/**
 * Close all unpinned tabs except the target tab
 *
 * @param tabs - Array of tab objects
 * @param targetKey - Key of the tab to keep open
 * @return New array of tabs with unpinned tabs removed (except target)
 */
export function closeOthers(tabs: Tab[], targetKey: string): Tab[] {
	return tabs.filter((tab) => {
		// Keep the target tab
		if (tab.key === targetKey) {
			return true;
		}
		// Keep all pinned tabs
		if (tab.isPinned) {
			return true;
		}
		// Remove unpinned tabs that aren't the target
		return false;
	});
}

/**
 * Close unpinned tabs to the right of the target tab
 * Note: This operates on the sorted order (pinned first, then unpinned)
 * Only unpinned tabs are closed (pinned tabs cannot be closed)
 *
 * @param tabs - Array of tab objects
 * @param targetKey - Key of the reference tab
 * @return New array of tabs with unpinned tabs to the right removed
 */
export function closeToRight(tabs: Tab[], targetKey: string): Tab[] {
	// Sort tabs: pinned first, then unpinned
	const sortedTabs = sortTabsByPinned(tabs);

	// Find the target tab index in the sorted array
	const targetIndex = sortedTabs.findIndex((tab) => tab.key === targetKey);

	// If target not found or is the last tab, return original
	if (targetIndex === -1 || targetIndex === sortedTabs.length - 1) {
		return tabs;
	}

	// Get tabs to the right of the target
	const tabsToRight = sortedTabs.slice(targetIndex + 1);

	// Filter out unpinned tabs to the right (keep pinned tabs)
	const tabsToRemove = tabsToRight.filter((tab) => !tab.isPinned);

	// If no unpinned tabs to remove, return original
	if (tabsToRemove.length === 0) {
		return tabs;
	}

	// Remove unpinned tabs to the right
	const keysToRemove = new Set(tabsToRemove.map((tab) => tab.key));
	return tabs.filter((tab) => !keysToRemove.has(tab.key));
}

/**
 * Close all non-dirty, non-pinned tabs
 *
 * @param tabs - Array of tab objects
 * @param getIsDirty - Function to check if a tab is dirty: (postType, postId) => boolean
 * @return New array of tabs with non-dirty, non-pinned tabs removed
 */
export function closeSaved(tabs: Tab[], getIsDirty: GetIsDirtyFn): Tab[] {
	return tabs.filter((tab) => {
		// Keep all pinned tabs
		if (tab.isPinned) {
			return true;
		}
		// Keep dirty tabs
		if (getIsDirty(tab.type, tab.id)) {
			return true;
		}
		// Remove non-dirty, non-pinned tabs
		return false;
	});
}
