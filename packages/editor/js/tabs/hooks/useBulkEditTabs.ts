/**
 * WordPress dependencies
 */
import { useEffect, useRef } from '@wordpress/element';

/**
 * Hook to detect bulk_edit_ids URL parameter and open posts as tabs
 *
 * @param addTab - Function to add a tab
 * @param prefetchEntity - Function to prefetch entity before adding tab
 * @param postType - Current post type (from first post in bulk edit)
 */
export function useBulkEditTabs(
	addTab: (
		postType: string,
		postId: number,
		title?: string | null,
		slug?: string | null,
		status?: string | null
	) => Promise<void>,
	prefetchEntity: (
		postType: string | null | undefined,
		postId: string | number | null | undefined
	) => Promise<unknown>,
	postType: string | null | undefined
): void {
	const hasProcessed = useRef(false);

	useEffect(() => {
		// Only process once on mount
		if (hasProcessed.current) {
			return;
		}

		// Get bulk_edit_ids from sessionStorage (captured before editor initialized)
		// Fallback to URL parameters, then to global variable
		let bulkEditIds: string | null = null;
		let storedPostType: string | null = null;

		// Try sessionStorage first (captured by inline script before editor loads)
		if (typeof Storage !== 'undefined') {
			try {
				bulkEditIds = sessionStorage.getItem(
					'blockera_tabs_bulk_edit_ids'
				);
				storedPostType = sessionStorage.getItem(
					'blockera_tabs_bulk_edit_post_type'
				);
				// Clear from sessionStorage after reading
				if (bulkEditIds) {
					sessionStorage.removeItem('blockera_tabs_bulk_edit_ids');
					sessionStorage.removeItem(
						'blockera_tabs_bulk_edit_post_type'
					);
				}
			} catch {
				// sessionStorage might be disabled
			}
		}

		// Fallback to global variable (set by inline script)
		if (!bulkEditIds && window.blockeraTabsBulkEditIds) {
			bulkEditIds = window.blockeraTabsBulkEditIds;
			storedPostType = window.blockeraTabsBulkEditPostType ?? null;
			// Clear global variables
			delete window.blockeraTabsBulkEditIds;
			delete window.blockeraTabsBulkEditPostType;
		}

		// Final fallback to URL parameters (in case storage didn't work)
		if (!bulkEditIds) {
			const urlParams = new URLSearchParams(window.location.search);
			bulkEditIds = urlParams.get('bulk_edit_ids');
		}

		// Use stored post type if available, otherwise use current postType
		const targetPostType = storedPostType ?? postType;

		// If no bulk edit IDs, nothing to do
		if (!bulkEditIds || !targetPostType) {
			hasProcessed.current = true;
			return;
		}

		// Parse comma-separated post IDs
		const postIds = bulkEditIds
			.split(',')
			.map((id) => parseInt(id, 10))
			.filter((id) => !isNaN(id) && id > 0);

		// If no valid post IDs, nothing to do
		if (postIds.length === 0) {
			hasProcessed.current = true;
			// Clean up URL parameter
			const newUrl = new URL(window.location.href);
			newUrl.searchParams.delete('bulk_edit_ids');
			window.history.replaceState({}, '', newUrl.toString());
			return;
		}

		// Mark as processed immediately to prevent duplicate processing
		hasProcessed.current = true;

		// Open each post as a tab
		// Use setTimeout to ensure current post is loaded first
		setTimeout(() => {
			void (async (): Promise<void> => {
				for (const postId of postIds) {
					try {
						// Prefetch entity data before adding tab
						await prefetchEntity(targetPostType, postId);
						// Add tab (addTab handles duplicate checking)
						await addTab(targetPostType, postId);
					} catch (error) {
						// Silently skip posts that can't be loaded
						// (e.g., deleted, permission denied, etc.)
						// @debug-ignore
						// eslint-disable-next-line no-console
						console.warn(
							`Blockera Tabs: Could not open post ${postId} in bulk edit:`,
							error
						);
					}
				}

				// Clean up URL parameter after processing (if it still exists)
				const urlParams = new URLSearchParams(window.location.search);
				if (urlParams.has('bulk_edit_ids')) {
					const newUrl = new URL(window.location.href);
					newUrl.searchParams.delete('bulk_edit_ids');
					window.history.replaceState({}, '', newUrl.toString());
				}
			})();
		}, 100);
	}, [addTab, prefetchEntity, postType]);
}
