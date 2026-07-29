// @flow

/**
 * External dependencies
 */
import { useSelect, useDispatch, select } from '@wordpress/data';
import { useCallback, useState } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { getEditorUnsavedChangesSnapshot } from '../utils/getEditorUnsavedChangesSnapshot';

const CORE_STORE = 'core';
const EDITOR_STORE = 'core/editor';

export type EditorUnsavedChangesState = {
	hasUnsavedChanges: boolean,
	isSaveable: boolean,
	isSaving: boolean,
	saveChanges: () => Promise<boolean>,
};

/**
 * Detect block editor dirty state and expose save-all helper for reload flows.
 *
 * Uses string store names so controls tests do not bundle @wordpress/editor.
 */
export function useEditorUnsavedChanges(): EditorUnsavedChangesState {
	const [isSaving, setIsSaving] = useState(false);

	const { dirtyRecords, isSaveable, isEditedPostDirty, currentPostDirty } =
		useSelect((select) => {
			try {
				const coreSelect = select(CORE_STORE);
				const editorSelect = select(EDITOR_STORE);

				if (
					!coreSelect ||
					!editorSelect ||
					typeof coreSelect.__experimentalGetDirtyEntityRecords !==
						'function'
				) {
					return {
						dirtyRecords: [],
						isSaveable: false,
						isEditedPostDirty: false,
						currentPostDirty: false,
					};
				}

				const postId =
					typeof editorSelect.getCurrentPostId === 'function'
						? editorSelect.getCurrentPostId()
						: undefined;
				const postType =
					typeof editorSelect.getCurrentPostType === 'function'
						? editorSelect.getCurrentPostType()
						: undefined;

				let currentPostHasEdits = false;

				if (
					postId &&
					postType &&
					typeof coreSelect.hasEditsForEntityRecord === 'function'
				) {
					currentPostHasEdits = coreSelect.hasEditsForEntityRecord(
						'postType',
						postType,
						postId
					);
				}

				return {
					dirtyRecords:
						coreSelect.__experimentalGetDirtyEntityRecords() || [],
					isSaveable:
						typeof editorSelect.isEditedPostSaveable === 'function'
							? editorSelect.isEditedPostSaveable()
							: false,
					isEditedPostDirty:
						typeof editorSelect.isEditedPostDirty === 'function'
							? editorSelect.isEditedPostDirty()
							: false,
					currentPostDirty: currentPostHasEdits,
				};
			} catch {
				return {
					dirtyRecords: [],
					isSaveable: false,
					isEditedPostDirty: false,
					currentPostDirty: false,
				};
			}
		}, []);

	const currentPostId = useSelect((select) => {
		try {
			const editorSelect = select(EDITOR_STORE);

			return typeof editorSelect?.getCurrentPostId === 'function'
				? editorSelect.getCurrentPostId()
				: undefined;
		} catch {
			return undefined;
		}
	}, []);

	const currentPostType = useSelect((select) => {
		try {
			const editorSelect = select(EDITOR_STORE);

			return typeof editorSelect?.getCurrentPostType === 'function'
				? editorSelect.getCurrentPostType()
				: undefined;
		} catch {
			return undefined;
		}
	}, []);

	const { saveEntityRecord } = useDispatch(CORE_STORE);
	const { savePost } = useDispatch(EDITOR_STORE);

	const saveChanges = useCallback(async (): Promise<boolean> => {
		const snapshot = getEditorUnsavedChangesSnapshot();

		if (!snapshot.hasUnsavedChanges) {
			return true;
		}

		setIsSaving(true);

		try {
			const coreSelect = select(CORE_STORE);
			const records =
				typeof coreSelect.__experimentalGetDirtyEntityRecords ===
				'function'
					? coreSelect.__experimentalGetDirtyEntityRecords() || []
					: [];

			if (records.length > 0) {
				await Promise.all(
					records.map(async (record) => {
						const { kind, name, key } = record;

						if (
							kind === 'postType' &&
							name === currentPostType &&
							key === currentPostId &&
							typeof savePost === 'function'
						) {
							await savePost();
							return;
						}

						if (
							kind === 'postType' &&
							typeof saveEntityRecord === 'function'
						) {
							await saveEntityRecord(kind, name, key);
						}
					})
				);
			} else if (snapshot.isSaveable && typeof savePost === 'function') {
				await savePost();
			}

			return true;
		} catch {
			return false;
		} finally {
			setIsSaving(false);
		}
	}, [currentPostId, currentPostType, saveEntityRecord, savePost]);

	const hasDirtyRecords = Boolean(dirtyRecords && dirtyRecords.length > 0);
	const hasUnsavedChanges =
		hasDirtyRecords ||
		Boolean(currentPostDirty) ||
		Boolean(isEditedPostDirty) ||
		(Boolean(isSaveable) &&
			(Boolean(currentPostDirty) || Boolean(isEditedPostDirty)));

	return {
		hasUnsavedChanges,
		isSaveable: Boolean(isSaveable),
		isSaving,
		saveChanges,
	};
}
