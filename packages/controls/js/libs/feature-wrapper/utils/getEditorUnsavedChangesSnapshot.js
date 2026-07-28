// @flow

/**
 * Read the current editor unsaved state directly from data stores.
 *
 * Used at install completion time to avoid stale React closures.
 */
export function getEditorUnsavedChangesSnapshot(): {
	hasUnsavedChanges: boolean,
	isSaveable: boolean,
} {
	try {
		const data =
			typeof window !== 'undefined' && window.wp && window.wp.data
				? window.wp.data
				: null;

		if (!data || typeof data.select !== 'function') {
			return {
				hasUnsavedChanges: false,
				isSaveable: false,
			};
		}

		const coreSelect = data.select('core');
		const editorSelect = data.select('core/editor');

		if (!coreSelect || !editorSelect) {
			return {
				hasUnsavedChanges: false,
				isSaveable: false,
			};
		}

		const dirtyRecords =
			typeof coreSelect.__experimentalGetDirtyEntityRecords === 'function'
				? coreSelect.__experimentalGetDirtyEntityRecords() || []
				: [];

		const postId =
			typeof editorSelect.getCurrentPostId === 'function'
				? editorSelect.getCurrentPostId()
				: undefined;
		const postType =
			typeof editorSelect.getCurrentPostType === 'function'
				? editorSelect.getCurrentPostType()
				: undefined;

		let currentPostDirty = false;

		if (
			postId &&
			postType &&
			typeof coreSelect.hasEditsForEntityRecord === 'function'
		) {
			currentPostDirty = coreSelect.hasEditsForEntityRecord(
				'postType',
				postType,
				postId
			);
		}

		const isEditedPostDirty =
			typeof editorSelect.isEditedPostDirty === 'function'
				? editorSelect.isEditedPostDirty()
				: false;

		const isSaveable =
			typeof editorSelect.isEditedPostSaveable === 'function'
				? editorSelect.isEditedPostSaveable()
				: false;

		const hasDirtyRecords = dirtyRecords.length > 0;
		const hasUnsavedChanges =
			hasDirtyRecords ||
			currentPostDirty ||
			isEditedPostDirty ||
			(isSaveable && (currentPostDirty || isEditedPostDirty));

		return {
			hasUnsavedChanges,
			isSaveable,
		};
	} catch {
		return {
			hasUnsavedChanges: false,
			isSaveable: false,
		};
	}
}
