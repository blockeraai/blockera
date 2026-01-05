/**
 * WordPress dependencies
 */
import { useEffect, useRef } from '@wordpress/element';
import { useSelect, useDispatch } from '@wordpress/data';
import { store as editorStore } from '@wordpress/editor';
import { store as blockEditorStore } from '@wordpress/block-editor';

/**
 * Internal dependencies
 */
import { isCrossBoundaryNavigation } from '../utils/editorContext';
import { isSiteEditorPostType } from '../../hooks';

/**
 * Hook to handle smooth editor transitions when switching between different post types.
 *
 * When switching between different post types (e.g., 'post' to 'page' or 'post' to 'wp_template'),
 * the editor needs to properly reset its state to avoid a jarring full re-render. This hook
 * detects post type changes and clears block selection and other editor state, which helps
 * the editor transition more smoothly.
 *
 * @param postType - Current post type
 * @param postId - Current post ID
 */
export function useEditorPostTypeTransition(
	postType: string | null | undefined,
	postId: string | number | null | undefined
): void {
	const previousPostTypeRef = useRef(postType);
	const { clearSelectedBlock } = useDispatch(blockEditorStore) as {
		clearSelectedBlock: () => void;
	};
	const { setIsListViewOpened, editPost } = useDispatch(editorStore) as {
		setIsListViewOpened: (isOpen: boolean) => void;
		editPost: (
			edits: Record<string, unknown>,
			options?: { undoIgnore?: boolean }
		) => void;
	};
	const isEditorReady = useSelect(
		(select) =>
			(
				select(editorStore) as {
					__unstableIsEditorReady: () => boolean;
				}
			).__unstableIsEditorReady(),
		[]
	);

	useEffect(() => {
		// Only act if editor is ready and we're switching to a different post type
		if (
			isEditorReady &&
			postType &&
			postId &&
			previousPostTypeRef.current &&
			previousPostTypeRef.current !== postType
		) {
			const previousPostType = previousPostTypeRef.current;
			const isCrossingBoundary = isCrossBoundaryNavigation(
				previousPostType,
				postType
			);
			const isSwitchingToSiteEditor = isSiteEditorPostType(postType);

			// Clear block selection to help editor transition smoothly
			// This prevents the editor from trying to maintain selection state
			// across post types, which can cause rendering issues
			clearSelectedBlock();

			// Close list view if open, as it's post-type specific
			setIsListViewOpened(false);

			// When crossing editor boundaries (post ↔ site editor) or switching to site editor types,
			// clear additional editor state that might cause issues
			if (isCrossingBoundary || isSwitchingToSiteEditor) {
				// Clear selection state from editor store
				// This helps prevent stale selection state when switching contexts
				editPost({ selection: undefined }, { undoIgnore: true });

				// For site editor types, clear selection immediately and again after a delay
				// The site editor uses router-based navigation which might need a moment to initialize
				if (isSwitchingToSiteEditor) {
					// Clear immediately
					clearSelectedBlock();

					// Clear again after navigation has had time to start
					// This ensures any state set during navigation is also cleared
					setTimeout(() => {
						clearSelectedBlock();
					}, 150);
				}
			}
		}

		// Update ref for next comparison
		previousPostTypeRef.current = postType;
	}, [
		postType,
		postId,
		isEditorReady,
		clearSelectedBlock,
		setIsListViewOpened,
		editPost,
	]);
}
