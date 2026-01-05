/**
 * Internal dependencies
 */
import type { Tab } from '../types';

/**
 * Parameters for openOrFocusTab function.
 */
export interface OpenOrFocusTabParams {
	/** Post type (e.g., 'post', 'page', 'wp_template'). */
	postType: string;
	/** Post ID. */
	postId: number | string;
	/** Function to add a tab. */
	addTab: (
		postType: string,
		postId: string | number,
		title?: string | null,
		slug?: string | null,
		status?: string | null
	) => Promise<void>;
	/** Function to switch documents. */
	switchDocument: (postType: string, postId: string | number) => void;
	/** Function to prefetch entity before switching. */
	prefetchEntity: (
		postType: string | null | undefined,
		postId: string | number | null | undefined
	) => Promise<unknown>;
	/** Current tabs array to check for existing tab. */
	tabs?: Tab[];
}

/**
 * Utility function to open or focus a tab in Blockera Tabs
 *
 * @param params - Parameters object
 * @return Promise that resolves when tab is opened and activated
 */
export async function openOrFocusTab({
	postType,
	postId,
	addTab,
	switchDocument,
	prefetchEntity,
	tabs = [],
}: OpenOrFocusTabParams): Promise<void> {
	const key = `${postType}-${postId}`;

	// Check if tab already exists
	const existingTab = tabs.find((tab) => tab.key === key);

	if (existingTab) {
		// Tab exists, just activate it
		switchDocument(postType, postId);
		return;
	}

	// Tab doesn't exist, create it and activate
	// Prefetch entity data before switching for instant tab switch
	await prefetchEntity(postType, postId);

	// Add tab (handles duplicate check internally)
	await addTab(postType, postId);

	// Switch to the new tab
	switchDocument(postType, postId);
}
