// @flow

/**
 * Blockera dependencies
 */
import { SharedBlockExtension } from '@blockera/editor';

/**
 * Internal dependencies
 */
import sharedInnerBlocks from '../inners/shared';
import type { BlockType } from '../../type';

export const File: BlockType = {
	name: 'blockeraFile',
	targetBlock: 'core/file',
	blockeraInnerBlocks: {
		'elements/link': sharedInnerBlocks['elements/link'],
		'core/button': sharedInnerBlocks['core/button'],
	},
	edit: (props) => {
		return <SharedBlockExtension {...props} />;
	},
};
