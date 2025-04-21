// @flow

/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Blockera dependencies
 */
import { SharedBlockExtension } from '@blockera/editor';
import { Icon } from '@blockera/icons';

/**
 * Internal dependencies
 */
import type { BlockType } from '../../type';

export const CommentsPaginationNext: BlockType = {
	name: 'blockeraCommentsPaginationNext',
	targetBlock: 'core/comments-pagination-next',
	blockeraInnerBlocks: {
		'elements/arrow': {
			name: 'elements/arrow',
			label: __('Arrow', 'blockera'),
			description: __('The pagination next arrow element.', 'blockera'),
			icon: <Icon icon="block-pagination-next-arrow" size="20" />,
			settings: {
				force: true,
			},
		},
	},
	edit: (props) => {
		return <SharedBlockExtension {...props} />;
	},
};
