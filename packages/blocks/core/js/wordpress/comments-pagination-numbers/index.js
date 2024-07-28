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
import paginationNumbers from '../inners/pagination-numbers';

export const CommentsPaginationNumbers = {
	name: 'blockeraCommentsPaginationNumbers',
	targetBlock: 'core/comments-pagination-numbers',
	blockeraInnerBlocks: paginationNumbers,
	edit: (props: Object): MixedElement => {
		return <SharedBlockExtension {...props} />;
	},
};
