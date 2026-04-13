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

export const PostCommentsCount: BlockType = {
	name: 'blockeraPostCommentsCount',
	targetBlock: 'core/post-comments-count',
	edit: (props) => {
		return <SharedBlockExtension {...props} />;
	},
};
