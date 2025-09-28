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
	generalInnerBlockStates,
	sharedBlockStates,
} from '@blockera/editor';
import { Icon } from '@blockera/icons';

/**
 * Internal dependencies
 */
import type { BlockType } from '../../../type';

export const CommentsPaginationNumbers: BlockType = {
	name: 'blockeraCommentsPaginationNumbers',
	targetBlock: 'core/comments-pagination-numbers',
	blockeraInnerBlocks: {
		'elements/numbers': {
			name: 'elements/numbers',
			label: __('Numbers', 'blockera'),
			description: __('All pagination number elements.', 'blockera'),
			icon: <Icon icon="block-pagination-numbers" size="20" />,
			settings: {
				force: true,
			},
			availableBlockStates: {
				...generalInnerBlockStates,
				focus: {
					...generalInnerBlockStates.focus,
					force: true,
				},
				active: {
					...sharedBlockStates.active,
					force: true,
				},
				visited: sharedBlockStates.visited,
			},
		},
		'elements/current': {
			name: 'elements/current',
			label: __('Current Page', 'blockera'),
			description: __('The current page number element.', 'blockera'),
			icon: <Icon icon="block-pagination-numbers-current" size="20" />,
			settings: {
				force: true,
			},
		},
		'elements/dots': {
			name: 'elements/dots',
			label: __('Dots', 'blockera'),
			description: __('The numbers separator dotes element.', 'blockera'),
			icon: <Icon icon="block-pagination-numbers-dots" size="20" />,
			settings: {
				force: true,
			},
		},
	},
	edit: (props) => {
		return <SharedBlockExtension {...props} />;
	},
};
