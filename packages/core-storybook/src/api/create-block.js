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
 * Internal dependencies
 */
import { withBlockSettings } from '@publisher/extensions';

export function createBlockEditorContent(
	wrapperBlockName,
	blockName,
	attributes
) {
	let block = {};
	const blockType = select('core/blocks').getBlockType(blockName);

	if (!blockType.hasOwnProperty('publisherEditorProps')) {
		unregisterBlockType(blockName);
		registerBlockType(blockName, withBlockSettings(blockType, blockName));

		block = createBlock(blockName, attributes);
	} else {
		block = createBlock(blockName, attributes);
	}

	const wrapperBlock = createBlock(wrapperBlockName);

	wrapperBlock.innerBlocks.push(block);

	return wrapperBlock;
}
