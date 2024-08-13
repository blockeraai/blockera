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

export const Rss: BlockType = {
	name: 'blockeraRss',
	targetBlock: 'core/rss',
	blockeraInnerBlocks: {
		'elements/container': {
			name: 'elements/container',
			label: __('Item Container', 'blockera'),
			icon: <Icon icon="stack" library="wp" iconSize="20" />,
			settings: {
				force: true,
			},
		},
		'elements/title': {
			name: 'elements/title',
			label: __('Title', 'blockera'),
			icon: <Icon icon="title" library="wp" iconSize="20" />,
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
		'elements/date': {
			name: 'elements/date',
			label: __('Date', 'blockera'),
			icon: <Icon icon="post-date" library="wp" iconSize="20" />,
			settings: {
				force: true,
			},
		},
		'elements/excerpt': {
			name: 'elements/excerpt',
			label: __('Excerpt', 'blockera'),
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