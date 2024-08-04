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

export const Details: BlockType = {
	name: 'blockeraDetails',
	targetBlock: 'core/details',
	blockeraInnerBlocks: {
		'core/paragraph': sharedInnerBlocks['core/paragraph'],
		'elements/link': sharedInnerBlocks['elements/link'],
	},
	edit: (props) => {
		return <SharedBlockExtension {...props} />;
	},
};
