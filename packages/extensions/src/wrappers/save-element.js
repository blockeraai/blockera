/**
 * WordPress dependencies
 */
import { applyFilters } from '@wordpress/hooks';

/**
 * Internal dependencies
 */
import { getBlockEditorProp } from './utils';

const withCustomizeSaveElement = (element, blockType, attributes) => {
	if (!element) {
		return;
	}

	/**
	 * Allowed Block Types in Publisher Extensions Setup
	 */
	const allowedBlockTypes = applyFilters(
		'publisher.core.extensions.allowedBlockTypes',
		[]
	);

	if (!allowedBlockTypes.includes(blockType?.name)) {
		return element;
	}

	const callbacks = getBlockEditorProp(blockType?.name);
	const { saveElement } = callbacks;

	if ('function' !== typeof saveElement) {
		return element;
	}

	return saveElement({ element, blockType, attributes });
};

export default withCustomizeSaveElement;
