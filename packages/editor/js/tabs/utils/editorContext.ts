/**
 * Internal dependencies
 */
import { isSiteEditorPostType } from '../../hooks';

/**
 * Editor context type.
 */
export type EditorContext = 'site' | 'post';

/**
 * Get the current editor context based on the current URL
 *
 * @return 'site' for site editor, 'post' for post editor, or null if unknown
 */
export function getCurrentEditorContext(): EditorContext | null {
	const pathname = window.location.pathname;

	if (pathname.includes('site-editor.php')) {
		return 'site';
	}

	if (pathname.includes('post.php') || pathname.includes('post-new.php')) {
		return 'post';
	}

	return null;
}

/**
 * Whether companion tab-limit promotions should be skipped for this add-tab call.
 *
 * Passive document sync (post.php, post-new.php, site editor) uses
 * `replaceUnpinnedForCompanionSync` via TabsManager in theme mode.
 *
 * @param options Optional add-tab options (honours `skipTabLimits`).
 */
export function shouldSkipCompanionTabLimits(options?: {
	skipTabLimits?: boolean;
}): boolean {
	return Boolean(options?.skipTabLimits);
}

/**
 * Determine which editor context a post type belongs to
 *
 * @param postType - Post type to check
 * @return 'site' for site editor types, 'post' for others
 */
export function getEditorContextForPostType(postType: string): EditorContext {
	return isSiteEditorPostType(postType) ? 'site' : 'post';
}

/**
 * Check if navigation from one post type to another would cross editor boundaries
 *
 * @param fromPostType - Source post type
 * @param toPostType - Target post type
 * @return True if navigation would cross editor boundaries
 */
export function isCrossBoundaryNavigation(
	fromPostType: string,
	toPostType: string
): boolean {
	const fromContext = getEditorContextForPostType(fromPostType);
	const toContext = getEditorContextForPostType(toPostType);
	return fromContext !== toContext;
}
