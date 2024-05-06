// @flow

/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import type { MixedElement } from 'react';

/**
 * Blockera dependencies
 */
import {
	SharedBlockExtension,
	sharedBlockExtensionSupports,
	sharedBlockExtensionAttributes,
	InnerBlockLinkIcon,
	InnerBlockImageIcon,
	InnerBlockParagraphIcon,
} from '@blockera/editor-extensions/js/libs';
import type { InnerBlocks } from '@blockera/editor-extensions/js/libs/inner-blocks/types';

/**
 * Internal dependencies
 */
import { InnerBlockAvatarIcon } from './icons/inner-block-avatar';
import { InnerBlockBylineIcon } from './icons/inner-block-byline';
import { InnerBlockNameIcon } from './icons/inner-block-name';

const attributes = sharedBlockExtensionAttributes;

const supports = sharedBlockExtensionSupports;

const blockeraInnerBlocks: InnerBlocks = {
	avatar: {
		name: 'core/avatar',
		type: 'avatar',
		label: __('Avatar', 'blockera'),
		icon: <InnerBlockAvatarIcon />,
		selectors: {
			root: '.wp-block-post-author__avatar > img',
		},
		attributes,
		innerBlockSettings: {
			force: true,
		},
	},
	byline: {
		name: 'core/byline',
		type: 'byline',
		label: __('Byline', 'blockera'),
		icon: <InnerBlockBylineIcon />,
		selectors: {
			root: '.wp-block-post-author__byline',
		},
		attributes,
		innerBlockSettings: {
			force: true,
		},
	},
	author: {
		name: 'core/author',
		type: 'author',
		label: __('Name', 'blockera'),
		icon: <InnerBlockNameIcon />,
		selectors: {
			root: '.wp-block-post-author__name',
		},
		attributes,
		innerBlockSettings: {
			force: true,
		},
	},
	link: {
		name: 'core/link',
		type: 'link',
		label: __('Link', 'blockera'),
		icon: <InnerBlockLinkIcon />,
		selectors: {
			root: 'a:not(.wp-element-button)',
		},
		attributes,
		innerBlockSettings: {
			force: true,
			dataCompatibility: ['font-color', 'font-color-hover'],
		},
	},
};

export const PostAuthor = {
	name: 'blockeraPostAuthor',
	targetBlock: 'core/post-author',
	attributes,
	supports,
	blockeraInnerBlocks,
	edit: (props: Object): MixedElement => {
		return <SharedBlockExtension {...props} />;
	},
};
