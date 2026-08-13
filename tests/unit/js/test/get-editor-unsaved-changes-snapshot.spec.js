/**
 * Internal dependencies
 */
import { getEditorUnsavedChangesSnapshot } from '../../../../packages/global-packages/packages/controls/js/libs/feature-wrapper/utils/getEditorUnsavedChangesSnapshot';

describe('getEditorUnsavedChangesSnapshot', () => {
	const originalWp = window.wp;

	afterEach(() => {
		window.wp = originalWp;
	});

	it('returns a safe empty snapshot when wp.data is missing', () => {
		delete window.wp;

		expect(getEditorUnsavedChangesSnapshot()).toEqual({
			hasUnsavedChanges: false,
			isSaveable: false,
		});
	});

	it('returns empty when core or editor selectors are unavailable', () => {
		window.wp = {
			data: {
				select: () => null,
			},
		};

		expect(getEditorUnsavedChangesSnapshot()).toEqual({
			hasUnsavedChanges: false,
			isSaveable: false,
		});
	});

	it('flags unsaved work from dirty entity records or the edited post', () => {
		const coreSelect = {
			__experimentalGetDirtyEntityRecords: () => [{ key: 'post' }],
			hasEditsForEntityRecord: () => false,
		};
		const editorSelect = {
			getCurrentPostId: () => 12,
			getCurrentPostType: () => 'page',
			isEditedPostDirty: () => false,
			isEditedPostSaveable: () => true,
		};

		window.wp = {
			data: {
				select: (store) => {
					if (store === 'core') {
						return coreSelect;
					}
					if (store === 'core/editor') {
						return editorSelect;
					}
					return null;
				},
			},
		};

		expect(getEditorUnsavedChangesSnapshot()).toEqual({
			hasUnsavedChanges: true,
			isSaveable: true,
		});

		coreSelect.__experimentalGetDirtyEntityRecords = () => [];
		editorSelect.isEditedPostDirty = () => true;

		expect(getEditorUnsavedChangesSnapshot()).toEqual({
			hasUnsavedChanges: true,
			isSaveable: true,
		});
	});

	it('does not treat a clean, saveable post as unsaved', () => {
		window.wp = {
			data: {
				select: (store) => {
					if (store === 'core') {
						return {
							__experimentalGetDirtyEntityRecords: () => [],
							hasEditsForEntityRecord: () => false,
						};
					}
					if (store === 'core/editor') {
						return {
							getCurrentPostId: () => 1,
							getCurrentPostType: () => 'post',
							isEditedPostDirty: () => false,
							isEditedPostSaveable: () => true,
						};
					}
					return null;
				},
			},
		};

		expect(getEditorUnsavedChangesSnapshot()).toEqual({
			hasUnsavedChanges: false,
			isSaveable: true,
		});
	});

	it('returns empty when selector access throws', () => {
		window.wp = {
			data: {
				select: () => {
					throw new Error('store unavailable');
				},
			},
		};

		expect(getEditorUnsavedChangesSnapshot()).toEqual({
			hasUnsavedChanges: false,
			isSaveable: false,
		});
	});
});
