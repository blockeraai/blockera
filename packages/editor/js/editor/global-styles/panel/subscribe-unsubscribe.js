// @flow

/**
 * External dependencies
 */
import { select, dispatch, subscribe } from '@wordpress/data';

/**
 * Internal dependencies
 */
import { STORE_NAME as blockeraEditorStore } from '../../../store/constants';

// Keep track of the previously selected block and panel state
let previouslySelectedBlockClientId: ?string = null;
let previousPanelRef: ?string = null;

/**
 * Subscribe to block selection changes and automatically switch panel
 * when a different block is selected while the panel is open.
 * This simulates Gutenberg's default behavior where clicking a block
 * while the global styles panel is open switches to that block's panel.
 *
 * @return {Function} Unsubscribe function to clean up the subscription
 */
export const subscribeToBlockSelection = (): (() => void) => {
	return subscribe(() => {
		const blockEditorSelect = select('core/block-editor');
		const blockeraSelect = select(blockeraEditorStore);
		const blockeraDispatch = dispatch(blockeraEditorStore);

		// Get the currently selected block
		const selectedBlock = blockEditorSelect.getSelectedBlock();

		// Get the current panel state
		const selectedBlockRef = blockeraSelect.getSelectedBlockRef();

		// Reset tracking when panel closes (transitions away from 'edit-site/global-styles')
		// This ensures proper tracking when panel is reopened
		if (
			previousPanelRef === 'edit-site/global-styles' &&
			selectedBlockRef !== 'edit-site/global-styles'
		) {
			previouslySelectedBlockClientId = null;
		}

		// Track panel state for next iteration
		previousPanelRef = selectedBlockRef;

		// Only update when:
		// 1. Panel is currently open for a block ('edit-site/global-styles')
		// 2. A block is selected
		// 3. It's a different block than previously selected
		if (
			selectedBlockRef === 'edit-site/global-styles' &&
			selectedBlock &&
			selectedBlock.clientId !== previouslySelectedBlockClientId
		) {
			// Update the previously selected block ID
			previouslySelectedBlockClientId = selectedBlock.clientId;
			// Reset the selected block style/size variation to undefined.
			blockeraDispatch.setSelectedBlockStyleVariation(undefined);
			blockeraDispatch.setSelectedBlockSizeVariation(undefined);
			// Set the selected block style to the newly selected block's style.
			blockeraDispatch.setSelectedBlockStyle(selectedBlock.name);
			// Set the selected block ref to the global styles panel if it's not already set.
			blockeraDispatch.setSelectedBlockRef('edit-site/global-styles');
		}
	});
};
