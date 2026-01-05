/**
 * Utility to check for local autosave backups in sessionStorage.
 *
 * The Block Editor stores local autosave backups in sessionStorage using a specific
 * key format. This utility mirrors that format to detect if a post has a backup.
 *
 * @see source-code-block-editor/packages/editor/src/store/local-autosave.js
 */

/**
 * Get the sessionStorage key for a post's local autosave.
 * Matches Block Editor's local-autosave.js key format.
 *
 * @param postId - The post ID
 * @param isPostNew - Whether the post is new (auto-draft)
 * @return The sessionStorage key
 */
function getAutosaveKey(postId: string | number, isPostNew: boolean): string {
	return `wp-autosave-block-editor-post-${isPostNew ? 'auto-draft' : postId}`;
}

/**
 * Check if a post has a local autosave backup in sessionStorage.
 *
 * @param postId - The post ID
 * @param isPostNew - Whether the post is new (auto-draft)
 * @return True if local autosave exists
 */
export function hasLocalAutosave(
	postId: string | number,
	isPostNew: boolean = false
): boolean {
	try {
		const key = getAutosaveKey(postId, isPostNew);
		const value = window.sessionStorage.getItem(key);
		return value !== null && value.length > 0;
	} catch {
		// sessionStorage might not be available (private browsing, etc.)
		return false;
	}
}

/**
 * Get the local autosave data for a post.
 *
 * @param postId - The post ID
 * @param isPostNew - Whether the post is new (auto-draft)
 * @return Parsed autosave data or null
 */
export function getLocalAutosave(
	postId: string | number,
	isPostNew: boolean = false
): { post_title: string; content: string; excerpt: string } | null {
	try {
		const key = getAutosaveKey(postId, isPostNew);
		const value = window.sessionStorage.getItem(key);
		if (!value) {
			return null;
		}
		return JSON.parse(value);
	} catch {
		return null;
	}
}
