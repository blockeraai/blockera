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
	) => Promise<boolean>;
	/** Function to switch documents. */
	switchDocument: (
		postType: string,
		postId: string | number
	) => Promise<boolean>;
	/** Function to prefetch entity before switching. */
	prefetchEntity: (
		postType: string | null | undefined,
		postId: string | number | null | undefined
	) => Promise<unknown>;
	/** Current tabs array to check for existing tab. */
	tabs?: Tab[];
	/**
	 * Called when the document cannot be loaded (optional).
	 * Receives a minimal tab descriptor for labeling; parent may purge workspace state.
	 */
	onDocumentInaccessible?: (info: {
		key: string;
		type: string;
		id: string | number;
		title: string;
	}) => void;
}

/**
 * Utility function to open or focus a tab in Blockera Tabs
 *
 * @param params - Parameters object
 * @return True if the document is now active; false if it could not be opened.
 */
export async function openOrFocusTab({
	postType,
	postId,
	addTab,
	switchDocument,
	prefetchEntity,
	tabs = [],
	onDocumentInaccessible,
}: OpenOrFocusTabParams): Promise<boolean> {
	const key = `${postType}-${postId}`;

	const notifyInaccessible = (title: string): void => {
		onDocumentInaccessible?.({
			key,
			type: postType,
			id: postId,
			title,
		});
	};

	// Check if tab already exists
	const existingTab = tabs.find((tab) => tab.key === key);

	if (existingTab) {
		const displayTitle =
			typeof existingTab.customTitle === 'string' &&
			existingTab.customTitle !== ''
				? existingTab.customTitle
				: existingTab.title;
		const ok = await switchDocument(postType, postId);
		if (!ok) {
			notifyInaccessible(displayTitle);
		}
		return ok;
	}

	// Tab doesn't exist, create it and activate
	const record = await prefetchEntity(postType, postId);
	if (!record) {
		notifyInaccessible(`${postType} #${String(postId)}`);
		return false;
	}

	const added = await addTab(postType, postId);
	if (!added) {
		return false;
	}

	const ok = await switchDocument(postType, postId);
	if (!ok) {
		notifyInaccessible(`${postType} #${String(postId)}`);
	}
	return ok;
}
