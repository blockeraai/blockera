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

export const PostTimeToRead: BlockType = {
	name: 'blockeraPostTimeToRead',
	targetBlock: 'core/post-time-to-read',
	edit: (props) => {
		return <SharedBlockExtension {...props} />;
	},
};
