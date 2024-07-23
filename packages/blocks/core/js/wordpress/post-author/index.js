// @flow

/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import type { MixedElement } from 'react';

/**
 * Blockera dependencies
 */
import { SharedBlockExtension } from '@blockera/editor';
import { Icon } from '@blockera/icons';
import type { InnerBlocks } from '@blockera/editor/js/extensions/libs/inner-blocks/types';

const blockeraInnerBlocks: InnerBlocks = {
	avatar: {
		name: 'core/avatar',
		type: 'avatar',
		label: __('Avatar', 'blockera'),
		icon: <Icon icon="block-post-author-avatar" iconSize="20" />,
		selectors: {
			root: '.wp-block-post-author__avatar > img',
		},
		innerBlockSettings: {
			force: true,
		},
	},
	byline: {
		name: 'core/byline',
		type: 'byline',
		label: __('Byline', 'blockera'),
		icon: <Icon icon="block-post-author-byline" iconSize="20" />,
		selectors: {
			root: '.wp-block-post-author__byline',
		},
		innerBlockSettings: {
			force: true,
		},
	},
	author: {
		name: 'core/author',
		type: 'author',
		label: __('Name', 'blockera'),
		icon: <Icon icon="block-post-author-name" iconSize="20" />,
		selectors: {
			root: '.wp-block-post-author__name',
		},
		innerBlockSettings: {
			force: true,
		},
	},
	link: {
		name: 'core/link',
		type: 'link',
		label: __('Link', 'blockera'),
		icon: <Icon icon="block-link" iconSize="20" />,
		selectors: {
			root: 'a:not(.wp-element-button)',
		},
		innerBlockSettings: {
			force: true,
			dataCompatibility: ['font-color', 'font-color-hover'],
		},
	},
};

export const PostAuthor = {
	name: 'blockeraPostAuthor',
	targetBlock: 'core/post-author',
	blockeraInnerBlocks,
	edit: (props: Object): MixedElement => {
		return <SharedBlockExtension {...props} />;
	},
};
