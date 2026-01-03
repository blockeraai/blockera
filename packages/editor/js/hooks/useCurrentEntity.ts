/**
 * Hook to get entity data for the current editor document.
 *
 * This is a convenience wrapper around useEntity that automatically
 * detects the current postType and postId from the editor store.
 *
 * @example
 * // Get entity data for the currently active document
 * const currentEntity = useCurrentEntity();
 *
 * // Access current document properties
 * console.log(currentEntity.type);   // "post"
 * console.log(currentEntity.id);     // 123
 * console.log(currentEntity.title);  // "My Post Title"
 * console.log(currentEntity.dirty);  // true if has unsaved changes
 *
 * @package
 */

/**
 * WordPress dependencies
 */
import { useSelect } from '@wordpress/data';
import { store as editorStore } from '@wordpress/editor';

/**
 * Internal dependencies
 */
import { useEntity } from './useEntity';
import type { UseEntityReturn } from './useEntity';

/**
 * Hook to get comprehensive entity data for the current editor document.
 *
 * @returns Same return shape as useEntity.
 */
export function useCurrentEntity(): UseEntityReturn {
	// Get current document identifiers from editor store.
	// IMPORTANT: Select primitive values separately to avoid creating new object
	// references on every store update, which would cause unnecessary re-renders.
	const postId = useSelect(
		(select) =>
			(select(editorStore) as { getCurrentPostId: () => string | number | undefined })
				.getCurrentPostId(),
		[]
	);
	const postType = useSelect(
		(select) =>
			(select(editorStore) as { getCurrentPostType: () => string | undefined })
				.getCurrentPostType(),
		[]
	);

	// Use the main useEntity hook with current document identifiers
	return useEntity(postType, postId);
}

