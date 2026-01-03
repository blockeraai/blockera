/**
 * WordPress dependencies
 */
import { useSelect, resolveSelect } from '@wordpress/data';
import { useCallback } from '@wordpress/element';
import { store as editorStore } from '@wordpress/editor';
import { store as coreStore } from '@wordpress/core-data';

/**
 * Internal dependencies
 */
import { getEditorUrl } from '../../hooks';
import {
	getEditorContextForPostType,
	getCurrentEditorContext,
} from '../utils/editorContext';

/**
 * Editor settings with navigation callback.
 */
interface EditorSettings {
	onNavigateToEntityRecord?: (params: {
		postId: string | number;
		postType: string;
	}) => void;
}

/**
 * Hook to get the document switching function
 *
 * Detects when navigation crosses editor boundaries (post editor ↔ site editor)
 * and uses window.location.href for cross-boundary navigation, while using
 * onNavigateToEntityRecord for same-context navigation.
 *
 * IMPORTANT: When switching to a different post type, this hook ensures the post type
 * configuration is resolved first. This prevents the editor from unmounting and remounting,
 * which happens when getDefaultRenderingMode returns undefined (while waiting for post type
 * resolution).
 *
 * @returns Function to switch to a document: (postType, postId) => void
 */
export function useSwitchDocument(): (
	postType: string,
	postId: string | number
) => Promise<void> {
	const onNavigateToEntityRecord = useSelect((select) => {
		const editorSettings = (select(editorStore) as { getEditorSettings: () => EditorSettings }).getEditorSettings();
		return editorSettings?.onNavigateToEntityRecord;
	}, []);

	const currentPostType = useSelect(
		(select) => (select(editorStore) as { getCurrentPostType: () => string | undefined }).getCurrentPostType(),
		[]
	);

	// Check if post type config is already resolved
	const hasPostTypeResolved = useSelect(
		(select) => (postType: string): boolean => {
			return (select(coreStore) as { hasFinishedResolution: (selector: string, args: string[]) => boolean }).hasFinishedResolution('getPostType', [postType]);
		},
		[]
	);

	// Function to ensure post type config is resolved before switching
	const ensurePostTypeResolved = useCallback(
		async (postType: string): Promise<void> => {
			// If already resolved, return immediately
			if (hasPostTypeResolved(postType)) {
				return;
			}

			// Trigger resolution and wait for it
			// This is critical to prevent editor unmount/remount when getDefaultRenderingMode
			// returns undefined while waiting for post type resolution
			try {
				const resolved = resolveSelect(coreStore) as { getPostType: (postType: string) => Promise<unknown> };
				await resolved.getPostType(postType);
			} catch {
				// Silently fail - post type might not exist
			}
		},
		[hasPostTypeResolved]
	);

	return async (postType: string, postId: string | number): Promise<void> => {
		// If switching to a different post type, ensure post type config is resolved first
		if (currentPostType && currentPostType !== postType) {
			// CRITICAL: Ensure post type configuration is resolved BEFORE navigation
			// This prevents the editor from unmounting/remounting when switching post types
			// because getDefaultRenderingMode won't return undefined while waiting for resolution
			await ensurePostTypeResolved(postType);
		}
		// Always prefer onNavigateToEntityRecord if available - it handles navigation
		// without page reload in both post editor (state-based) and site editor (router-based)
		if (onNavigateToEntityRecord) {
			try {
				onNavigateToEntityRecord({ postId, postType });

				// Update browser URL to match the current document
				// Always update for site editor types
				// Also update for post types when coming from a different editor context
				const targetContext = getEditorContextForPostType(postType);
				const currentContext = getCurrentEditorContext();
				const isSiteEditorType = targetContext === 'site';
				const isContextChange =
					currentContext !== null && currentContext !== targetContext;

				if (isSiteEditorType || isContextChange) {
					const editorUrl = getEditorUrl(postType, postId);
					window.history.pushState(null, '', editorUrl);
				} else {
					// Fallback: Wait 200ms and check if URL was updated by the editor
					// If not, update it manually using pushState
					const expectedUrl = getEditorUrl(postType, postId);
					const urlObj = new URL(expectedUrl);

					// For post editor: check if URL contains the post ID
					// For site editor: check if URL contains postType and postId
					const shouldCheck =
						targetContext === 'post'
							? urlObj.searchParams.get('post')
							: urlObj.searchParams.get('postType') &&
								urlObj.searchParams.get('postId');

					if (shouldCheck) {
						setTimeout(() => {
							const currentUrl = window.location.href;
							const currentUrlObjAfter = new URL(currentUrl);

							// Check if URL contains the expected parameters
							let urlMatches = false;
							if (targetContext === 'post') {
								const expectedPostId = urlObj.searchParams.get('post');
								const currentPostId =
									currentUrlObjAfter.searchParams.get('post');
								urlMatches =
									currentUrl.includes('post.php') &&
									currentPostId === expectedPostId;
							} else {
								const expectedPostType = urlObj.searchParams.get('postType');
								const expectedPostIdParam = urlObj.searchParams.get('postId');
								const currentPostTypeParam =
									currentUrlObjAfter.searchParams.get('postType');
								const currentPostIdParam =
									currentUrlObjAfter.searchParams.get('postId');
								urlMatches =
									currentUrl.includes('site-editor.php') &&
									currentPostTypeParam === expectedPostType &&
									currentPostIdParam === expectedPostIdParam;
							}

							// If URL doesn't match, update it
							if (!urlMatches) {
								window.history.pushState(null, '', expectedUrl);
							}
						}, 200);
					}
				}
				return;
			} catch {
				// If navigation fails (e.g., cross-boundary issue), fall back to full page navigation
				// Silently fall back - the error indicates onNavigateToEntityRecord can't handle this navigation
			}
		}

		// Fallback: Cross-boundary navigation or when onNavigateToEntityRecord is not available
		// Use window.location.assign() to update URL and add to browser history
		const editorUrl = getEditorUrl(postType, postId);
		window.location.assign(editorUrl);
	};
}

