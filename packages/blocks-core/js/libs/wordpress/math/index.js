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

export const Math: BlockType = {
	name: 'blockeraMath',
	targetBlock: 'core/math',
	edit: (props) => {
		return <SharedBlockExtension {...props} />;
	},
};
