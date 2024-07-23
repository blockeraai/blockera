// @flow

/**
 * External dependencies
 */
import type { MixedElement } from 'react';

/**
 * Blockera dependencies
 */
import {
	SharedBlockExtension,
	sharedBlockExtensionSupports,
	sharedBlockExtensionAttributes,
} from '@blockera/editor';

/**
 * Internal dependencies
 */
import arrow from '../inners/arrow';

// We not needs to "next-arrow" in "comments-pagination-previous" block!
delete arrow['next-arrow'];

export const CommentsPaginationPrevious = {
	name: 'blockeraCommentsPaginationPrevious',
	targetBlock: 'core/comments-pagination-previous',
	blockeraInnerBlocks: arrow,
	edit: (props: Object): MixedElement => {
		return <SharedBlockExtension {...props} />;
	},
};
