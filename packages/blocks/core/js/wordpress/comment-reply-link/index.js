// @flow
/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Blockera dependencies
 */
import { SharedBlockExtension } from '@blockera/editor';

/**
 * Internal dependencies
 */
import sharedInnerBlocks from '../inners/shared';
import type { BlockType } from '../../type';

export const CommentReplyLink: BlockType = {
	name: 'blockeraCommentReplyLink',
	targetBlock: 'core/comment-reply-link',
	blockeraInnerBlocks: {
		'elements/link': {
			...sharedInnerBlocks['elements/link'],
			label: __('Link', 'blockera'),
			description: __('Hyperlink element.', 'blockera'),
		},
	},
	edit: (props) => {
		return <SharedBlockExtension {...props} />;
	},
};
