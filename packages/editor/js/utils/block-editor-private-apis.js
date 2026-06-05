/**
 * WordPress dependencies
 */
import { dispatch } from '@wordpress/data';
import { store as blockEditorStore } from '@wordpress/block-editor';
import { __dangerousOptInToUnstableAPIsOnlyForCoreModules } from '@wordpress/private-apis';

const { unlock } = __dangerousOptInToUnstableAPIsOnlyForCoreModules(
	'I acknowledge private features are not for use in themes or plugins and doing so will break in the next version of WordPress.',
	'@wordpress/block-editor'
);

let unlockedBlockEditorDispatch = null;

const getUnlockedBlockEditorDispatch = () => {
	if (!unlockedBlockEditorDispatch) {
		unlockedBlockEditorDispatch = unlock(dispatch(blockEditorStore));
	}

	return unlockedBlockEditorDispatch;
};

/**
 * Requests a WordPress block-inspector tab via the block editor store.
 * Handled by `InspectorControlsTabs` (see Gutenberg source).
 *
 * @param {string} tabName WordPress tab name (`settings`, `styles`, `content`, `list`, …).
 * @param {Object} [options]   Optional tab configuration (e.g. `openPanel` for list view).
 */
export const requestWordPressInspectorTab = (tabName, options = {}) => {
	if (!tabName) {
		return;
	}

	const blockEditorDispatch = getUnlockedBlockEditorDispatch();

	if (typeof blockEditorDispatch?.requestInspectorTab === 'function') {
		blockEditorDispatch.requestInspectorTab(tabName, options);
	}
};
