// @flow

/**
 * Blockera dependencies
 */
import { SharedBlockExtension } from '@blockera/editor';

/**
 * Internal dependencies
 */
import type { BlockType } from '../../type';

export const CommentTemplate: BlockType = {
	name: 'blockeraCommentTemplate',
	targetBlock: 'core/comment-template',
	edit: (props) => {
		return <SharedBlockExtension {...props} />;
	},
};
