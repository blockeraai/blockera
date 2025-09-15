// @flow

/**
 * External dependencies
 */
import { select, dispatch, subscribe } from '@wordpress/data';

/**
 * Internal dependencies
 */
import { STORE_NAME as blockeraEditorStore } from '../../../store/constants';

// Keep track of the previously selected block
let previouslySelectedBlockClientId = null;

// Subscribe to block selection changes
export const unsubscribe = subscribe(() => {
	// Get the currently selected block
	const selectedBlock = select('core/block-editor').getSelectedBlock();
	// Get the interface selectors
	const activeComplementaryArea =
		select('core/interface').getActiveComplementaryArea('core');

	// If there's a selected block and it's different from the previous one
	if (
		selectedBlock &&
		selectedBlock.clientId !== previouslySelectedBlockClientId
	) {
		// Update the previously selected block ID
		previouslySelectedBlockClientId = selectedBlock.clientId;

		if ('edit-site/global-styles' !== activeComplementaryArea) {
			return;
		}

		// Set the selected block style
		const { setSelectedBlockStyle } = dispatch(blockeraEditorStore);

		setSelectedBlockStyle(selectedBlock.name);
	}
});
