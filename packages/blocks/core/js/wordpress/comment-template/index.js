// @flow

/**
 * External dependencies
 */
import type { MixedElement } from 'react';

/**
 * Blockera dependencies
 */
import { SharedBlockExtension } from '@blockera/editor';

export const CommentTemplate = {
	name: 'blockeraCommentTemplate',
	targetBlock: 'core/comment-template',
	edit: (props: Object): MixedElement => {
		return <SharedBlockExtension {...props} />;
	},
};
