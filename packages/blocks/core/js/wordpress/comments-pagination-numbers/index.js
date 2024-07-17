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
import paginationNumbers from '../inners/pagination-numbers';

const attributes = sharedBlockExtensionAttributes;

const supports = sharedBlockExtensionSupports;

export const CommentsPaginationNumbers = {
	name: 'blockeraCommentsPaginationNumbers',
	targetBlock: 'core/comments-pagination-numbers',
	attributes,
	supports,
	blockeraInnerBlocks: paginationNumbers,
	edit: (props: Object): MixedElement => {
		return <SharedBlockExtension {...props} />;
	},
};
