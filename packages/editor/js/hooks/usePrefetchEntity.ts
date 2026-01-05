/**
 * Hook to prefetch any entity before it's needed.
 *
 * This hook returns a function that can prefetch any entity data,
 * not bound to a specific postType/postId. This is essential for
 * preloading entities before switching tabs to ensure instant tab switching.
 *
 * @example
 * // Get the prefetch function
 * const prefetchEntity = usePrefetchEntity();
 *
 * // Prefetch multiple entities before switching tabs
 * await prefetchEntity('post', 123);
 * await prefetchEntity('page', 456);
 *
 * // Now switching to these tabs will be instant
 * switchDocument('post', 123);
 *
 * @package
 */

/**
 * WordPress dependencies
 */
import { resolveSelect } from '@wordpress/data';
import { useCallback } from '@wordpress/element';
import { store as coreStore } from '@wordpress/core-data';
import type { Post } from '@wordpress/core-data';

/**
 * Type for the prefetch function returned by usePrefetchEntity.
 */
export type PrefetchEntityFunction = (
	postType: string | null | undefined,
	postId: string | number | null | undefined
) => Promise<Post | null>;

/**
 * Hook to get a function that prefetches any entity.
 *
 * Unlike useEntity (which is bound to a specific entity),
 * this hook returns a function that can prefetch ANY entity by passing
 * postType and postId as arguments.
 *
 * @return Function (postType, postId) => Promise<Post | null>
 */
export function usePrefetchEntity(): PrefetchEntityFunction {
	/**
	 * Prefetch an entity to ensure it's loaded in the store.
	 *
	 * Uses resolveSelect which returns a Promise that resolves when the
	 * entity data is available in the store.
	 *
	 * @param postType - Post type (e.g., 'post', 'page', 'wp_template').
	 * @param postId - Post ID.
	 * @return Promise resolving to entity record or null.
	 */
	const prefetchEntity = useCallback(
		async (
			postType: string | null | undefined,
			postId: string | number | null | undefined
		): Promise<Post | null> => {
			if (!postType || !postId) {
				return null;
			}

			try {
				// resolveSelect returns a Promise that resolves when the selector resolves
				// This triggers the resolution if not already cached, and waits for it
				const resolvedStore = resolveSelect(coreStore);
				const record = await resolvedStore.getEntityRecord(
					'postType',
					postType,
					postId
				);

				return (record as Post) ?? null;
			} catch {
				// Entity might not exist or be accessible
				// Don't throw - just return null
				return null;
			}
		},
		[]
	);

	return prefetchEntity;
}
