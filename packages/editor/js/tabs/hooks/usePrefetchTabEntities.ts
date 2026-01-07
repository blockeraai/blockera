/**
 * WordPress dependencies
 */
import { useEffect, useRef } from '@wordpress/element';
import { resolveSelect } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';

/**
 * Internal dependencies
 */
import { extractImageUrlsFromBlocks } from '../utils/extractImageUrlsFromBlocks';
import { prefetchImages } from '../utils/prefetchImages';
import type { Tab } from '../types';

/**
 * Maximum number of concurrent prefetch requests
 * This prevents overwhelming the network and browser
 */
const MAX_CONCURRENT_REQUESTS = 5;

/**
 * Batch delay between prefetch batches (in milliseconds)
 * This allows the browser to process other tasks between batches
 */
const BATCH_DELAY_MS = 100;

/**
 * Entity record with content.
 */
interface EntityRecordWithContent {
	content?: {
		raw?: string;
	};
}

/**
 * Pre-fetch post type configurations for all unique post types in tabs.
 * This is critical for preventing editor re-mounts when switching between
 * different post types, as the editor's getDefaultRenderingMode selector
 * requires the post type configuration to be resolved.
 *
 * @param tabs - Array of tab objects with type property
 * @return Promise that resolves when all post types are prefetched
 */
async function prefetchPostTypeConfigs(tabs: Tab[]): Promise<void> {
	// Get unique post types from tabs
	const uniquePostTypes = [...new Set(tabs.map((tab) => tab.type))];

	// Prefetch all post type configurations in parallel
	// This ensures getDefaultRenderingMode won't return undefined when switching tabs
	const prefetchPromises = uniquePostTypes.map(async (postType) => {
		try {
			// resolveSelect triggers the resolution if not already cached
			const resolved = resolveSelect(coreStore) as {
				getPostType: (postType: string) => Promise<unknown>;
			};
			await resolved.getPostType(postType);
		} catch {
			// Silently fail - post type might not exist or be accessible
		}
	});

	await Promise.all(prefetchPromises);
}

/**
 * Pre-fetch a single entity record and its images
 *
 * @param tab - Tab object with type and id properties
 * @return Promise that resolves when the entity is fetched (or fails silently)
 */
async function prefetchEntity(tab: Tab): Promise<void> {
	try {
		// resolveSelect will automatically fetch the entity if it's not in the store
		// If it's already loaded, it will return immediately without a network request
		const resolved = resolveSelect(coreStore) as {
			getEntityRecord: (
				kind: string,
				name: string,
				id: string | number
			) => Promise<EntityRecordWithContent | undefined>;
		};
		const entity = await resolved.getEntityRecord(
			'postType',
			tab.type,
			tab.id
		);

		// After entity is fetched, extract and prefetch images asynchronously
		// This runs in the background and doesn't block entity prefetching
		if (entity?.content?.raw) {
			try {
				// Extract image URLs directly from raw content using regex (fast and simple)
				const imageUrls = extractImageUrlsFromBlocks(
					entity.content.raw
				);

				// Prefetch images asynchronously (fire-and-forget pattern)
				// This doesn't block and runs in the background
				if (imageUrls && imageUrls.length > 0) {
					prefetchImages(imageUrls);
				}
			} catch {
				// Silently fail - extraction errors shouldn't break prefetching
				// This can happen if content.raw is in unexpected format
			}
		}
	} catch {
		// Silently fail - entity might not exist or be accessible
		// This is expected for some edge cases and shouldn't break the UI
	}
}

/**
 * Process tabs in batches to avoid overwhelming the network
 * Each batch runs concurrently, with a delay between batches
 * This function runs asynchronously and doesn't block the UI thread
 *
 * @param tabsToPrefetch - Array of tab objects to prefetch
 */
