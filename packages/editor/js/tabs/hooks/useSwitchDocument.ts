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
 * While switching from post.php to a site-editor document, core may call
 * history.replaceState(post.php?...) shortly after; that clobbers our pushState.
 * We redirect those replaceState URL arguments to the expected site-editor URL.
 */
type BlockeraReplaceGuard = { expectedFullUrl: string };
let blockeraTabsReplaceGuard: BlockeraReplaceGuard | null = null;
let replaceGuardClearTimer: ReturnType<typeof setTimeout> | undefined;
let replaceStateGuardInstalled = false;

function installReplaceStateUrlSyncGuard(): void {
	if (replaceStateGuardInstalled || typeof window === 'undefined') {
		return;
	}
	replaceStateGuardInstalled = true;
	const inner = history.replaceState.bind(history);
	history.replaceState = function (
		state: unknown,
		title: string,
		url?: string | URL | null
	): void {
		const g = blockeraTabsReplaceGuard;
		if (g && url !== undefined && url !== null && String(url) !== '') {
			try {
				const resolved = new URL(String(url), window.location.href);
				if (
					resolved.pathname.includes('post.php') &&
					resolved.searchParams.get('action') === 'edit'
				) {
					inner(state, title, g.expectedFullUrl);
					return;
				}
			} catch {
				// Fall through to normal replaceState.
			}
		}
		return inner(state, title, url);
	};
}

function activatePostToSiteReplaceGuard(expectedFullUrl: string): void {
	installReplaceStateUrlSyncGuard();
	blockeraTabsReplaceGuard = { expectedFullUrl };
	if (replaceGuardClearTimer !== undefined) {
		window.clearTimeout(replaceGuardClearTimer);
	}
	replaceGuardClearTimer = window.setTimeout(() => {
		blockeraTabsReplaceGuard = null;
		replaceGuardClearTimer = undefined;
	}, 3000);
}

/** Drop any pending guard so site→post (or any new switch) is not rewritten to a stale site-editor URL. */
function clearPostToSiteReplaceGuard(): void {
	blockeraTabsReplaceGuard = null;
	if (replaceGuardClearTimer !== undefined) {
		window.clearTimeout(replaceGuardClearTimer);
		replaceGuardClearTimer = undefined;
	}
}

/**
 * Resolve the destination entity in core-data before navigation so the editor is not
 * briefly out of sync with the REST record when switching tabs.
 */
async function ensureTargetEntityRecordLoaded(
	postType: string,
	postId: string | number
): Promise<void> {
	try {
		const resolved = resolveSelect(coreStore) as {
			getEditedEntityRecord: (
				kind: string,
				name: string,
				id: string | number
			) => Promise<unknown>;
		};
		await resolved.getEditedEntityRecord('postType', postType, postId);
	} catch {
		// Navigation may still proceed (missing entity, permissions, etc.).
	}
}

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
 * Cross-boundary switches (post.php → site-editor document) use
 * onNavigateToEntityRecord + pushState like same-app navigation. Core may then call
 * history.replaceState(post.php…), which would clobber the address bar; a short-lived
 * replaceState guard rewrites those URLs back to the target site-editor URL.
 * The guard is cleared at the start of every switch so it never blocks legitimate
 * site→post replaceState calls from a previous tab transition.
 * Same-context switches use onNavigateToEntityRecord where core supports it.
 * Full navigation (location.assign) is only the fallback when that callback is missing.
 *
 * IMPORTANT: When switching to a different post type, this hook ensures the post type
 * configuration is resolved first. This prevents the editor from unmounting and remounting,
 * which happens when getDefaultRenderingMode returns undefined (while waiting for post type
 * resolution).
 *
 * Site editor: `onNavigateToEntityRecord` navigates to `/{postType}/{postId}`. Core did not
 * register `/post/:postId` (only `/page/:postId`), which caused a blank canvas; Blockera
 * registers the missing `post-item` route (see SiteEditorPostItemRouteRegistration and
 * `../site-editor-post-item-route.md`). While still inside the site editor, do not
 * `pushState` to post.php — that desyncs the router from the loaded app.
 *
 * @return Function to switch to a document: (postType, postId) => void
 */
export function useSwitchDocument(): (
	postType: string,
	postId: string | number
) => Promise<void> {
	const onNavigateToEntityRecord = useSelect((select) => {
		const editorSettings = (
			select(editorStore) as { getEditorSettings: () => EditorSettings }
		).getEditorSettings();
		return editorSettings?.onNavigateToEntityRecord;
	}, []);

	const currentPostType = useSelect(
		(select) =>
			(
				select(editorStore) as {
					getCurrentPostType: () => string | undefined;
				}
			).getCurrentPostType(),
		[]
	);

	// Check if post type config is already resolved
	const hasPostTypeResolved = useSelect(
		(select) =>
			(postType: string): boolean => {
				return (
					select(coreStore) as {
						hasFinishedResolution: (
							selector: string,
							args: string[]
						) => boolean;
					}
				).hasFinishedResolution('getPostType', [postType]);
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
				const resolved = resolveSelect(coreStore) as {
					getPostType: (postType: string) => Promise<unknown>;
				};
				await resolved.getPostType(postType);
			} catch {
				// Silently fail - post type might not exist
			}
		},
		[hasPostTypeResolved]
	);

	return async (postType: string, postId: string | number): Promise<void> => {
		clearPostToSiteReplaceGuard();
		// If switching to a different post type, ensure post type config is resolved first
		if (currentPostType && currentPostType !== postType) {
			// CRITICAL: Ensure post type configuration is resolved BEFORE navigation
			// This prevents the editor from unmounting/remounting when switching post types
			// because getDefaultRenderingMode won't return undefined while waiting for resolution
			await ensurePostTypeResolved(postType);
		}

		await ensureTargetEntityRecordLoaded(postType, postId);

		const targetContext = getEditorContextForPostType(postType);
		const currentContext = getCurrentEditorContext();

		// Always prefer onNavigateToEntityRecord if available - it handles navigation
		// without page reload in same-context navigation.
		if (onNavigateToEntityRecord) {
			try {
				onNavigateToEntityRecord({ postId, postType });

				// Update browser URL to match the current document
				// Always update for site editor types
				// Also update for post types when coming from a different editor context
				const isSiteEditorType = targetContext === 'site';
				const isContextChange =
					currentContext !== null && currentContext !== targetContext;

				if (isSiteEditorType || isContextChange) {
					// Keep site editor on `?p=/post|page/...` URLs; pushing post.php breaks the app.
					if (currentContext === 'site' && targetContext === 'post') {
						return;
					}
					const editorUrl = getEditorUrl(postType, postId);
					if (currentContext === 'post' && targetContext === 'site') {
						activatePostToSiteReplaceGuard(editorUrl);
					}
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
								const expectedPostId =
									urlObj.searchParams.get('post');
								const currentPostId =
									currentUrlObjAfter.searchParams.get('post');
								urlMatches =
									currentUrl.includes('post.php') &&
									currentPostId === expectedPostId;
							} else {
								const expectedPostType =
									urlObj.searchParams.get('postType');
								const expectedPostIdParam =
									urlObj.searchParams.get('postId');
								const currentPostTypeParam =
									currentUrlObjAfter.searchParams.get(
										'postType'
									);
								const currentPostIdParam =
									currentUrlObjAfter.searchParams.get(
										'postId'
									);
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
		window.location.assign(getEditorUrl(postType, postId));
	};
}
