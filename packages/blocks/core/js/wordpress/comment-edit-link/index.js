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
import link from '../inners/link';

const attributes = sharedBlockExtensionAttributes;

const supports = sharedBlockExtensionSupports;

export const CommentEditLink = {
	name: 'blockeraCommentEditLink',
	targetBlock: 'core/comment-edit-link',
	attributes,
	supports,
	blockeraInnerBlocks: link,
	edit: (props: Object): MixedElement => {
		return <SharedBlockExtension {...props} />;
	},
};
