// @flow

/**
 * Blockera dependencies
 */
import { SharedBlockExtension } from '@blockera/editor';

/**
 * Internal dependencies
 */
import type { BlockType } from '../../type';

export const CommentsTitle: BlockType = {
	name: 'blockeraCommentsTitle',
	targetBlock: 'core/comments-title',
	edit: (props) => {
		return <SharedBlockExtension {...props} />;
	},
};
