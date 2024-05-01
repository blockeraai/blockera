/**
 * WordPress dependencies
 */
import { select } from '@wordpress/data';
import {
	unregisterBlockType,
	registerBlockType,
	createBlock,
} from '@wordpress/blocks';

/**
 * Blockera dependencies
 */
import { isUndefined } from '@blockera/utils';

/**
 * Internal dependencies
 */
import { withBlockSettings } from '@blockera/editor-extensions';

export function createBlockEditorContent({
	wrapperBlockName,
	blockName,
	attributes,
}) {
	let block;
	const blockType = select('core/blocks').getBlockType(blockName);

	if (!blockType?.attributes?.blockeraPropsId) {
		unregisterBlockType(blockName);
		registerBlockType(blockName, withBlockSettings(blockType, blockName));

		block = createBlock(blockName, attributes);
	} else {
		block = createBlock(blockName, attributes);
	}

	return isUndefined(wrapperBlockName)
		? block
		: createBlock(wrapperBlockName, {}, [block]);
}
