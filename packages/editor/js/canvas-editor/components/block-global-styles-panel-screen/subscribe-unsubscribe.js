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
let previouslySelectedBlockClientId: ?string = null;

// Subscribe to block selection changes
export const unsubscribe: () => void = subscribe(() => {
	// Get the currently selected block
	const selectedBlock = select('core/block-editor').getSelectedBlock();

	// If there's a selected block and it's different from the previous one
	if (
		selectedBlock &&
		selectedBlock.clientId !== previouslySelectedBlockClientId
	) {
		// Update the previously selected block ID
		previouslySelectedBlockClientId = selectedBlock.clientId;

		// Set the selected block style
		const { setSelectedBlockStyle, setSelectedBlockRef } =
			dispatch(blockeraEditorStore);

		setSelectedBlockStyle(selectedBlock.name);
		setSelectedBlockRef('edit-post/block');
	}
});
