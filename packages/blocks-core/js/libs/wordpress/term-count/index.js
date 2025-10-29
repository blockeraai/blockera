// @flow

/**
 * Blockera dependencies
 */
import { SharedBlockExtension } from '@blockera/editor';

/**
 * Internal dependencies
 */
import sharedInnerBlocks from '../inners/shared';
import type { BlockType } from '../../../type';

export const TermCount: BlockType = {
	name: 'blockeraTermCount',
	targetBlock: 'core/term-count',
	edit: (props) => {
		return <SharedBlockExtension {...props} />;
	},
};
