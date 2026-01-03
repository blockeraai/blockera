/**
 * WordPress dependencies
 */
import { useSelect, useDispatch } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';
import { store as editorStore } from '@wordpress/editor';
import { useState } from '@wordpress/element';

/**
 * Dirty entity record from core-data store.
 */
interface DirtyRecord {
	kind: string;
	name: string;
	key: number | string;
}

/**
 * Return type for useSaveAll hook.
 */
export interface UseSaveAllReturn {
	/** Function to save all dirty entities. */
	saveAll: () => Promise<void>;
	/** Whether currently saving. */
	isSaving: boolean;
	/** Whether there are dirty records to save. */
	hasDirtyRecords: boolean;
}

/**
 * Hook to save all dirty entities
 *
 * @returns Object with saveAll function and isSaving state
 */
export function useSaveAll(): UseSaveAllReturn {
	const [isSaving, setIsSaving] = useState(false);

	const dirtyRecords = useSelect((select) => {
		return (select(coreStore) as { __experimentalGetDirtyEntityRecords: () => DirtyRecord[] }).__experimentalGetDirtyEntityRecords();
	}, []);

	const { saveEntityRecord } = useDispatch(coreStore) as {
		saveEntityRecord: (kind: string, name: string, key: number | string) => Promise<void>;
	};
	const { savePost } = useDispatch(editorStore) as {
		savePost: () => Promise<void>;
	};
	const currentPostId = useSelect(
		(select) => (select(editorStore) as { getCurrentPostId: () => number | undefined }).getCurrentPostId(),
		[]
	);
	const currentPostType = useSelect(
		(select) => (select(editorStore) as { getCurrentPostType: () => string | undefined }).getCurrentPostType(),
		[]
	);

	const saveAll = async (): Promise<void> => {
		if (!dirtyRecords || dirtyRecords.length === 0) {
			return;
		}

		setIsSaving(true);

		try {
			const savePromises = dirtyRecords.map(async (record) => {
				const { kind, name, key } = record;

				// If it's the current post, use savePost action
				if (kind === 'postType' && name === currentPostType && key === currentPostId) {
					await savePost();
				} else if (kind === 'postType') {
					// Save other post type entities
					await saveEntityRecord(kind, name, key);
				}
			});

			await Promise.all(savePromises);
		} catch {
			// Error saving - WordPress will show error notification
		} finally {
			setIsSaving(false);
		}
	};

	return {
		saveAll,
		isSaving,
		hasDirtyRecords: Boolean(dirtyRecords && dirtyRecords.length > 0),
	};
}

