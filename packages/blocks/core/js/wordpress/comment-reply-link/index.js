// @flow

/**
 * External dependencies
 */
import type { MixedElement } from 'react';

/**
 * Blockera dependencies
 */
import { SharedBlockExtension } from '@blockera/editor';

/**
 * Internal dependencies
 */
import link from '../inners/link';

export const CommentReplyLink = {
	name: 'blockeraCommentReplyLink',
	targetBlock: 'core/comment-reply-link',
	blockeraInnerBlocks: link,
	edit: (props: Object): MixedElement => {
		return <SharedBlockExtension {...props} />;
	},
};