async function prefetchTabsInBatches(tabsToPrefetch: Tab[]): Promise<void> {
	// Process tabs in batches to limit concurrent network requests
	for (let i = 0; i < tabsToPrefetch.length; i += MAX_CONCURRENT_REQUESTS) {
		const batch = tabsToPrefetch.slice(i, i + MAX_CONCURRENT_REQUESTS);

		// Execute current batch in parallel (up to MAX_CONCURRENT_REQUESTS at a time)
		// Await the batch to ensure we don't start more than MAX_CONCURRENT_REQUESTS at once
		await Promise.all(batch.map(prefetchEntity)).catch(() => {
			// Silently handle batch errors - continue with next batch
		});

		// Small delay before starting the next batch to give the browser time to process
		// other tasks (except for the last batch where it's unnecessary)
		if (i + MAX_CONCURRENT_REQUESTS < tabsToPrefetch.length) {
			// Use requestAnimationFrame to yield to the browser, then setTimeout for delay
			await new Promise<void>((resolve) => {
				requestAnimationFrame(() => {
					setTimeout(resolve, BATCH_DELAY_MS);
				});
			});
		}
	}
}

/**
 * Hook to pre-fetch entity records for all tabs on initial page load
 *
 * This hook ensures that entity data for all tabs is loaded into the editor context
 * when the page loads, making tab switching instant instead of requiring REST API requests.
 *
 * The prefetching runs asynchronously in the background using requestIdleCallback
 * (or setTimeout fallback) to avoid blocking the UI thread. Requests are batched
 * to prevent overwhelming the network.
 *
 * IMPORTANT: This hook also prefetches post type configurations for all unique post types
 * in tabs. This is critical because the editor's getDefaultRenderingMode selector requires
 * the post type configuration to be resolved. Without this, switching to a tab with a
 * different post type (e.g., from 'post' to 'page') causes the entire editor to unmount
 * and remount, creating a jarring full re-render experience.
 *
 * @param tabs - Array of tab objects with type and id properties
 * @param currentPostType - Current post type (to skip pre-fetching)
 * @param currentPostId - Current post ID (to skip pre-fetching)
 */
export function usePrefetchTabEntities(
	tabs: Tab[],
	currentPostType: string | null | undefined,
	currentPostId: string | number | null | undefined
): void {
	const hasPrefetched = useRef(false);

	useEffect(() => {
		// Only pre-fetch once on initial mount
		if (hasPrefetched.current) {
			return;
		}

		// Don't pre-fetch if we don't have tabs or current document info
		// Wait until both are available before pre-fetching
		if (!tabs || tabs.length === 0 || !currentPostType || !currentPostId) {
			return;
		}

		// Mark as prefetched to prevent multiple runs
		hasPrefetched.current = true;

		// Filter tabs to prefetch (exclude current tab)
		const tabsToPrefetch = tabs.filter((tab) => {
			// Skip the current tab - it's already loaded
			return !(
				tab.type === currentPostType &&
				String(tab.id) === String(currentPostId)
			);
		});

		// Use requestIdleCallback if available to run during browser idle time
		// This ensures prefetching doesn't interfere with UI rendering/interactions
		// Fallback to setTimeout if requestIdleCallback is not available
		const schedulePrefetch = (callback: () => void): void => {
			if (typeof requestIdleCallback !== 'undefined') {
				requestIdleCallback(callback, { timeout: 2000 });
			} else {
				// Fallback: defer slightly to let initial render complete
				setTimeout(callback, 0);
			}
		};

		// Schedule prefetching to run asynchronously without blocking
		schedulePrefetch(() => {
			void (async (): Promise<void> => {
				// CRITICAL: First, prefetch post type configurations for all tabs
				// This must complete before entity prefetching because the editor's
				// getDefaultRenderingMode selector requires the post type config to be resolved.
				// Without this, switching between different post types causes the editor to
				// unmount and remount (because mode becomes undefined while post type resolves).
				try {
					await prefetchPostTypeConfigs(tabs);
				} catch {
					// Silently handle errors - shouldn't break entity prefetching
				}

				// Now prefetch entity records for tabs (if any need prefetching)
				if (tabsToPrefetch.length > 0) {
					// Start prefetching in batches (non-blocking)
					void prefetchTabsInBatches(tabsToPrefetch).catch(() => {
						// Silently handle any errors - prefetching failures shouldn't break the UI
					});
				}
			})();
		});
	}, [tabs, currentPostType, currentPostId]);
}
