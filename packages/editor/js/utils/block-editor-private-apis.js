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
 * Unlocks private `core/block-editor` selectors for the current `select` registry.
 * Prefer this over deprecated `__unstableGetTemporarilyEditingAsBlocks`.
 *
 * @param {Function} select `select` from `useSelect` / `wp.data.select`.
 * @return {Object} Unlocked block editor selectors.
 */
export const unlockBlockEditorSelect = (select) => {
	return unlock(select(blockEditorStore));
};

/**
 * Client id of the content-only section currently being edited, if any.
 * Uses private `getEditedContentOnlySection` (WP 6.7+ / Gutenberg content-only APIs).
 *
 * @param {Function} select `select` from `useSelect` / `wp.data.select`.
 * @return {string|null} Edited section client id, or null.
 */
export const getEditedContentOnlySection = (select) => {
	const unlocked = unlockBlockEditorSelect(select);

	if (typeof unlocked?.getEditedContentOnlySection === 'function') {
		return unlocked.getEditedContentOnlySection() || null;
	}

	return null;
};

/**
 * Stops editing the active content-only section via private store actions.
 *
 * @return {boolean} Whether the private stop action was available and invoked.
 */
export const stopEditingContentOnlySection = () => {
	const blockEditorDispatch = getUnlockedBlockEditorDispatch();

	if (
		typeof blockEditorDispatch?.stopEditingContentOnlySection === 'function'
	) {
		blockEditorDispatch.stopEditingContentOnlySection();
		return true;
	}

	return false;
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
