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

export const PostAuthor: BlockType = {
	name: 'blockeraPostAuthor',
	targetBlock: 'core/post-author',
	blockeraInnerBlocks: {
		'core/avatar': {
			name: 'core/avatar',
			type: 'avatar',
			label: __('Avatar', 'blockera'),
			description: __(
				'The post author avatar image element.',
				'blockera'
			),
			icon: <Icon icon="block-post-author-avatar" iconSize="20" />,
			settings: {
				force: true,
			},
		},
		'elements/byline': {
			name: 'elements/byline',
			type: 'byline',
			label: __('Byline', 'blockera'),
			description: __('The post author byline text element.', 'blockera'),
			icon: <Icon icon="block-post-author-byline" iconSize="20" />,
			settings: {
				force: true,
			},
		},
		'elements/author': {
			name: 'elements/author',
			type: 'author',
			label: __('Author Name', 'blockera'),
			description: __('The post author name element.', 'blockera'),
			icon: <Icon icon="block-post-author-name" iconSize="20" />,
			settings: {
				force: true,
			},
		},
		'elements/link': sharedInnerBlocks['elements/link'],
	},
	edit: (props) => {
		return <SharedBlockExtension {...props} />;
	},
};
