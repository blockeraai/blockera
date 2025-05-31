// @flow

/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Blockera dependencies
 */
import {
	SharedBlockExtension,
	generalBlockStates,
	sharedBlockStates,
} from '@blockera/editor';
import { Icon } from '@blockera/icons';

/**
 * Internal dependencies
 */
import type { BlockType } from '../../type';

export const CommentsPaginationPrevious: BlockType = {
	name: 'blockeraCommentsPaginationPrevious',
	targetBlock: 'core/comments-pagination-previous',
	blockeraInnerBlocks: {
		'elements/arrow': {
			name: 'elements/arrow',
			label: __('Arrow', 'blockera'),
			description: __(
				'The pagination previous arrow element.',
				'blockera'
			),
			icon: <Icon icon="block-pagination-previous-arrow" size="20" />,
			settings: {
				force: true,
			},
		},
	},
	availableBlockStates: {
		...generalBlockStates,
		focus: {
			...generalBlockStates.focus,
			force: true,
		},
		active: {
			...sharedBlockStates.active,
			force: true,
		},
		visited: sharedBlockStates.visited,
	},
	edit: (props) => {
		return <SharedBlockExtension {...props} />;
	},
};
