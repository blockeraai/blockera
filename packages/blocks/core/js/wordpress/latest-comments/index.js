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
import sharedInnerBlocks from '../inners/shared';
import type { BlockType } from '../../type';

export const LatestComments: BlockType = {
	name: 'blockeraLatestComments',
	targetBlock: 'core/latest-comments',
	blockeraInnerBlocks: {
		'elements/container': {
			name: 'elements/container',
			label: __('Item Container', 'blockera'),
			icon: <Icon icon="stack" library="wp" iconSize="20" />,
			settings: {
				force: true,
			},
		},
		'elements/avatar': {
			name: 'elements/avatar',
			label: __('Avatar', 'blockera'),
			icon: (
				<Icon icon="comment-author-avatar" library="wp" iconSize="20" />
			),
			settings: {
				force: true,
			},
		},
		'elements/author': {
			name: 'elements/author',
			label: __('Author', 'blockera'),
			icon: <Icon icon="post-author" library="wp" iconSize="20" />,
			settings: {
				force: true,
			},
		},
		'elements/post-title': {
			name: 'elements/post-title',
			label: __('Post Title', 'blockera'),
			icon: <Icon icon="title" library="wp" iconSize="20" />,
			settings: {
				force: true,
			},
		},
		'elements/date': {
			name: 'elements/date',
			label: __('Date', 'blockera'),
			icon: <Icon icon="post-date" library="wp" iconSize="20" />,
			settings: {
				force: true,
			},
		},
		'elements/comment-text': {
			name: 'elements/comment-text',
			label: __('Comment', 'blockera'),
			icon: <Icon icon="post-excerpt" library="wp" iconSize="20" />,
			settings: {
				force: true,
			},
		},
	},
	edit: (props) => {
		return <SharedBlockExtension {...props} />;
	},
};