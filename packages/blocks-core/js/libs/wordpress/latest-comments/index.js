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
			description: __("Each comment's container element.", 'blockera'),
			icon: <Icon icon="target" iconSize="20" />,
			settings: {
				force: true,
			},
		},
		'elements/avatar': {
			name: 'elements/avatar',
			label: __('Avatar', 'blockera'),
			description: __("The comment's author avatar element.", 'blockera'),
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
			description: __("The comment's author name element.", 'blockera'),
			icon: <Icon icon="post-author" library="wp" iconSize="20" />,
			settings: {
				force: true,
			},
		},
		'elements/post-title': {
			name: 'elements/post-title',
			label: __('Post Title', 'blockera'),
			description: __("The comment's post title element.", 'blockera'),
			icon: <Icon icon="title" library="wp" iconSize="20" />,
			settings: {
				force: true,
			},
		},
		'elements/date': {
			name: 'elements/date',
			label: __('Date', 'blockera'),
			description: __("The comment's publish date element.", 'blockera'),
			icon: <Icon icon="post-date" library="wp" iconSize="20" />,
			settings: {
				force: true,
			},
		},
		'elements/comment-text': {
			name: 'elements/comment-text',
			label: __('Comment', 'blockera'),
			description: __("The comment's text element.", 'blockera'),
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
